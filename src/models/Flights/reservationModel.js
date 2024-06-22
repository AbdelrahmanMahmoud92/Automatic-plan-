const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reservationSchema = mongoose.Schema({
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

    userID: {
        type:    String,
        ref:     'User',
    },
    
    userName: {
        type:    String,
        ref:     'User',
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
