const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const countrySchema = new mongoose.Schema({
    _id: {
        type:    String,
        default: uuidv4,
    },
    countryName: {
        type:    String,
        enum:    ['Germany', 'Spain', 'USA', 'UK', 'Belgium', 'Brazil', 'Canada'],
        unique:  true,
    },
});


const Country = mongoose.model('Country', countrySchema);

module.exports = Country;