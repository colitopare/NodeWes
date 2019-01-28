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

/********  POUR UPLOADER DES FICHIERS **************/
// le middleware appelé multer va nous permettra de télécharger le fichier
// https://www.npmjs.com/package/multer
const multer = require('multer');

// Redimenssionnement des photos
// https://www.npmjs.com/package/jimp
const jimp = require('jimp');

// Identifiant unique des fichiers télécharger

const uuid = require('uuid');

/********  POUR UPLOADER DES FICHIERS - suite - **************/
// Nous devons donner 2 options :
// storage : Où le fichier sera-t-il stocké une fois téléchargé? ici on lui dit en mémoire vive
// et filefilter : Quels types de fichiers sont autorisés?
const multerOptions = {
  storage: multer.memorystorage,
  filefilter(req, file, next) {
    const isPhoto = file.minetype.startsWidth("image/");
    if (isPhoto){
      next(null, true)
    } else {
      next({
        message: "Ce type de fichier n'est pas autorisé"
      }, false)
    }
  } 
}

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Ajouter un magasin'
  });
};

//*********** SUITE UPLOAD FICHIER *********/
// Ici on précise ce que l'on veux uploader et sur quel champs 
// ATTENTION ici ça stocke le fichier dans la mémoire du serveur et pas sur le disque (en dur)
exports.upload = multer(multerOptions).single('photo');
// redimensionner les photos s'il y a
exports.resize = async (req, res, next) => {
  // vérifier s'il n'y a pas de nouveau fichier à redimensionner
  if (!req.file) {
    next(); // passer au middleware suivant
    return;
    // j'aurais aussi pu écrire 
    // if (!req.file) return next();
  }
  // split('/')[1] permet de récupérer la deuxième valeur après la spéaration /
  const extension = req.file.mimetype.split('/')[1];
  // Je compose le nom du fichier qui sera enregistrer en BDD avec un nom unique grâce à uuid.v4()
  req.body.photo = `${uuid.v4()}.${extension}`;
  // redimensionnement
    // read
  const photo = await jimp.read(req.file.buffer);
    // redimensionnement
  await photo.resize(800, jimp.AUTO);
    // écriture dans le dossier avec le nom de fichier générer unique
  await photo.write(`./public/uploads/${req.body.photo}`);
  // passer au middleware suivant
  next();
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
  res.render('stores', { 
    title: 'Stores', 
    stores: stores 
  });
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
  // https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id },
    req.body, 
    {
      new: true, // retourner le nouveau store au lieu de l'ancien
      runValidators: true
    })
    .exec();
  // Pour utiliser les messages flash il y a success, warning, error and info
  req.flash('success', `Félicitation, le magasin <strong>${store.name}</strong> a bien été modifié.
  <a href="/stores/${store.slug}">Voir magasin -> </a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({slug: req.params.slug});
  if (!store) return next();

  res.render('store', {
    title: store.name,
    store: store
  });
};

exports.getStoreByTag = async (req, res) => { 
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true};
  // https://docs.mongodb.com/manual/reference/operator/query/exists/

  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });

  const [tags, stores] = await Promise.all([tagsPromise, storesPromise])
   // res.json(tags); // Pour afficher le retour de Store.getTagsList()
  
  res.render('tags', { 
    tags: tags, 
    title: 'tags', 
    tag: tag, 
    stores: stores
  });
  //****  équivaut à 
/*   res.render('tags', {
    tags: tags,
    title: 'tags',
    tag,
    stores
  }); */
  
};