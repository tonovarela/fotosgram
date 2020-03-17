
import Server from  './classes/server';
import userRoutes from './routes/usuario';
import mongoose, { mongo } from 'mongoose';
import bodyParser from 'body-parser';
const server = new Server();


//Body parser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

//Rutas de la app
server.app.use('/user', userRoutes)


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