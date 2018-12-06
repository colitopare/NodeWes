/*
  C 'est un fichier de données et 
  de fonctions d'assistance que nous pouvons exposer et 
  utiliser dans notre fonction de modèles
*/

// FS est un module intégré à Node qui nous permet de lire les fichiers du système sur lequel nous fonctionnons
const fs = require('fs');

// moment.js est une bibliothèque pratique pour afficher les dates. Nous avons besoin de cela dans nos modèles pour afficher des choses comme "Publié il y a 5 minutes"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Now That's Delicious!`;

// Rassemble les données qui seront afficher au niveau du menu
// se sera utiliser dans le template layout via 
exports.menu = [
  { slug: '/stores', title: 'Stores', icon: 'store', },
  { slug: '/tags', title: 'Tags', icon: 'tag', },
  { slug: '/top', title: 'Top', icon: 'top', },
  { slug: '/add', title: 'Add', icon: 'add', },
  { slug: '/map', title: 'Map', icon: 'map', },
];
