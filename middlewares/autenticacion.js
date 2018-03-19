'use strict'

var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// =============================
// Verificar token
// =============================
exports.verificaToken = function(req, res, next) {

  if(!req.headers.authorization){
    return res.status(403).send({message: 'La petición no  tiene la cabecera de autenticación'})
  }

  var token = req.headers.authorization.replace(/['"]+/g, '');

  jwt.verify(token, SEED, (err, decoded) => {

    if (err) {
      return res.status(401).json({
          ok: false,
          mensaje: 'Token incorrecto',
          errors: err
      });
    }

    req.usuario = decoded.usuario;

    next();


  });

}