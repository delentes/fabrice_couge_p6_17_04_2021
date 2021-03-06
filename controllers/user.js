//import
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const MaskData = require('maskdata');
const passwordValidator = require('password-validator');

const shemaPassValid = new passwordValidator();

shemaPassValid
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

// User creation middleware
exports.signup = (req, res, next) => {
    if (!shemaPassValid.validate(req.body.password)) {
        res.status(401).json({message:"Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre pour un minimum de 8 caractères"});
    } else {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: MaskData.maskEmail2(req.body.email),
            password: hash
        });
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
    }
};

// Middleware user login
exports.login = (req, res, next) => {
    User.findOne({email: MaskData.maskEmail2(req.body.email)})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};