const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const { response } = require('express');
// getBusqueda

const getBusqueda = async(req, res = response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre : regex }),
        Medico.find({ nombre : regex }),
        Hospital.find({ nombre : regex })
    ])
    
    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales     
    })

}

const getBusquedaCollection = async(req, res = response) => {
    const clase = req.params.clase;
    const termino = req.params.termino;
    const regex = new RegExp( termino, 'i');
    let data = [];

    switch (clase) {
        case 'usuario':
            data = await Usuario.find({ nombre: regex});
            
            break;
        case 'medico':
            data = await Medico.find({ nombre: regex})
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
            
            break;
        case 'hospital':
            data = await Hospital.find({ nombre: regex})
                                .populate('usuario', 'nombre img');
            break;
        default:
            res.status(400).json({
                ok: false,
                msg: "Termino no valido"
            });
            break;
    }

    res.json({
        ok: true,
        resultado : data
    });

    
}


module.exports = {
    getBusqueda,
    getBusquedaCollection
}