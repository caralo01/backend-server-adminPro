'use strict'

var fileUpload = require('express-fileupload');

var fs = require('fs');

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ==============================
// Subida de ficheros
// ==============================
function fileUploadF(req, res) {

  var tipo = req.params.tipo;
  var id = req.params.id;

  // tipos de colección
  var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
  if (tiposValidos.indexOf(tipo) < 0) {
    res.status(400).send({
      ok: false,
      mensaje: 'Tipo de colección no es válida',
      errors: {
        message: 'Tipo de colección no es válida'
      }
    });
  } else {
    if (!req.files) {
      res.status(404).send({
        ok: false,
        message: 'No seleccionó nada',
        error: {
          message: 'Debe de seleccionar una imagen.'
        }
      });
    } else {
      var archivo = req.files.imagen;
      var file_split = archivo.name.split('.');
      var file_ext = file_split[file_split.length - 1];

      var ext_validate = ['png', 'jpg', 'gif', 'jpeg'];
      if (ext_validate.indexOf(file_ext) < 0) {
        res.status(404).send({
          ok: false,
          message: 'Extensión no válida',
          error: {
            message: 'Las extensiones válidas son ' + ext_validate.join(', ')
          }
        });

      } else {

        // Nombre de archivo personalizado
        var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ file_ext }`;
        // Mover el archivo del temporal a un path
        var path = `./uploads/${ tipo }/${ nombreArchivo }`;
        archivo.mv(path, err => {

          if (err) {
            res.status(500).send({
              ok: false,
              mensaje: 'Error al mover archivo',
              errors: err
            });
          } else {
            subirPorTipo(tipo, id, nombreArchivo, res);
          }
        })

      }
    }
  }
}

function subirPorTipo(tipo, id, nombreArchivo, res) {

  if (tipo === 'usuarios') {

    Usuario.findById(id, (err, usuario) => {

      if (!usuario) {
        return res.status(400).json({
          ok: true,
          mensaje: 'Usuario no existe',
          errors: {
            message: 'Usuario no existe'
          }
        }); 
      }


      var pathViejo = './uploads/usuarios/' + usuario.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      usuario.img = nombreArchivo;

      usuario.save((err, usuarioActualizado) => {

        usuarioActualizado.password = ':)';

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de usuario actualizada',
          usuario: usuarioActualizado
        });

      })


    });

  }

  if (tipo === 'medicos') {

    Medico.findById(id, (err, medico) => {

      if (!medico) {
        return res.status(400).json({
          ok: true,
          mensaje: 'Médico no existe',
          errors: {
            message: 'Médico no existe'
          }
        });
      }

      var pathViejo = './uploads/medicos/' + medico.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      medico.img = nombreArchivo;

      medico.save((err, medicoActualizado) => {

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de médico actualizada',
          usuario: medicoActualizado
        });

      })

    });
  }

  if (tipo === 'hospitales') {

    Hospital.findById(id, (err, hospital) => {

      if (!hospital) {
        return res.status(400).json({
          ok: true,
          mensaje: 'Hospital no existe',
          errors: {
            message: 'Hospital no existe'
          }
        });
      }

      var pathViejo = './uploads/hospitales/' + hospital.img;

      // Si existe, elimina la imagen anterior
      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      hospital.img = nombreArchivo;

      hospital.save((err, hospitalActualizado) => {

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen de hospital actualizada',
          usuario: hospitalActualizado
        });

      })

    });
  }

}


module.exports = {
  fileUploadF
};