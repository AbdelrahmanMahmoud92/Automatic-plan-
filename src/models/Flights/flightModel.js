const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const flightSchema = mongoose.Schema({
    _id: {
        type:       String, 
        default:    uuidv4,
    },

    flightNumber: {
        type:       Number,
        // required:   true,
        unique:     true,
    },

    cityFrom: {
        type:       String,
        required:   true
    },
    
    cityTo: {
        type:       String,
        required:   true

    },

    departureTime:  Date,

    arrivalTime:    Date,

    planeID: {
        type:       String,
        ref:        'Plane',
        required:    true,
    },


}, { timestamps: true });

flightSchema.virtual('passengers', { // Parameter to get related objects.
    ref: 'Passenger',
    localField: '_id',
    foreignField: 'flightNumber' // In passenger model.
});

flightSchema.set('toObject', {virtuals: true});
flightSchema.set('toJSON', {virtuals: true});

flightSchema.plugin(AutoIncrement, { inc_field: 'flightNumber', start_seq: 1000 });

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;