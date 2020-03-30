import { FileUpload } from "./interfaces/file-upload";
import   path  from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    
         
    guardarImagenTemporal(file: FileUpload, userID: string) {
        //Crear carpeta
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaUsuario(userID);
            console.log(path);
            const nombreUnico = this.generarNombreUnico(file.name);
            file.mv(`${path}/${nombreUnico}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private generarNombreUnico(nombreOriginal: string) : string{

        const nombre=  nombreOriginal.split(".");
        const extension= nombre[nombre.length-1];
        const idUnico = uniqid();
        return `${idUnico}.${extension}`;
        

    }

    private crearCarpetaUsuario (userID : string) : string {
        const pathUser = path.resolve(__dirname, '../uploads',userID);
        const pathUserTemp = pathUser+'/temp';
        const existe = fs.existsSync(pathUser);
      if (!existe){
         fs.mkdirSync(pathUser);
         fs.mkdirSync(pathUserTemp);

      }
      
      return pathUserTemp;  
    
    }

    imagenesdeTempHaciaPost(userID: string){
        const pathTemp = path.resolve(__dirname, '../uploads',userID,'temp');
        const pathPost = path.resolve(__dirname, '../uploads',userID,'posts');

        if (!fs.existsSync(pathTemp)){
            return [];
        }
        if (!fs.existsSync(pathPost)){
            fs.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userID);
        imagenesTemp.forEach(imagen=>{
            fs.renameSync(`${pathTemp}/${imagen}`,`${pathPost}/${imagen}`);
        })
        return imagenesTemp;

    }

    private obtenerImagenesEnTemp(userID: string){
        const pathTemp = path.resolve(__dirname, '../uploads',userID,'temp');
        return fs.readdirSync(pathTemp) || [];
    }

}