const express = require('express');
const Joi = require('joi');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')
const User = require('../../models/userModel')
router.put('/update', ensureAuth(), async(req, res) => {
        try{
            const findUser = await User.findById(req.user.id);
            if(!findUser){
                return res.status(400).send('User not found.')
            }
            const user = await validationUser(req.body);
            if(user.name !== findUser.name || user.email !== findUser.email || user.bio !== findUser.bio){
                const updateUser = await User.findByIdAndUpdate(req.user.id, user, { new: true })
                if(!updateUser){
                    return res.status(400).send('Faild to update user.')
                }    
                return res.status(200).send('Updating successfully.')
                }else{
                    return res.status(400).send('Nothing have changed.')
                }
            }catch(err){
                res.send(err.message);
                console.log(err.message);
            }
});



async function validationUser(user) {
    const schema = Joi.object({
        name : Joi.string().min(1),
        email : Joi.string().email().min(3),
        bio : Joi.string().min(1)
    });
        try{
            return await schema.validateAsync(user);
        }catch(err){
            throw err;
        }
};

module.exports = router;