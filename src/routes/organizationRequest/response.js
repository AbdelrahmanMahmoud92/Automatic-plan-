const express = require("express");
const router = express.Router();
const Joi = require('joi')
const ensureAuth = require('../../middlewares/auth');
const User = require('../../models/Auth/userModel');

router.patch('/response/:organizationID', ensureAuth('admin'), async (req, res) => {
    try {
        const adminAccount = await User.findById(req.user.id);
        const validRole = req.validRole();

        const organizationRequest = await User.findOne({_id : req.params.organizationID, status: 'pending'});
        if(!organizationRequest) {
            return res.status(400).send('No pending organization request found for the given ID')
        }else{
            const response = await validationResponse(req.body)
            if(response.status === 'rejected'){
                await User.findOneAndDelete({_id : req.params.organizationID, status: 'pending'});
            }else{
                organizationRequest.status = response.status
                await organizationRequest.save();
                return res.status(200).send(`Organization account request ${response.status}.`);
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});
async function validationResponse(organization) {
    const schema = Joi.object({
      status : Joi.string().valid('accepted', 'rejected').required(),
    });
    try {
      return await schema.validateAsync(organization);
    } catch (err) {
      throw err;
    }
}
module.exports = router