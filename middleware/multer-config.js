const multer = require('multer');

const MINE_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MINE_TYPES[file.minetype];
        callback(null, name + Date.now() + '.' + extention);
    }
});

module.exports = multer({storage:storage }).single('image');