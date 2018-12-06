const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// Cela va nous permettre de donner des noms conviviaux aux URL pour nos slugs
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  // Une règle générale est de faire toute la normalisation de vos données aussi près que possible du modèle.
  // Passer à ce niveau les différentes propriété
  name: {
    // c'est une chaîne de caractère
    type: String,
    // On supprime les espaces avant et après
    trim: true,
    // On affiche le message d'erreur si le name n'est pas renseigné
    required: 'Entrer un nom de magasin !'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  // on peut attendre une chaîne de caractères simple ou multiple 
  // qui seront stockées sous forme de tableau
  tags: [String]
});

// ATTENTION : de ne pas utiliser à l'interrieur une fonction flêché 
// car on veut utiliser le THIS, pour l'objet que l'on va vouloir sauvegarder
storeSchema.pre('save', function (next) {
  // Cette function sera lancé que lorsque le nom a été changé
  if (!this.isModified('name')) {
    next(); // Sauter
    return; // arrêter cette fonction
  }
  this.slug = slug(this.name);  // son slug = son name
  next();
  // TODO Faire que les slugs soit unique
})

// nous créons le modèle ici, nous le configurons pour être stocké
// Il pourra être utilisé où l'on voudra en rappelant mongoose.models('Store')
module.exports = mongoose.model('Store', storeSchema);