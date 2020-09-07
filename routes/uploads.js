/**
 * Rutas Uploads /api/uploads/
 */
const { Router } = require('express');
const exprFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornarArchivo } = require('../controllers/uploads');

const router = new Router();
router.use(exprFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
router.put('/:tipo/:archivo', retornarArchivo);

module.exports = router;