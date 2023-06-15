const jwt = require('jsonwebtoken'); //pour créer des Token et les vérifier

module.exports = (req, res, next) => {
    try { //permet de gérer les erreurs
        const token = req.headers.authorization.split(' ')[1]; //On récupère le token grâce à la fonction split pour tout récupérer après l'espace dans le header
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //On décode le token grâce à la méthode verify de jsonwebtoken
        const userId = decodedToken.userId; //On récupère l'userId du token décodé
        req.auth = { // On l'ajoute à l'objet request
            userId: userId
        };
	next();
} catch(error) {
    res.status(401).json({ error }); //Renvoie une erreur 401
}
};