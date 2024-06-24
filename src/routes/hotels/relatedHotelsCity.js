const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const User = require('../../models/Auth/userModel');
const Hotel = require("../../models/Hotel management/hotelModel");

router.get('/city/:cityID/', ensureAuth('guest'), async(req, res) =>{
    const guestAccount = await User.findById(req.user.id);
    const validRole = req.validRole();
    const validCity = await City.findById(req.params.cityID);
    if(!validCity) return res.status(403).send('City not exists');

    const hotelsCity = await Hotel.find({cityID: validCity});
    if(!hotelsCity) return res.status(200).send(`No hotels in ${validCity.cityName}`)
    return res.status(200).json({Hotels: hotelsCity});
});

module.exports = router;