
const Medico = require('../models/medico');

const getMedicos = async(req, res) => {
    const medicos = await Medico.find()
                                .populate('hospital', 'nombre img')
                                .populate('usuario' , 'nombre img');


    res.json({
        ok: true,
        medicos
    });
}

const getMedico = async(req, res) => {
    const mid = req.params.id;
    const medico = await Medico.findById(mid)
                                .populate('hospital', 'nombre img')
                                .populate('usuario' , 'nombre img');

    res.json({
        ok: true,
        medico
    });
}

const crearMedico = async(req, res) => {
    const uid = req.uid;
    const hospital = req.body;
    const medico = new Medico({ 
        usuario: uid,
        //hospital: 
        ...req.body 
    });

    console.log(uid);
    

    try {
        const medicodb = await medico.save();

        res.json({
            ok: true,
            medico : medicodb
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "Error inesperado"
        })
    }
}

const actualizarMedico = async (req, res) => {
    const mid = req.params.id;

    try {
        const medicoDB = await Medico.findById(mid);
    
        if (!medicoDB) {
            return res.status(404),json({
                ok: false,
                msg: 'Medico no encontrado en la base de datos'
            })
        }
    
        const { nombre, ...campos} = req.body;
        campos.nombre = nombre;
        campos.usuario = req.uid;
    
        const medicoActualizado = await Medico.findByIdAndUpdate(mid, campos, {new: true});
        
        res.json({
            ok:true,
            medicoActualizado,
            msg: "Medico Actualizado"
        });
        
    } catch (error) {
        res.status(404).json({
            ok:false,
            msg: "Error en la actualizacion"
        });
    }
}

const borrarMedico = async (req, res) => {

    const mid = req.params.id;

    try {
        
        const medicoDB = await Medico.findById(mid);
    
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado en la base de datos'
            });
        }
    
        const medicosEliminado = await Medico.findByIdAndDelete(mid);
    
        res.json({
            ok: true,
            medicosEliminado
        });

    } catch (error) {
        res.status(500).json({
                ok: false,
                msg: 'Algo malo sucedio'
            });
    }
}

module.exports = {
    getMedicos, getMedico, crearMedico, actualizarMedico, borrarMedico
}