const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Adresse Email Invalide'],
    required: 'Veuillez fournir une adresse e-mail'
  },
  name:{
    type: String,
    required: 'Veuillez fournir un nom',
    trim: true
  },


});

/****  gestion du password  ****/
// passportLocalMongoose se chargera d'ajouter les champs supplémentaires à notre schéma,
// ainsi que d'ajouter les méthodes supplémentaires pour créer nos nouvelles connexions

// Dans ce cas, nous allons utiliser l'adresse e-mail pour connecter les personnes.
userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
// c’est que cette validation nous donnera des messages d’erreur compréhensible
userSchema.plugin(mongodbErrorHandler);

// nous créons le modèle ici, nous le configurons pour être stocké
// Il pourra être utilisé où l'on voudra en rappelant mongoose.models('User')
module.exports = mongoose.model('User', userSchema);