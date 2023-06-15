const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //pour créer des Token et les vérifier

exports.signup = (req, res, next) => { // fonction pour enregistrer de nouveaux utilisateurs
    bcrypt.hash(req.body.password, 10) //fonction de hachage du mdp
    .then(hash => {
        const user = new User({ //on créer le nouvel utilisateur 
        email: req.body.email, //avec l'email donné dans le corps de la requête
        password: hash //et le mdp crypté par bcrypt
    });
    user.save() // on enregistre dans la BDD
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => { // fonction pour connecter les utilisateurs existants
    User.findOne({ email: req.body.email }) //On vérifie si l'utilisateur existe déjà dans la BDD
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(req.body.password, user.password) // on utilise la fonction compare de bcrypt pour comparer le mot de passe avec le hash
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign( //on utilise la fonction sign pour chiffrer un nouveau token
                        { userId: user._id }, //il contient l'ID de l'utilisateur
                        'RANDOM_TOKEN_SECRET', //chaîne secrête pour crypter le token
                        { expiresIn: '24h' } //durée de validité du token
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}