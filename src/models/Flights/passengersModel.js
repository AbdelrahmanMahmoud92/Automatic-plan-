const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const passengerSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },

    flightID: {
        type:    String,
        ref:     'Flight',
    },
    
    flightNumber: {
        type:    String,
        ref:     'Flight',
    },

    passengerID: {
        type:    String,
        ref:     'User',
    },
    
    passengerName: {
        type:    String,
        ref:     'User',
    }
});

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;
