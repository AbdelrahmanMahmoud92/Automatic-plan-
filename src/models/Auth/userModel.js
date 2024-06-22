const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    _id: {
        type:    String,
        default: uuidv4,
    },

    name:{
        type:    String, 
        required: true
    },

    email: {
        type:    String, 
        unique:  true,
    },

    password:{
        type:    String, 
        required: true
    },

    // country:{
    //     type:    String, 
        // required: true
    // },
    
    role:{
        type:    String,
        enum:    ['admin' ,'guest', 'restaurant_organization', 'fligth_Company', 'hotel_organization'],
        default: 'user'
    },
    
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'],
        default: 'accepted'
    },
    
    cashAccount: {
        type:    String, 
        ref:     'Cash',    
    }


}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;