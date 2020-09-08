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

const actualizarHospital = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById(id);

        if(!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }
    
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            msg: 'Hospital Actualizado',
            hospital: hospitalActualizado
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar actualizar el hospital'
        })
    }
};

const borrarHospital = async (req, res = response) => {
    const id = req.params.id;

    try {

        const hospital = await Hospital.findById(id);

        if(!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }
        // borrado de la bd
        // cambiar a un borrado logico
        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital Eliminado'
        })        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar actualizar el hospital'
        })
    }
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}