const express = require('express'); //Création d'un router Express pour enregistrer les routes

const router = express.Router(); // Crée le router de chaque middleware

const userCtrl = require('../controllers/user'); //Importation du fichier user du dossier Controllers

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;