'use strict'

//var fs = require('fs');

//var path = require('path'); // para trabajar con el sistema de ficheros
var bcrypt = require('bcryptjs'); //para encriptar passwords

var jwt = require('jsonwebtoken'); //token

var SEED = require('../config/config').SEED; //Clave secreta

var Usuario = require('../models/usuario');


// =============================
// Obtener todos los usuarios
// =============================
function getUsuarios(req, res){
  Usuario.find({}, 'nombre email role img').exec((err, usuarios) => {
    if(err){
      res.status(500).send({message: 'Error en la petición', error: err});    
    }
    else{
      if(!usuarios){
        res.status(404).send({message: 'No hay usuarios en la BBDD'});
      }
      else{
        res.status(200).send({usuarios});
      }
    }
  });
  
}

// =============================
// Crear nuevo usuario
// =============================
function saveUsuario(req, res){
  var body = req.body;

  var usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      img: body.img,
      role: body.role
  });
  /*
  Usuario.create(usuario, (err, usuarioGuardado) =>{
    if(err){
      res.status(500).send({message: 'Error en la petición', error: err});
    }
    else{
      res.status(201).send({usuarioGuardado});
    }
  });
  */
  usuario.save((err, usuarioGuardado) =>{
    if(err){
      res.status(400).send({message: 'Error en la petición', error: err});
    }
    else{
      res.status(201).send({usuarioGuardado});
    }
  });
  
}


// =============================
// Actualizar usuario
// =============================
function updateUsuario(req, res){
  var userId = req.params.id;
  var body = req.body;


  Usuario.findByIdAndUpdate(userId, body, (err, userUpdated) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }
    else{
      if(!userUpdated){
        res.status(400).send({message: 'No se ha podido actualizar el usuario', errors: err});
      }
      else{
        userUpdated.password = ':)';
        res.status(200).send({user: userUpdated});
      }
    }
  });
}


// =============================
// Borrar usuario
// =============================
function deleteUsuario(req, res){
  var userId = req.params.id;

  Usuario.findByIdAndRemove(userId, (err, userRemoved) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }
    else{
      if(!userRemoved){
        res.status(400).send({message: 'No existe ese usuario', errors: err});
      }
      else{
        userRemoved.password = ':)';
        res.status(200).send({user: userRemoved});
      }
    }
  });
}




// =============================
// Crear nuevo usuario
// =============================
function login(req, res){
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    console.log(err);

    if (err) {
      res.status(500).send({ ok: false, mensaje: 'Error al buscar usuario', errors: err });
    }
    else{
      if (!usuarioDB) {
        res.status(400).send({ ok: false, mensaje: 'Credenciales incorrectas - email', errors: err });
      }
      else{
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
          res.status(400).send({  ok: false, mensaje: 'Credenciales incorrectas - password', errors: err });
        }
        else{
          // Crear un token!!!
          usuarioDB.password = ':)';

          var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas
          res.status(200).send({ ok: true,  usuario: usuarioDB, token: token, id: usuarioDB._id });

        }
      }
    }
  })
}

module.exports = {
  getUsuarios,
  saveUsuario,
  updateUsuario,
  deleteUsuario,
  login
};