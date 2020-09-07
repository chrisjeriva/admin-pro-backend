const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    const page = Number(req.query.page) || 0;
    const rows = Number(req.query.rows) || 10;

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google')
                .skip(page)
                .limit(rows),

        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });

};

const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const existeEmail = await  Usuario.findOne({email});
        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado.'
            });
        } else {
            const usuario = new Usuario(req.body);

            // Encriptando contraseña
            const salt = bcryptjs.genSaltSync();
            usuario.password = bcryptjs.hashSync(password, salt);

            //guardamos el usuario
            await usuario.save();

            // Creando el JWT
            const token = await generateJWT(usuario.id);

            // solo se puede responder un res.json una sola vez por bloque de codigo
            res.json({
                ok: true,
                usuario,
                token
            });
        }
    }catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs...'
        });
    }


   

};

const actualizarUsuario = async (req, res = response) => {
    // TODO: validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    try {
        // Validamos si existe el usuario
        const usuarioDB = await Usuario.findById(uid);
       
        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con el id proporcionado'
            });
        }

        
        // Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if(usuarioDB.email !== email) {
            // validamos si el correo nuevo existe en bd
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya esiste un usuario con ese email.'
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs...'
        })
    }
};

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    try {
        // Validamos si existe el usuario
        const usuarioDB = await Usuario.findById(uid);
       
        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con el id proporcionado'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar borrar el usuario'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario, 
    actualizarUsuario,
    borrarUsuario
};