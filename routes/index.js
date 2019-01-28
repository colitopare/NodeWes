const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
// On utilise de destructuring car on a besoin uniquement de la fonction catchErrors
const { catchErrors } = require('../handlers/errorHandlers');
const authController = require('../controllers/authController');

// Le traitement se fera au niveau du controller storeController
// On met catchErrors() dès que l'on fait une fonction asynchrone dans le contrôleur
// Pour pouvoir afficher les erreurs
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

router.get('/add', storeController.addStore); // Affiche le formulaire

// Création du store avec les données du fomulaire passé en POST
// et on va attraper les erreurs qui pourront survenir de async et awit
router.post('/add', 
  storeController.upload,                   // télécharger en mémoire vive
  catchErrors(storeController.resize),      // redimensionner function async
  catchErrors(storeController.createStore)  // sauvegarder le store
  ); 
router.post('/add/:id', 
  storeController.upload,                   // télécharger en mémoire vive
  catchErrors(storeController.resize),      // redimensionner function async
  catchErrors(storeController.updateStore)  // modifier le store
  );
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoreByTag));

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1 - nous devons valider les données d’ enregistrement.
// 2 - nous devons enregistrer l 'utilisateur.
// 3 - nous devons les connecter, une fois qu’ ils ont fait l’ enregistrement.
router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login
  );

// ici on export une fonction
module.exports = router;
