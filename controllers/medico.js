'use strict'

//var fs = require('fs');

//var path = require('path'); // para trabajar con el sistema de ficheros

var Medico = require('../models/medico');


// =============================
// Obtener todos los medicos
// =============================
function getMedicos(req, res){

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {
      if(err){
        res.status(500).send({ok: false,  message: 'Error en la petición', error: err});    
      }
      else{
        if(!medicos){
          res.status(404).send({ok: false, message: 'No hay medicos en la BBDD', error: err});
        }
        else{
          Medico.count({}, (err, total) => {
            res.status(200).send({ok: false,  medicos: medicos, total: total});
          });
        }
      }
  });
  
}

// =============================
// Crear nuevo medico
// =============================
function saveMedico(req, res){
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    usuario: body.usuario,
    hospital: body.hospital,
    img: body.img
  });

  medico.save((err, medicoGuardado) =>{
    if(err){
      res.status(400).send({ok: false,  message: 'Error en la petición', error: err});
    }
    else{
      res.status(201).send({ok: true,  medico: medicoGuardado});
    }
  });
  
}


// =============================
// Actualizar medico
// =============================
function updateMedico(req, res){
  var medicoId = req.params.id;
  var body = req.body;

  Medico.findByIdAndUpdate(medicoId, body, (err, medicoUpdated) => {
    if(err){
      res.status(500).send({ok: false, message: 'Error en la petición', errors: err});
    }
    else{
      if(!medicoUpdated){
        res.status(400).send({ok: false, message: 'No se ha podido actualizar el medico', errors: err});
      }
      else{
        res.status(200).send({ok: true, medico: medicoUpdated});
      }
    }
  });
}


// =============================
// Borrar medico
// =============================
function deleteMedico(req, res){
  var medicoId = req.params.id;

  Medico.findByIdAndRemove(medicoId, (err, medicoRemoved) => {
    if(err){
      res.status(500).send({ok: false, message: 'Error en la petición', errors: err});
    }
    else{
      if(!medicoRemoved){
        res.status(400).send({ok: false, message: 'No existe ese medico', errors: err});
      }
      else{
        res.status(200).send({ok: true, medico: medicoRemoved});
      }
    }
  });
}

module.exports = {
  getMedicos,
  saveMedico,
  updateMedico,
  deleteMedico
};