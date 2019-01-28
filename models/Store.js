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
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      require: 'Vous devez fournir les coordonnées!'
    }],
    address: {
      type: String,
      required: 'Vous devez fournir une adresse!'
    }
  },
  photo: String
});

// ATTENTION : de ne pas utiliser à l'interrieur une fonction flêché 
// car on veut utiliser le THIS, pour l'objet que l'on va vouloir sauvegarder
storeSchema.pre('save', async function (next) {
  // Cette function sera lancé que lorsque le nom a été changé
  if (!this.isModified('name')) {
    next(); // Passer
    return; // arrêter cette fonction
  };
 
  this.slug = slug(this.name);  // son slug = son name, mais attention ici le slug peut ne pas $etre unique
  
  // TODO Faire que les slugs soit unique
  
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  // Explication : ^(${this.slug}) : commence par ${this.slug}
  // ()$ : fini par
  // -[0-9] : -0, -1 ... autant que besoin
  // *$ : cela se termine par cela
  // ? : cette partie est une option
  // en deuxième paramètre, i : insensible à la casse

  const storesWithSlug = await this.constructor.find( { slug : slugRegEx });
  // "this.constructor" sera égal à "store" au moment où il s'exécutera

  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    // ${storesWithSlug.length + 1} : permet de rendre le chiffre dynamique
    // Pour ne pas avoir de doublons
  };

  next();
})

// 
storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },   // ça décompresse les stores par tag
    { $group: { _id: '$tags', count: {$sum: 1} } },  
    // Regroupe les documents d'entrée en fonction d'une expression d'identifiant spécifié 
    // et applique la ou les expressions accumulatrices ici $sum
    { $sort: { count: -1 } }
  ]);
}


// nous créons le modèle ici, nous le configurons pour être stocké
// Il pourra être utilisé où l'on voudra en rappelant mongoose.models('Store')
module.exports = mongoose.model('Store', storeSchema);