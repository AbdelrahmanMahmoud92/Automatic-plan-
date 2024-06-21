const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const City = require("../../models/Countries and cities/cityModel");
const Country = require("../../models/Countries and cities/countryModel");


router.delete('/:countryID/delete', ensureAuth('admin'), async(req, res) =>{
    try{
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();

        const country = await Country.findById(req.params.countryID);
        if(!country){
            return res.status(403).send('Country not found.');
        };
        await Country.findByIdAndDelete({_id : country.id});
        await City.deleteMany({conutryName: country.countryName});
        return res.status(200).send(`${country.countryName} deleted successfully.`);
    }catch(err){
        console.log(err);
        return res.send(err);
    }
});

module.exports = router;