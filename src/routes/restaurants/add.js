const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Hotel = require('../../models/Hotel management/hotelModel');
const City = require("../../models/Countries and cities/cityModel");
const Restaurant = require("../../models/Restaurant/restaurantModel");

router.post('/:cityID/create', ensureAuth('restaurant_organization'), async (req, res) => {
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validCity = await City.findById(req.params.cityID);
        if(!validCity){
            return res.status(403).send('City not exists');
        };

        const restaurant_JOI = await validateRestaurant(req.body);

        const newRestaurant = new Restaurant({
            managerName: organizationAccount.name,
            managerID: organizationAccount.id,
            restaurantName: restaurant_JOI.restaurantName,
            restaurantEmail: restaurant_JOI.restaurantEmail,
            phone: restaurant_JOI.phone,
            website: restaurant_JOI.website,
            openingHours: restaurant_JOI.openingHours,
            description: restaurant_JOI.description,
            cityName: validCity.cityName,
            cityID: validCity.id,
        });
        await newRestaurant.save();

        return res.status(200).json({ message: "Restaurant created successfully.", restaurant: newRestaurant });
    }catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
});

async function validateRestaurant(restaurant){
    const openingHoursSchema = Joi.object({
        open: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // 24-hour format HH:mm
        close: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required() // 24-hour format HH:mm
    });
    const schema = Joi.object({
        restaurantName: Joi.string().min(3).required(),
        restaurantEmail: Joi.string().email().required(),
        phone: Joi.string().min(11).max(11).required(),
        description: Joi.string().required(),
        openingHours: Joi.object({
            monday: openingHoursSchema,
            tuesday: openingHoursSchema,
            wednesday: openingHoursSchema,
            thursday: openingHoursSchema,
            friday: openingHoursSchema,
            saturday: openingHoursSchema,
            sunday: openingHoursSchema
        }).required(),
        website: Joi.string().uri().required(),
    });

    try {
        return await schema.validateAsync(restaurant);
    } catch (err) {
        throw err;
    }
}

module.exports = router;
