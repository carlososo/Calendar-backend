const {response} =require ('express');
const  Evento  = require('../models/Evento');


const getEventos = async(req, res=response)=>{

    const eventos =await Evento.find()
                                .populate('user','name');

    res.status(200).json({
        ok:true,
        eventos
    })
}

const crearEvento = async(req, res=response)=>{
    
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado =await evento.save()

        res.json({
            ok:true,
            evento:eventoGuardado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'hable con el administrador'
        });
    }
}
const actualizarEventos = async(req, res=response)=>{

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'Evento no existe por ese ID'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: "No Puede editar ese registro, privilegios necesarios"
            })
        }

        const nuevoEvento ={
            ...req.body,
            user:uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento,{new: true});

        res.json({
            ok:true,
            evento:eventoActualizado
        });


        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'hable con el administrador'
        })
    }
    

   
}
const eliminarEventos = async(req, res=response)=>{

    const eventoId = req.params.id;
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'Evento no existe por ese ID'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg: "No Puede eliminar ese registro, privilegios necesarios"
            })
        }



        await Evento.findOneAndDelete(eventoId);

        res.json({
            ok:true,
            evento:'Elemento eliminado'
        });


        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'hable con el administrador'
        })
    }
}

module.exports={
    getEventos,
    crearEvento,
    actualizarEventos,
    eliminarEventos
}