'use strict'

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema; //Permitir crear un obeto de la bbdd

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

//automaticamente mongoDB le añade id
//Schema de user
var UsuarioSchema = Schema ({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

UsuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

//Para poder usarlo fuera
module.exports = mongoose.model('Usuario', UsuarioSchema); //Entidad, Schema