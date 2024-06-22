const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const cashSchema = mongoose.Schema({
    _id:{
        type:          String,
        default:       uuidv4,
    },
    
    userID:{
        type:          String,
        ref:           'User',
    },

    currentBalance:{
        type:          Number,
        default:       0,
    },
});

const Cash = mongoose.model('Cash', cashSchema);

module.exports = Cash;