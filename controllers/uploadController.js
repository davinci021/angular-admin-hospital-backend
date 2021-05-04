const {response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizarImagen');
const path = require('path');
const fs = require('fs');

const fileUpload = (req, res = response) => {
    const tipo  =  req.params.tipo;
    const id    = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Tipo no compatible'
        })
    }

    //VAlidar que exista archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        })
    }

    //PROCESAR LA IMGEN... 
    const file = req.files.imagen;

    
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length -1];
    const extensionValidas = ["png","jpg","jpeg","gif"];
    

    //Validar extencion
    if (!extensionValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    //Generar nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    //path para guardar la imgen
    const path = `./uploads/${ tipo }/${nombreArchivo}`;

    //mover la imagen
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });    
        }

        actualizarImagen( tipo, id, path, nombreArchivo );


        res.json({
            ok: true, 
            nombreArchivo
        });
    })
}

const obtenerImagen = (req, res) => {
    const tipo  =  req.params.tipo;
    const foto  =  req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}`);
    
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileUpload,
    obtenerImagen
}