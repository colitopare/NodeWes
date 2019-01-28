const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
require('./handlers/passport');

// créez votre application Express
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // c'est le dossier où nous gardons nos fichiers pug
app.set('view engine', 'pug'); // on peut aussi en utiliser d'autre comme ejs par exemple 

// sert des fichiers statiques à partir du dossier public. 
// Tout ce qui est en public / sera simplement servi sous la forme du fichier
// Il s'agit d'une fonction middleware intégrée à Express. 
// Il sert des fichiers statiques et est basé sur serve-static.
app.use(express.static(path.join(__dirname, 'public')));

// Prend les demandes brutes et les transforme en propriétés utilisables sur req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Expose un tas de méthodes pour valider les données. Très utilisé sur userController.validateRegister
app.use(expressValidator());

// remplit req.cookies avec tous les cookies accompagnant la demande
app.use(cookieParser());

// Les sessions nous permettent de stocker des données sur les visiteurs de requête en requête
// Cela garde les utilisateurs connectés et nous permet d'envoyer des messages flash
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport JS est ce que nous utilisons pour gérer nos login.
app.use(passport.initialize());
app.use(passport.session());

// Le middleware flash utilise req.flash ('error', 'Shit!'), Qui transmettra ce message à la page suivante demandée par l'utilisateur
app.use(flash());

// passer des variables à nos modèles + toutes les demandes
app.use((req, res, next) => {
  // lorsque dans les templates on utilisera h se sera pour helpers
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// nous gérons enfin nos propres routes!
app.use('/', routes);

// Si les routes ci-dessus ne fonctionnent pas, nous les 404 et les transmettons au gestionnaire d'erreurs
app.use(errorHandlers.notFound);

// Un de nos gestionnaires d'erreurs verra si ces erreurs ne sont que des erreurs de validation
app.use(errorHandlers.flashValidationErrors);

// Sinon c'était une erreur à laquelle nous ne nous attendions pas! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
