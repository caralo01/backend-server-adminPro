//Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express(); // defino el servidor

var port = process.env.PORT || 3977; //Poner puerto por defecto

//conexion a la BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
  //url para conectar con la bbdd 27017 puerto por defecto
  if(err){
    throw err;
  }
  //else{
    console.log("La base de datos está corriendo correctamente...");

  //  app.listen(port, function(){
  //    console.log("Servidor escuchando http://localhost:"+port);
  //  });
  //}

});

//Rutas
app.get('/', (req, res, next) =>{
  res.status(403).json({
    ok: true,
    mensaje: 'Petitición realizada correctamente'
  })
} )

//Escuchar peticiones, puerto y mensaje
app.listen(3000, () => {
  console.log('Express server puerto 3000: \x1b[32m',  'online');
});