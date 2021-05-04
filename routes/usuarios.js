const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const  { validarADMIN_ROLE, validarADMIN_ROLE_O_MISMO_USER } = require('../middlewares/validar-jwt');
/* 
    RUTA: /api/usuarios
*/
const { getUsuarios, crearUsuario, actualizarUsuarios, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, validarADMIN_ROLE, getUsuarios);
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
        
    ],
     crearUsuario
);
router.put('/:id', 
    [
        [validarJWT,validarADMIN_ROLE_O_MISMO_USER],   
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarUsuarios
);
router.delete('/:id',
    [validarJWT, validarADMIN_ROLE],
    borrarUsuario
);




module.exports = router;