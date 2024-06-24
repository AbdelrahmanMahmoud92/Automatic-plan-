const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const User = require('../../models/Auth/userModel');
const Restaurant = require('../../models/Restaurant/restaurantModel');
const City = require("../../models/Countries and cities/cityModel");

router.get('/city/:cityID/', ensureAuth('guest'), async(req, res) =>{
        const guestAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validCity = await City.findById(req.params.cityID);
        if(!validCity) return res.status(403).send('City not exists');

        const resturantsInCity = await Restaurant.find({cityID: validCity});
        if(!resturantsInCity) return res.status(200).send(`No restaurants in ${validCity.cityName}`)
        return res.status(200).json({Resturants: resturantsInCity});
});

module.exports = router;