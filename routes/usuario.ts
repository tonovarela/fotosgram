import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import  bcrypt  from 'bcrypt'
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';



const userRoutes = Router();

userRoutes.post('/update', verificaToken,(req: any,res: Response) => {

    const body = req.body;
    const user = {
        nombre: body.nombre,
        email: body.email,
        avatar: body.avatar
    }

   console.log(req.usuario);
   console.log("fdfdf");
   
    Usuario.findByIdAndUpdate( req.usuario._id, user, {new : true},(err, userDB)=>{
        if (err) throw err;
        if (!userDB){
            return res.json({
                ok:false,
                mensaje: 'No existe usuario en la base'
            })
        }
        const tokenUsuario = Token.getJWToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token:tokenUsuario
        });
    });
    // res.json({
    //     ok: true,
    //     usuario: req.usuario
    // })

});

userRoutes.post('/create',(req: Request,res: Response ) =>{

    const salt = '$2b$10$tWy7SsinP/iJFiMAWp9Bze';
    const hash = bcrypt.hashSync( req.body.password,salt);
  
     const user = {
      nombre: req.body.nombre,
      email:req.body.email,
      password:hash, 
      avatar: req.body.avatar
     }

     Usuario.create(user ).then( userDB => {

        const tokenUsuario = Token.getJWToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar

        });

        res.json({
            ok: true,
            mensaje:'Todo funciona bien',
            token: tokenUsuario
           });

     }
    ).catch(err => {
         res.json({
             ok:false,
             err
         })
    });
     

   
});

userRoutes.post('/login', (req: Request,res: Response) => {

    const body = req.body;
     Usuario.findOne({ email: body.email}, (err, UserDB)=>{
         if (err) throw err;
         if (!UserDB){
             return res.json({
                 ok:false,
                 mensaje: 'Usuario/ constraseña no es correcto' 
             })
         }
         if (UserDB.compararPassword(body.password)){
             const tokenUsuario = Token.getJWToken({
                 _id: UserDB._id,
                 nombre: UserDB.nombre,
                 email: UserDB.email,
                 avatar: UserDB.avatar
             });
             res.json({
                 ok: true,
                 token:tokenUsuario

             });
         }else {
            return res.json({
                ok:false,
                mensaje: 'Usuario/ constraseña no es correcto ' 
            })
         }

     });

});


export default userRoutes;