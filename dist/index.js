"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./routes/post"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const server = new server_1.default();
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//File Upload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//Rutas de la app
server.app.use('/user', usuario_1.default);
server.app.use('/post', post_1.default);
//Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
}, (err) => {
    if (err) {
        throw err;
    }
    console.log("Base de datos online");
});
mongoose_1.default.set('useFindAndModify', false);
//Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
