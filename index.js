'use strict'

var mongoose = require('mongoose'); //Libreria para la bbdd
var app = require('./app'); //Cargamos fichero, es el que va tener todas las rutas
var port = process.env.PORT || 3977; //Poner puerto por defecto

mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
//url para conectar con la bbdd 27017 puerto por defecto
  if(err){
    throw err;
  }
  else{
    console.log("La base de datos está corriendo correctamente...");

    app.listen(port, function(){
      console.log("Servidor escuchando http://localhost:"+port);
    });
  }
}); 