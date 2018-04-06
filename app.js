var user_routes = require('./routes/usuario');'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

// Inicializar variables
var app = express(); // defino el servidor


//cargar rutas
var user_routes = require('./routes/usuario');
var hospital_routes = require('./routes/hospital');
var medico_routes = require('./routes/medico');
var busqueda_routes = require('./routes/busqueda');
var upload_routes = require('./routes/upload');
var imagen_routes = require('./routes/imagen');


//BodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http
//middlewares
app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*'); //Permitemos el acceso a todos los dominios
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); //Permitemos los métodos http mas comuines
  res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');

  next();
});

//Configurar archivos de subida
app.use(fileUpload());

//rutas bases
app.use('/api', user_routes);
app.use('/api', hospital_routes);
app.use('/api', medico_routes);
app.use('/api', busqueda_routes);
app.use('/api', upload_routes);
app.use('/api', imagen_routes);



module.exports = app;