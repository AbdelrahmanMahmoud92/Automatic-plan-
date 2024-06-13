const express = require('express');
const router = express.Router();
const User = require('../../models/userModel')


router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        if (users.length > 0){
            res.status(200).json({'users' : users});
        }else{
            res.status(400).json({msg : 'There is no users.'})
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


router.get('/:userId', async(req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        if(!user) res.status(400).json({msg : `There is no user with this ID: ${req.params.userId}.`});
        res.status(200).json({'user' : user});
        
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


module.exports = router;