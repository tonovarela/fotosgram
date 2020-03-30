import { Usuario } from './../models/usuario.model';
import { FileUpload } from './../classes/interfaces/file-upload';

import { verificaToken } from './../middlewares/autenticacion';
import { Router, Response, Request } from 'express';
import { Post } from '../models/post.model';
import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();


//Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = await Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .populate('usuario', '-password')
        .limit(10)
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    })
});

//Crear POST
postRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    

    const imagenes=fileSystem.imagenesdeTempHaciaPost(req.usuario._id);    
    body.imgs=imagenes;

    Post.create(body).then(async postDB => {
        await postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    }).catch(err => {
        res.json(err);
    });



});



//Servicio para subir Archivos 
postRoutes.post('/upload', [verificaToken],async(req: any, res: Response) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
     const file: FileUpload = req.files.image;
     if (!file){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        });
     }
     if (!file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensaje: 'El archivo no es una imagen'
        });
     }     
     await fileSystem.guardarImagenTemporal(file,req.usuario._id);     
    res.json({
        ok: true,
        file : file.mimetype        
    })
});




export default postRoutes;