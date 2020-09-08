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

const actualizarMedico = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);

        if(!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }
    
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            msg: 'Médico Actualizado',
            medico: medicoActualizado
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar actualizar el medico'
        })
    }
};

const borrarMedico = async(req, res = response) => {
    const id = req.params.id;

    try {

        const medico = await Medico.findById(id);

        if(!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado'
            })
        }
        // borrado de la bd
        // cambiar a un borrado logico
        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico Eliminado'
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar actualizar el médico'
        })
    }
};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}