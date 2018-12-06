// je nome un exports que j'utiliserai dans ma routes/index.js
// Ici je vais récupérer les requêtes clients, 
// les traiter en allant chercher la bonne information en sécurisant un max
// puis je retournerai la réponse

/*
// Exemple d'un middleware maison
exports.myMiddleware = (req, res, next) => {
  req.name = "Muriel";
  if (req.name === "Muriel") {
   // Permet d'inserrer une erreur afin qu'elle soit vu si besoin avec un try catch automatique
   // Qui se trouve dans le fichier ./handlers/errorHandlers.js   
   //throw Error(`Ici j'affiche une erreur perso`);
  }
  next();
};
*/
const mongoose = require('mongoose');
// Ici je stocke le modèle Store dans la constante Store
// car je vais en avoir besoin
const Store = mongoose.model('Store');


exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Ajouter un magasin'
  });
};

// Grâce à async et await (ES8), on continuera la ligne après le await 
// que lorsque la sauvegarde 
// sera fini ou aura renvoyer une erreur
exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  // Pour utiliser les messages flash il y a success, warning, error and info
  req.flash('success', `Félicitation, le magasin ${store.name} a bien été créé `);
  res.redirect(`/store/${store.slug}`);
};

// Pour afficher tous les magasins
exports.getStores = async (req,res) => {
  // 1. Interroger la Bdd pour obtenir une liste de tous les magasins
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores: stores });
};

exports.editStore = async (req, res) => {
  // 1. Interroger la Bdd pour obtenir le magasin dont l'ID est passer dans l'URL
  const store = await Store.findOne({ _id: req.params.id});  
  // 2. confirmer qu'ils sont le propriétaire du magasin
  // TODO
  // 3. Rendre le formulaire de modification pour que l'utilisateur puisse mettre à jour son magasin
  res.render('editStore', {
    title: `Modifier ${store.name} `,
    store: store
  });
};

exports.updateStore = async (req, res) => {
  const store = await store.findOneAndUpdate(req.params.id);
  // Pour utiliser les messages flash il y a success, warning, error and info
  req.flash('success', `Félicitation, le magasin ${store.name} a bien été modifié `);
  res.redirect(`/store/${store.slug}`);
};