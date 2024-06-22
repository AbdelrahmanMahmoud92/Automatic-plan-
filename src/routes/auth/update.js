const express = require('express');
const Joi = require('joi');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')
const User = require('../../models/Auth/userModel')

router.put('/update', ensureAuth(['admin', 'guest', 'restaurant_organization', 'fligth_Company', 'hotel_organization']), async (req, res) => {
    try {
        const findUser = await User.findById(req.user.id);
        const validRole = req.validRole();
        const updatedFields = await validationUser(req.body);

        // Create/copy the fields in body to a new object. 
        const user = {
            ...findUser.toObject(),
            ...updatedFields
        };

        console.log('findUser:', findUser);
        console.log('Updated user data:', user);

        if(user.name !== findUser.name || user.email !== findUser.email || user.role !== findUser.role) {
            await User.findByIdAndUpdate(req.user.id, user);
            return res.status(200).send('Updating successfully.');
        } else {
            return res.status(400).send('Nothing has changed.');
        }
    } catch (err) {
        res.status(500).send(err.message); // Ensure to send a proper error status code
        console.log(err.message);
    }
});




async function validationUser(user) {
    const schema = Joi.object({
        name : Joi.string().min(1),
        email : Joi.string().email().min(3),
        role: Joi.string().valid('organization', 'user')
    });
        try{
            return await schema.validateAsync(user);
        }catch(err){
            throw err;
        }
};

module.exports = router;