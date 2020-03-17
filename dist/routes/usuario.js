"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const body = req.body;
    const user = {
        nombre: body.nombre,
        email: body.email,
        avatar: body.avatar
    };
    console.log(req.usuario);
    console.log("fdfdf");
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe usuario en la base'
            });
        }
        const tokenUsuario = token_1.default.getJWToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUsuario
        });
    });
    // res.json({
    //     ok: true,
    //     usuario: req.usuario
    // })
});
userRoutes.post('/create', (req, res) => {
    const salt = '$2b$10$tWy7SsinP/iJFiMAWp9Bze';
    const hash = bcrypt_1.default.hashSync(req.body.password, salt);
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: hash,
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUsuario = token_1.default.getJWToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            mensaje: 'Todo funciona bien',
            token: tokenUsuario
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, UserDB) => {
        if (err)
            throw err;
        if (!UserDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/ constraseña no es correcto'
            });
        }
        if (UserDB.compararPassword(body.password)) {
            const tokenUsuario = token_1.default.getJWToken({
                _id: UserDB._id,
                nombre: UserDB.nombre,
                email: UserDB.email,
                avatar: UserDB.avatar
            });
            res.json({
                ok: true,
                token: tokenUsuario
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/ constraseña no es correcto '
            });
        }
    });
});
exports.default = userRoutes;
