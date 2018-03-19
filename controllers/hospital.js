'use strict'

//var fs = require('fs');

//var path = require('path'); // para trabajar con el sistema de ficheros

var Hospital = require('../models/hospital');


// =============================
// Obtener todos los hospitales
// =============================
function getHospitales(req, res){

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err, hospitales) => {
      if(err){
        res.status(500).send({ok: false,  message: 'Error en la petición', error: err});    
      }
      else{
        if(!hospitales){
          res.status(404).send({ok: false, message: 'No hay hospitales en la BBDD', error: err});
        }
        else{
          res.status(200).send({ok: false,  hospitales: hospitales});
        }
      }
  });
  
}

// =============================
// Crear nuevo hospital
// =============================
function saveHospital(req, res){
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: body.usuario,
    img: body.img
  });

  console.log(hospital);

  hospital.save((err, hospitalGuardado) =>{
    if(err){
      res.status(400).send({ok: false,  message: 'Error en la petición', error: err});
    }
    else{
      res.status(201).send({ok: true,  hospital: hospitalGuardado});
    }
  });
  
}


// =============================
// Actualizar hospital
// =============================
function updateHospital(req, res){
  var hospitalId = req.params.id;
  var body = req.body;


  Hospital.findByIdAndUpdate(hospitalId, body, (err, hospitalUpdated) => {
    if(err){
      res.status(500).send({ok: false, message: 'Error en la petición', errors: err});
    }
    else{
      if(!hospitalUpdated){
        res.status(400).send({ok: false, message: 'No se ha podido actualizar el hospital', errors: err});
      }
      else{
        res.status(200).send({ok: true, hospital: hospitalUpdated});
      }
    }
  });
}


// =============================
// Borrar hospital
// =============================
function deleteHospital(req, res){
  var hospitalId = req.params.id;

  Hospital.findByIdAndRemove(hospitalId, (err, hospitalRemoved) => {
    if(err){
      res.status(500).send({ok: false, message: 'Error en la petición', errors: err});
    }
    else{
      if(!hospitalRemoved){
        res.status(400).send({ok: false, message: 'No existe ese hospital', errors: err});
      }
      else{
        res.status(200).send({ok: true, hospital: hospitalRemoved});
      }
    }
  });
}

module.exports = {
  getHospitales,
  saveHospital,
  updateHospital,
  deleteHospital
};