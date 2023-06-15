const mongoose = require('mongoose'); //Importation de Mongoose

const sauceSchema = mongoose.Schema({ //la méthode Schéma de Mongoose permet de créer un schéma de données pour la BDD
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true}, 
    imageUrl: {type: String, required: true}, 
    heat: {type: Number, default: 0}, 
    likes: {type: Number, default: 0},
    dislikes :  {type: Number, default: 0},
    usersLiked : { type: [String] },
    usersDisliked: { type: [String] }
});

module.exports = mongoose.model('Sauce', sauceSchema); // la méthode model transforme ce modèle en un modèle utilisable