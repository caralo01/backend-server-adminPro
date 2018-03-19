'use strict'

var express = require('express');
var ImagenController = require('../controllers/imagen');

var api = express.Router();

var mdAutenticacion = require('../middlewares/autenticacion');


//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

//Rutas
api.get('/img/:tipo/:img', mdAutenticacion.verificaToken, ImagenController.getFile);

module.exports = api;

