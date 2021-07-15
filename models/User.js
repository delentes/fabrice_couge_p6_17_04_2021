const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Data schema that contains the desired fields for each user
const userShema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true }
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);