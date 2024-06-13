const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: String,
    email: {
        type: String, 
        unique: true,
    },
    password: String,
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;