const Hospital = require('../models/hospital');
const { response } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const hospital = require('../models/hospital');
const Usuario = require('../models/usuario');

const getHospitales = async(req, res) => {
    const hospitales = await Hospital.find()
                                    .populate('usuario','nombre email img');
    res.json({
        ok: true,
        hospitales
        //uid: req.uid
        
    });

}

const crearHospital = async(req, res = response) => {
    const uid = req.uid;
    const nombre = req.body;
    const hospital = new Hospital({ 
        usuario: uid,
        ...req.body 
    });
    
    try {
        /* const existeHospital = await hospital.findOne({ nombre });
        //Si existe, se retorna un status que temina la peticion 
        if ( existeHospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'El Hospital' + existeHospital + 'ya esta registrado.'
            });
        } */
    
    
        const hospitalDB = await hospital.save();
    
        res.json({
            ok: true,
            hospital: hospitalDB
        });
        
    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'No creado hospital'
        });
    }




}

const actualizarHospital = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const hospitalDB = await Hospital.findById(id);
        console.log(hospitalDB);
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no existe en la base de datos'
            });
        } else if(hospitalDB){
            const { nombre, usuario, ...campos} = req.body
            campos.nombre = nombre;
            campos.usuario = uid;
            const hospitalActualizado = await Hospital.findByIdAndUpdate(id, campos, {new: true});
            res.json({
                ok: true,
                hospitalActualizado
            });
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'algo malo sucedio '
        })
    }

}

const borrarHospital = async(req, res = response) => {

    const hid = req.params.id;
    console.log(req.params.id);

    const hospitalDB = await Hospital.findById(hid);

    if (!hospitalDB) {
        return res.status(500).json({
            ok: false,
            msg: 'Hospittal no existe en la base de datos'
        })  
    } 

    const hospitalEliminado = await Hospital.findByIdAndDelete(hid);


    res.json({
        ok: true,
        hospitalEliminado,
        msg: 'Hospital ha sido borrado'
    });
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}

