const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
/* 
    RUTA: /api/hospitales
*/
const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedicos, getMedico, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get('/', validarJWT, getMedicos);
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido').isMongoId(),
        validarCampos,
    ],
    crearMedico
);
router.put('/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarMedico
);
router.delete('/:id',
    validarJWT,
    borrarMedico
);

router.get( '/:id',
    validarJWT,
    getMedico
);


module.exports = router;