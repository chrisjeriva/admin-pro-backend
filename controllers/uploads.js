const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const actualizarArchivo = require('../helpers/actualizar-archivo');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    
    if (!tiposValidos.includes(tipo) ) {
        return res.status(400).json({
            ok: false,
            msg: 'Tipo incorrecto'
        });
    }

    // Validamos si existe un archivo
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se seleccionó ningun archivo'
        });
    }

    // Procesar el archivo
    const file = req.files.file;

    const fileNameSplit = file.name.split('.');
    const ext = fileNameSplit[fileNameSplit.length - 1];
    const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];

    // nombre archivo 
    const nombreArchivo = `${ uuidv4() }.${ ext }`;

    //creando path
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Validar extension
    if(!validExtensions.includes(ext)) {
        return res.status(400).json({
            ok: false,
            msg: 'Extensión no permitida'
        });
    }

  // mover el archivo
  file.mv(path, function(err) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover el archivo.'
            });
        }

        // actualizar base de datos
        actualizarArchivo(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Se adjunto el archivo.',
            nombreArchivo
        });
    });
}


const retornarArchivo = (req, res = response) => {
    const tipo = req.params.tipo;
    const archivo = req.params.archivo;
    let pathFile = '';
    
    pathFile = path.join(__dirname, `../uploads/${tipo}/${archivo}`);

    // file/imagen por defecto
    if(!fs.existsSync(pathFile)) {
        pathFile = path.join(__dirname, `../uploads/no-image.png`);
        res.sendFile(pathFile);
    }

    res.sendFile(pathFile);
}

module.exports = {
    fileUpload,
    retornarArchivo
}