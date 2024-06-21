const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { v4: uuidv4 } = require('uuid');


const roomSchema = new mongoose.Schema({
    _id: {
        type:     String,
        default:  uuidv4
    },

    hotelId: {
        type:     String,
        ref:      "Hotel"
    },

    hotelName: {
        type:     String,
        ref:      "Hotel"
    },

    roomNumber: {
        type:     Number,
        unique :  true,
        startAt: 100,
    },

    priceInNight: Number,

    isAvailable:  Boolean,

    roomLevel: {
        type:     String,
        enum:     ['Standard', 'Superior', 'Deluxe', 'Grand Deluxe', 'Junior Suite', 'Deluxe Suite', 'Presidential Suite']
    }
});

roomSchema.plugin(AutoIncrement, { inc_field: 'roomNumber', start_seq: 100 });
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;