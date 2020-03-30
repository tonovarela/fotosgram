"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    guardarImagenTemporal(file, userID) {
        //Crear carpeta
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaUsuario(userID);
            console.log(path);
            const nombreUnico = this.generarNombreUnico(file.name);
            file.mv(`${path}/${nombreUnico}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        const nombre = nombreOriginal.split(".");
        const extension = nombre[nombre.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userID) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userID);
        const pathUserTemp = pathUser + '/temp';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesdeTempHaciaPost(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userID, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads', userID, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userID);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesEnTemp(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userID, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
}
exports.default = FileSystem;
