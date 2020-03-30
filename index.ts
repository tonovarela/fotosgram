
import Server from  './classes/server';

import mongoose, { mongo } from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from  'express-fileupload'

import postRoutes from './routes/post';
import userRoutes from './routes/usuario';
const server = new Server();


//Body parser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

//File Upload
server.app.use(fileUpload({ useTempFiles: true}));

//Rutas de la app
server.app.use('/user', userRoutes)
server.app.use('/post', postRoutes)


//Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram',{
    
    useNewUrlParser:true, useCreateIndex: true, useUnifiedTopology:true
},(err)=>{
    if (err){
        throw err;
    }
    console.log("Base de datos online")
});
mongoose.set('useFindAndModify', false);
//Levantar express
server.start(() =>{
    console.log(`Servidor corriendo en puerto ${server.port}`)
});