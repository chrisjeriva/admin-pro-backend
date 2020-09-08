/**
 * Rutas Medicos /api/Medicos
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require("../controllers/Medicos");

const router = new Router();

router.get('/', validarJWT, getMedicos);
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es es obligatorio.').not().isEmpty(),
        check('hospital', 'El hospital es incorrecto.').isMongoId(),
        validarCampos
    ], 
    crearMedico);

router.put('/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital es incorrecto.').isMongoId(),
        validarCampos
    ],
    actualizarMedico);

router.delete('/:id', 
        validarJWT,
        borrarMedico
);


module.exports = router;