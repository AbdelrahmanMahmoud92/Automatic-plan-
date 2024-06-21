const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    _id: {
        type:    String,
        default: uuidv4,
    },
    name:        String,
    email: {
        type:    String, 
        unique:  true,
    },
    password:    String,

    role:{
        type:    String,
        enum:    ['admin' ,'guest', 'restaurant_organization', 'flight_organization', 'hotel_organization'],
        default: 'user'
    },

    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'],
        default: 'accepted'
    }


}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;