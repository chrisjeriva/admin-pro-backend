const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getAll = async(req, res = response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );

    try {
        const [usuarios, medicos, hospitales] = await Promise.all([ 
            Usuario.find({ nombre: regex }),
            Medico.find({ nombre: regex }),
            Hospital.find({ nombre: regex })
        ]);

        res.json({
            ok: true,
            msg: 'Estas haciendo una búsqueda general',
            usuarios,
            medicos,
            hospitales
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar realizar una busqueda.'
        })
    }
};

const getDocumentosColeccion = async (req, res = response) => {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );
    let data = [];
    try {
        switch ( tabla ) {
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre')
                break;
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');
                break;
            case 'usuarios':
                data = await Usuario.find({ nombre: regex })
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'No se encontró la colección.'
                });
                break;
        }

        res.json({ 
            ok: true,
            resultados: data
        });
    } catch (err) { 
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar realizar una busqueda.'
        });
    }
}

module.exports = {
    getAll, 
    getDocumentosColeccion
}