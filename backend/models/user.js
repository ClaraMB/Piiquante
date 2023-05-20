const mongoose = require('mongoose'); //Importation de Mongoose

const uniqueValidator = require('mongoose-unique-validator') // Importation de uniqueValidator

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); //on utilise plugin pour ne pas avoir 2 utilisateurs avec le même email

module.exports = mongoose.model('User', userSchema);