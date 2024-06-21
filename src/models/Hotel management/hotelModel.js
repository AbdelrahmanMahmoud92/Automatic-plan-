const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const hotelSchema = new mongoose.Schema({
    _id: {
        type:     String,
        default:  uuidv4,
    },

    managerID: {
        type:     String,
        ref:      'User',
    },

    managerName: {
        type:     String,
        ref:      'User'
    },

    hotelName:    String,

    description:  String, 
    
    phone :       Number,

    website:      String,

    hotelEmail: {
        type:     String, 
        unique:   true,
    },

    checkInTime: { 
        type:     String,
        default:  '15:00' 
    },

    checkOutTime: { 
        type:     String, 
        default:  '11:00' 
    },

    frontDeskHours: {
        open: {
            type: String,
            default: '00:00' },
        close: { 
            type: String, 
            default: '24:00' 
        }
    },
    
    restaurantHours: {
        breakfast: { 
            open:  String, 
            close: String,
            rangeSalary: Number,
        },
        lunch: { 
            open:  String, 
            close: String,
            rangeSalary: Number,
        },
        dinner: { 
            open:  String, 
            close: String,
            rangeSalary: Number,
        }
    },
    
    cafeHours: {
        open: {
            type: String,
            default: '00:00' },
        close: { 
            type: String, 
            default: '24:00' 
        }
    },

    cityName:{
        type:    String,
        ref:     'City',
    },

    cityID:{
        type:    String,
        ref:     'City',
    }
}, {timestamps: true});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;