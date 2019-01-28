const mongoose = require('mongoose');
// Ici je stocke le modèle User dans la constante User
// car je vais en avoir besoin
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register'});
};

exports.validateRegister = (req, res, next) => {

  req.sanitizeBody('name');
  req.checkBody('name', 'Vous devez fournir un nom!').notEmpty();

  req.checkBody('email', "Cet email n'est pas valide ").isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });

  req.checkBody('password', "Le mot de passe ne peut pas être vide").notEmpty();
  req.checkBody('password-confirm', "Confirmer le mot de passe ne peut pas être vide").notEmpty();
  req.checkBody('password-confirm', "Oups! Vos mots de passe ne correspondent pas").equals(req.body.password);

  const errors = req.validationErrors();
  if (errors){
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;   // Arrête la fonction 
  }
  next(); // s'il n'y a pas d'erreur
};

exports.register = async (req, res, next) => {

  const user = new User({ name: req.body.name, email: req.body.email });
  // promisify, Convertit les fonctions basées sur le rappel en promesses ES6/ES2015, 
  // en utilisant une fonction de rappel standard.
  // https://www.npmjs.com/package/es6-promisify
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); // c'est OK, passer à authController.login
};