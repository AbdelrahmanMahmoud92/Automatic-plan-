const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const User = require('../../models/Auth/userModel');


router.get('/requests', ensureAuth('admin'), async(req,res) => {
    try{
        const adminAccount = await User.findById(req.user.id);
        const validRole = req.validRole();

        const organizationRequests = await User.find({role: {$ne: 'admin', $ne: 'guest'}, status: 'pending'});
        if(!organizationRequests.length > 0) return res.status(200).send('There is no requests.');

        return res.status(200).json({Organization_Requests: organizationRequests});
    }catch(err){
        console.log(err);
        return res.send(err);
    }
})
module.exports = router;