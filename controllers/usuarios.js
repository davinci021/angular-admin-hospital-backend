const Usuario = require('../models/usuario');
const { response } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;

    /* const usuario = await Usuario.find({}, 'nombre email role google')
                                .skip( desde )
                                .limit( 5 );
    
    const total = await Usuario.count(); */

    //PROMISE: de esmc6 promesa que puede ejecutar varias promesas 
    const [ usuario, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),

        Usuario.countDocuments()
    ])
    
    res.json({
        ok: true,
        usuario,
        total
        //uid: req.uid
        
    });
}

const crearUsuario = async(req, res = response) => {

    const { email , password, nombre } = req.body;

      try {
        //Verificar existencia de usuario 
        const existeEmail = await Usuario.findOne({ email });
        //Si existe, se retorna un status que temina la peticion 
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado.'
            });
        }

        //Si el mail no existe se crea un nuevo usuario
        const usuario = new Usuario( req.body );

        //ENCRIPTAR PASS
        const salt = bcrypt.genSaltSync();
        //Se guarda la variable encriptada en la instancia usuario
        usuario.password = bcrypt.hashSync(password, salt);
        
        //Se realiza una promesa esperando que la informacion se guarde en la base de datos
        const user = await usuario.save();

        //CREACION DEL TOKEN
        const token = await generarJWT( user.id );
    
        res.json({
            ok: true,
            usuario, 
            token
        });
        
    //Cualquier otro error lo captura el catch
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });
    }
}

const actualizarUsuarios = async (req, res = response) => {
    const uid = req.params.id;
    
    try {
        //Actualizaciones
        //buscar en db y guardar usuario en variable
        const usuarioDB = await Usuario.findById( uid );
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            })
        }
        //DESDE EL FRONTEND GUARDAR EL JSON 
        const { password, google, email, ...campos} = req.body;
        // (USUARIO_DATABASE === USUARIO_FRONTEND)
        if (usuarioDB.email !== email ) {
            //SE ELIMINA EL CAMPO EMAIL
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        
        campos.email = email;
        const usuario = await Usuario.findByIdAndUpdate( uid, campos, { new: true});

        res.json({
            ok: true,
            usuario       
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {
        //##################################################
        // VERIFICAR SI EXISTE EL USUARIO EN LA BASE DE DATOS
        const usuarioDB = await Usuario.findById( uid );
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            })
        }
        // FIN VERIFICACION
        //##################################################
        // SI ID EXISTE EN LA BASE DE DATOS 
        if ( usuarioDB ) {
            // SE ENCUENTRA Y SE BORRA
            const usuarioBorrado = await Usuario.findByIdAndDelete( uid );
            //console.log(usuarioBorrado);
    
            res.json({
                ok: true,
                usuarioBorrado       
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuarios,
    borrarUsuario
}

//al realizar una metodo de eliminar, borrar, editar se debe:
/* 
RUTAS                               CONTROLLER
router.get('/', middleware, method) const method = async(req, res) => {}
1. Crear la ruta                    1.Crear metodo
2. Importar metodo de controller    2.Exportarlo en module.export
3. Validacion por middleware        3.Trycatch
4. Llamar al metodo controller
*/