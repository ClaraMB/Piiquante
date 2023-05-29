const Sauce = require('../models/sauce');
const fs = require('fs'); // on importe le package fs de Node

//POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

//PUT
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
    };

//DELETE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

//GET
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => { //Pour intercepter uniquement les requêtes GET pour ce middleware
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

//like et dislike
exports.likeSauce = (req, res, next) => {    
    const like = req.body.like; //On extraie la valeur de la propriété "like" de l'objet "req.body" et on l'assigne à une constante 
    if(like === 1) { //valeur like = 1 = l'utilisateur aime la sauce 
        Sauce.updateOne({_id: req.params.id}, { $inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Votre Like a bien été ajouté' }))
        .catch(error => res.status(400).json({ error }))

    } else if(like === -1) { //valeur like = -1 = l'utilisateur n'aime pas la sauce (Dislike)
        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Votre Dislike a bien été ajouté'}))
        .catch(error => res.status(400).json({ error }))

    } else { //Annulation du bouton "Like" ou "Dislike"
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if(sauce.usersLiked.indexOf(req.body.userId)!== -1){
                Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1},$pull: {usersLiked: req.body.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Vous n avez pas réagit à cette sauce'}))
                .catch(error => res.status(400).json({ error }))
                }
                
            else if(sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Vous n avez pas réagit à cette sauce'}))
                .catch(error => res.status(400).json({error}))
                }           
        })
        .catch(error => res.status(400).json({ error }))             
    }   
};
