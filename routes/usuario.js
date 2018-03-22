'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');


var api = express.Router();




var mdAutenticacion = require('../middlewares/autenticacion');


//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

//Rutas
api.get('/usuarios', mdAutenticacion.verificaToken, UsuarioController.getUsuarios);
api.post('/usuarios', UsuarioController.saveUsuario);
api.put('/usuario/:id', mdAutenticacion.verificaToken, UsuarioController.updateUsuario); 
api.delete('/usuario/:id', mdAutenticacion.verificaToken, UsuarioController.deleteUsuario);  
api.post('/login', UsuarioController.login);
api.post('/login/google', UsuarioController.loginGoogle);

/*
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser); 
api.get('/users/:id?/:role?/:page?/:search?', md_auth.ensureAuth, UserController.getUsers); 
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.get('/studentsLogopeda/:id?/:role?/:page?/:search?', md_auth.ensureAuth, UserController.getStudents);
*/

module.exports = api;
