'use strict'

//var fs = require('fs');

//var path = require('path'); // para trabajar con el sistema de ficheros
var bcrypt = require('bcryptjs'); //para encriptar passwords
var jwt = require('jsonwebtoken'); //token

var SEED = require('../config/config').SEED; //Clave secreta
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID; //Clave de cliente id
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET; //Clave secreta de google

var Usuario = require('../models/usuario');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

var async = require('asyncawait/async');
var await = require('asyncawait/await');

// =============================
// Obtener todos los usuarios
// =============================
function getUsuarios(req, res){

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Usuario.find({}, 'nombre email role img')
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
      if(err){
        res.status(500).send({ok: false, message: 'Error en la petición', error: err});    
      }
      else{
        if(!usuarios){
          res.status(404).send({ok: false, message: 'No hay usuarios en la BBDD'});
        }
        else{
          Usuario.count({}, (err, total) => {
            res.status(200).send({ok: true, usuarios: usuarios, total: total});
          })
          
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
      res.status(400).send({ok: false, message: 'Error en la petición', error: err});
    }
    else{
      res.status(201).send({ok: true, usuario: usuarioGuardado});
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
      res.status(500).send({ok: false, message: 'Error en la petición', errors: err});
    }
    else{
      if(!userUpdated){
        res.status(400).send({ok: false, message: 'No se ha podido actualizar el usuario', errors: err});
      }
      else{
        userUpdated.password = ':)';
        res.status(200).send({ok: true, usuario: userUpdated});
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
      res.status(500).send({ok: false, message: 'Error en la petición', errors: err});
    }
    else{
      if(!userRemoved){
        res.status(400).send({ok: false, message: 'No existe ese usuario', errors: err});
      }
      else{
        userRemoved.password = ':)';
        res.status(200).send({ok: true, usuario: userRemoved});
      }
    }
  });
}

// =============================
// Iniciar sesion
// =============================
function login(req, res){
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
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


// =============================
// Iniciar sesion Google
// =============================

// Configuraciones de Google
var verifyAsync = async (function (token) {
    const ticket = await (client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }));

    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
});

var loginGoogle = async (function loginGoogleAsync(req, res){

  var token = req.body.token;

  var googleUser = await ( verifyAsync(token)
    .then( user => {
      return user;
    })
    .catch(e => {
          return {
            ok: false,
            errors: e,
            mensaje: 'Token no válido'
          };
    }));
  if(googleUser.ok == false){
    return res.status(403).json(googleUser);
  }
  Usuario.findOne({email: googleUser.email}, 
    (err, usuarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          errors: err,
          mensaje: 'Error al buscar usuario - login',
        });
      }
      if (usuarioDB) {
        if (usuarioDB.google === false) {
          return res.status(400).json({
            ok: false,
            err: {
              message: 'Debe de usar su autenticación normal'
            }
          });
        } 
        else {
          var token = jwt.sign({
            usuario: usuarioDB
          }, SEED, {
            expiresIn: 14400
          });
          return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
          });
        }
      } 
      else {
        // Si el usuario no existe en nuestra base de datos
        var usuario = new Usuario();
        usuario.nombre = googleUser.nombre;
        usuario.email = googleUser.email;
        usuario.img = googleUser.img;
        usuario.google = true;
        usuario.password = ':)';
        usuario.save((err, usuarioDB) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al crear usuario - google',
              errors: err
            });
          };
          var token = jwt.sign({
            usuario: usuarioDB
          }, SEED, {
            expiresIn: 14400
          });
          return res.json({
            ok: true,
            usuario: usuarioDB,
            token,
          });
        });
      }
  });
})

module.exports = {
  getUsuarios,
  saveUsuario,
  updateUsuario,
  deleteUsuario,
  login,
  loginGoogle
};