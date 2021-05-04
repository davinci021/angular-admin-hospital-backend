const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/googleVerify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async( req, res = response) => {
    const { email, password } = req.body;
    try {
        //VERIFICAR EMAIL
        const usuarioDB = await Usuario.findOne({ email })
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }  
        //VERIFICAR CONTRASEÑA
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //GENERAR TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );

        if (usuarioDB && validPassword) {
            res.json({
                ok: true,
                msg: 'Inicio exitoso.',
                usuarioDB,
                token,
                menu: getMenuFrontEnd(usuarioDB.role)
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


const googleSignIn = async (req, res) => {
    const googleToken = req.body.token;
    /* try { */
        const { name, email, picture } = await googleVerify(googleToken);
        //
        const usuarioDB = await Usuario.findOne({email});
        
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }
        //guardar en la DB
        await usuario.save();
        
        //GENERAR TOKEN - JWT
        const token = await generarJWT( usuario.id );
        console.log(googleToken);
        
        res.json({
            ok: true,
            msg: 'Google ok',
            //token,
            menu: getMenuFrontEnd(usuario.role),
            name, email, picture, token
        });
    /* } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Error inesperado'
        });
    } */
}

const renewToken = async (req, res= response) => {

    const uid = req.uid;

    //GENERAR TOKEN - JWT
    const token = await generarJWT( uid );

    const usuarioDB = await Usuario.findById(uid, 'nombre email img role');

    res.json({
        ok: true,
        usuarioDB,
        token,
        msg: 'autenticado',
        menu: getMenuFrontEnd(usuarioDB.role)
    })
}


module.exports = {
    login, googleSignIn, renewToken
}