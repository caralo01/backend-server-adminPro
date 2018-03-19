'use strict'

var fs = require('fs');

// ==============================
// Obtener imagen
// ==============================
function getFile(req, res) {

  var tipo = req.params.tipo;
  var img = req.params.img;

  var path = `./uploads/${ tipo }/${ img }`;

  fs.exists(path, existe => {

      if (!existe) {
          path = './assets/no-img.jpg';
      }

      res.sendfile(path);

  });
}

module.exports = {
  getFile
};