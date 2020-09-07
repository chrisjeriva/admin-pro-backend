const fs = require('fs');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const borrarArchivo = (path) => {
    if(fs.existsSync(path)) {
        // eliminamos el archivo anterior
        fs.unlinkSync(path);
    }
}

const actualizarArchivo = async (tipo, id, nombreArchivo) => {
    let prevPath = '';
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if(!medico) {
                return false;
            }

            prevPath = `./uploads/medicos/${medico.img}`;

            borrarArchivo(prevPath);
          
            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if(!hospital) {
                return false;
            }

            prevPath = `./uploads/hospitales/${hospital.img}`;

            borrarArchivo(prevPath);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario) {
                return false;
            }

            prevPath = `./uploads/usuarios/${usuario.img}`;

           borrarArchivo(prevPath);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;
    }
}

module.exports = {
    actualizarArchivo
}