const express = require('express'); //Importation d'Express
const mongoose = require('mongoose'); //Importation de Mongoose
require('dotenv').config();

const sauceRoutes = require('./routes/sauce'); //Importation du fichier sauce.js du dossier Routes
const userRoutes = require('./routes/user'); //Importation du fichier user.js du dossier Routes
const path = require('path'); //Importation du path du serveur

mongoose.connect(process.env.MONGODB_URL,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); //Déclaration de l'application

app.use(express.json()); // Donne accès au body de la requête

app.use((req, res, next) => { //Middleware appliqué à toutes les routes pour ajouter des headers et accéder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;