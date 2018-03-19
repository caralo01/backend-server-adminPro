'use strict'

var express = require('express');
var HospitalController = require('../controllers/hospital');

var api = express.Router();

var mdAutenticacion = require('../middlewares/autenticacion');


//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

//Rutas
api.get('/hospitales', mdAutenticacion.verificaToken, HospitalController.getHospitales);
api.post('/hospital', HospitalController.saveHospital);
api.put('/hospital/:id', mdAutenticacion.verificaToken, HospitalController.updateHospital); 
api.delete('/hospital/:id', mdAutenticacion.verificaToken, HospitalController.deleteHospital);  


module.exports = api;
