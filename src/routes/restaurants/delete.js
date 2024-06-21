const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const User = require('../../models/Auth/userModel');
const City = require("../../models/Countries and cities/cityModel");
const Restaurant = require("../../models/Restaurant/restaurantModel");


router.delete('/city/:cityID/restaurant/:restaurantID/delete', ensureAuth('restaurant_organization'), async (req, res) => {
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validCity = await City.findById(req.params.cityID);
        if(!validCity) return res.status(403).send('City not exists');

        const validRestaurant = await Restaurant.findById(req.params.restaurantID);
        if(!validRestaurant) return res.status(403).send('Restaurant not found.');

        const manager = await Restaurant.findOne({managerID: req.user.id});
        if(!manager) return res.status(400).send('You don\'t have access.');
        await Restaurant.findOneAndDelete({_id: validRestaurant.id});
        return res.status(200).send(`${validRestaurant.restaurantName} restaurant deleted successfully.`);

    }catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    };
});

module.exports = router;