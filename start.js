// Pattern SINGLETON
const mongoose = require('mongoose');

// Assurez-vous que nous exécutons une version de node  > 7.6
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}

// importer des variables d'environnement à partir de notre fichier variables.env
require('dotenv').config({ path: 'variables.env' });

// Connectez-vous à notre base de données et gérez les mauvaises connexions
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Dites à Mongoose d'utiliser les promesses ES6
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

/********* IMPORTATION DES MODELES DE L'APPLICATION  ***********/
// C'est le seul endroit où l'on va importer tous nos modèles 
// Ils seront importés qu’une seule fois car dès que vous vous connecterez à MongoDB 
// et dès que vous importerez vos modèles, 
// MongoDB le saura tout au long de votre application.
require('./models/Store');

// Start notre app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
