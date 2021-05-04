/* 
RUTA: /api/hospitales
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { fileUpload, obtenerImagen } = require('../controllers/uploadController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(expressFileUpload());


router.get('/:tipo/:foto', obtenerImagen);
router.put('/:tipo/:id', validarJWT, fileUpload);

module.exports = router;