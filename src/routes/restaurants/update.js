const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Restaurant = require('../../models/Restaurant/restaurantModel');
const City = require("../../models/Countries and cities/cityModel");

router.patch('/city/:cityID/restaurant/:restaurantID/update', ensureAuth('restaurant_organization'), async (req, res) => {
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validCity = await City.findById(req.params.cityID);
        if(!validCity) return res.status(403).send('City not exists');

        const validRestaurant = await Restaurant.findById(req.params.restaurantID);
        if(!validRestaurant) return res.status(403).send('Restaurant not found.');

        const manager = await Restaurant.findOne({managerID: req.user.id});
        if(!manager) return res.status(400).send('You don\'t have access.');

        

        const restaurant_JOI = await validateRestaurant(req.body);

        const restaurant = {
            ...validRestaurant.toObject(),
            ...restaurant_JOI
        };

        if(restaurant.restaurantName !== validRestaurant.restaurantName 
            || restaurant.restaurantEmail !== validRestaurant.restaurantEmail
            || restaurant.description !== validRestaurant.description
            || restaurant.phone !== validRestaurant.phone
            || restaurant.website !== validRestaurant.website
            || restaurant.openingHours !== validRestaurant.openingHours
        ){
            const newRestaurantInformation = await Restaurant.findByIdAndUpdate(req.params.restaurantID, restaurant);
            await newRestaurantInformation.save();
    
            return res.status(200).json({ message: "Restaurant updated successfully.", restaurant: restaurant_JOI });

        }else{
            return res.status(200).send('Nothing have changed.')
        };

    }catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
});


// Note: when updating something; don't add required() method, you code where gonna BOM!!
async function validateRestaurant(restaurant){
    const openingHoursSchema = Joi.object({
        open: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/), // 24-hour format HH:mm
        close: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),// 24-hour format HH:mm
    });
    const schema = Joi.object({
        restaurantName: Joi.string().min(3),
        restaurantEmail: Joi.string().email(),
        phone: Joi.string().min(11).max(11),
        description: Joi.string(),
        openingHours: Joi.object({
            monday: openingHoursSchema,
            tuesday: openingHoursSchema,
            wednesday: openingHoursSchema,
            thursday: openingHoursSchema,
            friday: openingHoursSchema,
            saturday: openingHoursSchema,
            sunday: openingHoursSchema
        }).required(),
        website: Joi.string().uri(),
    });

    try {
        return await schema.validateAsync(restaurant);
    } catch (err) {
        throw err;
    }
}
module.exports = router;
