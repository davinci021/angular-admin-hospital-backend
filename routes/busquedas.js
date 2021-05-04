const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
/* 
RUTA: /api/busqueda
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getBusqueda, getBusquedaCollection } = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', validarJWT, getBusqueda );

router.get('/:clase/:termino', validarJWT, getBusquedaCollection);


module.exports = router;