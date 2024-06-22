const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Company = require('../../models/Flights/companyModel');


router.post('/add', ensureAuth('fligth_Company'), async(req, res) =>{
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const company_JOI = await validateCompany(req.body);
        const validCompany = await Company.findOne({companyName: company_JOI.companyName});
        if(validCompany) return res.status(401).send('Company already added.')
        const newCompany = new Company({
            managerID:   organizationAccount._id,
            managerName: organizationAccount.name,
            companyName: company_JOI.companyName,
        });
        newCompany.save();
        return res.status(200).json({Message: 'Company added successfully.', Company: newCompany});
    }catch(err){
        console.log(err);
        return res.send(err);
    }
})


async function validateCompany(company) {
    const schema = Joi.object({
        companyName: Joi.string().min(3).required(),
    });

    try {
        return await schema.validateAsync(company);
    } catch (err) {
        throw err;
    }
}
  module.exports = router;