const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const restaurantSchema = mongoose.Schema({
    _id: {
        type:        String,
        default:     uuidv4
    },

    managerID: {
        type:        String,
        ref:         'User',
    },

    managerName: {
        type:        String,
        ref:         'User'
    },

    restaurantName:  String,

    openingHours: {
        monday:    { open: String, close: String },
        tuesday:   { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday:  { open: String, close: String },
        friday:    { open: String, close: String },
        saturday:  { open: String, close: String },
        sunday:    { open: String, close: String }
    },

    description:     String, 

    phone :          Number,

    website :        String,

    restaurantEmail: {
        type:        String, 
        unique:      true,
    },

    cityName:{
        type:        String,
        ref:         'City',
    },

    cityID:{
        type:        String,
        ref:         'City',
    }
}, {timestamps: true});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;