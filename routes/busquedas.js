/**
 * Rutas Busquedas /api/all
 */
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getAll, getDocumentosColeccion } = require('../controllers/busquedas');

const router = new Router();

router.get('/:busqueda', validarJWT, getAll);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);

module.exports = router;