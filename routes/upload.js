'use strict'

var express = require('express');
var UploadController = require('../controllers/upload');

var api = express.Router();

var mdAutenticacion = require('../middlewares/autenticacion');


//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

//Rutas
api.put('/upload/:tipo/:id', mdAutenticacion.verificaToken, UploadController.fileUploadF);

module.exports = api;
