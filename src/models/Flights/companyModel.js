const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const companySchema = mongoose.Schema({
    _id:{
        type:        String,
        default:     uuidv4,
    },

    managerID:{
        type:        String,
        ref:         'User',
    },

    managerName:{
        type:        String,
        ref:         'User',
    },
    
    companyName:{
        type:        String,
        unique:      true,
    },

    cashAccount: {
        type:    String, 
        ref:     'Cash',    
    }

});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;