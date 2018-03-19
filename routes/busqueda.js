'use strict'

var express = require('express');
var BusquedaController = require('../controllers/busqueda');

var api = express.Router();

var mdAutenticacion = require('../middlewares/autenticacion');


//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

//Rutas
api.get('/coleccion/:tabla/:busqueda', mdAutenticacion.verificaToken, BusquedaController.findByCollection);
api.get('/todo/:busqueda', mdAutenticacion.verificaToken, BusquedaController.findGeneral);

module.exports = api;
