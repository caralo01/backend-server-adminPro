'use strict'

var express = require('express');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express(); // defino el servidor

//cargar rutas
var user_routes = require('./routes/usuario');

//BodyParser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http
//middlewares
/*
app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*'); //Permitemos el acceso a todos los dominios
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POSTS, OPTIONS, PUT, DELETE'); //Permitemos los métodos http mas comuines
  res.header('Allow','GET, POSTS, OPTIONS, PUT, DELETE');

  next();
});
*/

//rutas bases
app.use('/api', user_routes);


module.exports = app;