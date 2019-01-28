const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Connexion échouée !!',
  successRedirect: '/',
  successFlash: 'Vous êtes maintenant connecté !'
});