const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const {email, password} = req.body;

    try {

        // Validando Email
        const usuarioDb = await Usuario.findOne({email});

        if(!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no válido'
            });
        }

        // Validando contraseña
        const validPassword = bcryptjs.compareSync(password,usuarioDb.password);

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar JWT
        const token = await generateJWT(usuarioDb.id);

        res.json({
            ok: true,
            token
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({ 
            ok: false, 
            msg: 'Ocurrió un error al intentar iniciar sesión'
        });
    }
}


module.exports = {
    login
}