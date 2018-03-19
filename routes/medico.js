'use strict'

var express = require('express');
var MedicoController = require('../controllers/medico');

var api = express.Router();

var mdAutenticacion = require('../middlewares/autenticacion');


//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

//Rutas
api.get('/medicos', mdAutenticacion.verificaToken, MedicoController.getMedicos);
api.post('/medico', MedicoController.saveMedico);
api.put('/medico/:id', mdAutenticacion.verificaToken, MedicoController.updateMedico); 
api.delete('/medico/:id', mdAutenticacion.verificaToken, MedicoController.deleteMedico);  


module.exports = api;
