const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {
    try {
        const medicos = await Medico.find()
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img')
        res.json({
            ok: true,
            medicos: medicos
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar obtener los médicos'
        });
    }
};

const crearMedico = async(req, res = response) => {
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        
        const medicoDB = await medico.save();
        
        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar crear el médico'
        });
    }

   
};

const actualizarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    })
};

const borrarMedico = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}