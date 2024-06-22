const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Cash = require('../../models/CashAccount/cashModel');


router.post('/add', ensureAuth(['admin' ,'guest', 'restaurant_organization', 'fligth_Company', 'hotel_organization']),
async(req,res) =>{
    try {
        const userAccount = await User.findById(req.user.id);
        const validRole = req.validRole();

        const addMoneyCashToAccount_JOI = await validateCashAccount(req.body);
        const validAccount = await Cash.findOne({userID: userAccount._id});
        if(validAccount){
            validAccount.currentBalance += addMoneyCashToAccount_JOI.currentBalance;
            await validAccount.save();
            return res.status(200).json({Message: `${addMoneyCashToAccount_JOI.currentBalance} added successfully to your account`});
            
        }
        const newCash = new Cash({
            userID: userAccount._id, 
            currentBalance: addMoneyCashToAccount_JOI.currentBalance,
        });
        try{
            newCash.save();
            return res.status(200).json({Message: `${addMoneyCashToAccount_JOI.currentBalance} added successfully to your account`});
        }catch (err){
            return res.status(401).send('Falid to add.');
        };
        
    }catch(err){
        console.log(err);
        return res.send(err);
    }
})


async function validateCashAccount(cash) {
    const schema = Joi.object({
        currentBalance: Joi.number().required().min(100),

    });

    try {
        return await schema.validateAsync(cash);
    } catch (err) {
        throw err;
    }
}
  module.exports = router;