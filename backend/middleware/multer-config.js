const multer = require('multer'); //importation de multer

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //diskStorage configure le chemin et le nom de fichier pour les fichiers entrants
    destination: (req, file, callback) => { //les images sont stockées dans le dossier images
    callback(null, 'images');
},
filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
}
});

module.exports = multer({storage: storage}).single('image');