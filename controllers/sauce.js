const Sauce = require('../models/Sauce');
const fs = require('fs');
const xss = require('xss')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete req.body._id;
    const sauce = new Sauce({
        name: xss(sauceObject.name),
        manufacturer: xss(sauceObject.manufacturer),
        description: xss(sauceObject.description),
        mainPepper: xss(sauceObject.mainPepper),
        userId: xss(sauceObject.userId),
        heat: sauceObject.heat,
        likes:0,
        dislikes:0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(Sauce => {
        switch(req.body.like) {
            case +1:
                Sauce.updateOne({_id: req.params.id}, {$push: {userLiked: req.body.userId}, $inc: {like: +1}})
                    .then(() => res.status(200).json({ message: 'Sauce aimée !'}) )
                    .catch(error => res.status(400).json({ error }));
            break;

            case 0:
                Sauce.updateOne({_id: req.params.id}, {$push: {userCancel: req.body.userId}, $inc: {cancel: 0}})
                    .then(() => res.status(200).json({ message: 'Annulation !'}))
                    .catch(error => res.status(400).json({ error }));
            break;

            case -1:
                Sauce.updateOne({_id: req.params.id}, {$push: {userDisliked: req.body.userId}, $inc: {dislike: -1}})
                    .then(() => res.status(200).json({ message: 'Sauce pas aimée !'}))
                    .catch(error => res.status(400).json({ error }));
            break;

            default:
                console.log(req.body.like)
        }
    })
    .catch(error => res.status(404).json({ error }));
};