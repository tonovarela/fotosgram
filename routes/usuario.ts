import { Router, Request, Response } from "express";


const userRoutes = Router();
userRoutes.post('/create',(req: Request,res: Response ) =>{

     const user = {
      nombre: req.body.nombre,
      email:req.body.email,
      password:req.body.password
     }
     

    res.json({
     ok: true,
     mensaje:'Todo funciona bien'
    });
});


export default userRoutes;