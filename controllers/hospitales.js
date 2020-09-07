const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {

    try {
        
        const hospitales = await Hospital.find()
                                        .populate('usuario', 'nombre img');

        res.json({
            ok: true,
            hospitales: hospitales
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar obtener los hospitales'
        });
    }
    
};

const crearHospital = async(req, res = response) => {
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });
    
    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar crear el hospital'
        });
    }
};

const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    })
};

const borrarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarHospital'
    })
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}