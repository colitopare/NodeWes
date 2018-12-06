const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// On utilise de destructuring car on a besoin uniquement de la fonction catchErrors
const { catchErrors } = require('../handlers/errorHandlers');

// Le traitement se fera au niveau du controller storeController
// On met catchErrors() dès que l'on fait une fonction asynchrone dans le contrôleur
// Pour pouvoir afficher les erreurs
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

router.get('/add', storeController.addStore); // Affiche le formulaire
// Création du store avec les données du fomulaire passé en POST
// et on va attraper les erreurs qui pourront survenir de async et awit
router.post('/add', catchErrors(storeController.createStore)); 
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));


// ici on export une fonction
module.exports = router;
