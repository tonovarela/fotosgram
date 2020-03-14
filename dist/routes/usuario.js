"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes = express_1.Router();
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password
    };
    res.json({
        ok: true,
        mensaje: 'Todo funciona bien'
    });
});
exports.default = userRoutes;
