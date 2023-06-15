const express = require('express'); //Création d'un router Express pour enregistrer les routes
const router = express.Router(); // Crée le router de chaque middleware

const auth = require('../middleware/auth'); //On importe le middleware d'authentification
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce'); //Importation du fichier sauce du dossier Controllers

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;