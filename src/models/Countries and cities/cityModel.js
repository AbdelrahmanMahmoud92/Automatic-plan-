const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const citySchema = new mongoose.Schema({
    _id: {
        type:       String,
        default:    uuidv4,
    },
    cityName: {
        type:       String,
        unique:     true,
    },
    conutryName: {
        type:       String,
        ref:        'Country',
    },
    conutryID: {
        type:       String,
        ref:        'Country',
    },
});


const City = mongoose.model('City', citySchema);

module.exports = City;