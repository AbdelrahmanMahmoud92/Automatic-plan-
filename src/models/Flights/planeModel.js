const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const planeSchema = new mongoose.Schema({
    _id: {
        type:    String,
        default: uuidv4,
    },

    modelName: {
        type:     String,
        required: true, 
        unique:   true 
    },

    planeType: {
        type:     String,
        enum:     ['public', 'private'],
        required: true,  
    },

    passengerCapacity: {
        type:     Number,
        required: true,          
    },

    ticketPrice: {
        Economy: {
            type: Number,
            required: true  
        },
        Business: {
            type: Number,
            required: true  
        },
        FirstClass: {
            type: Number,
            required: true  
        }
    },
    
    isAvailable:  Boolean,
});

const Plane = mongoose.model('Plane', planeSchema);

module.exports = Plane;
