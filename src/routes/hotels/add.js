const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Hotel = require('../../models/Hotel management/hotelModel');
const City = require("../../models/Countries and cities/cityModel");

router.post('/:cityID/create', ensureAuth('hotel_organization'), async (req, res) => {
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validCity = await City.findById(req.params.cityID);
        if(!validCity){
            return res.status(403).send('City not exists');
        };

        const hotel_JOI = await validateHotel(req.body);

        const newHotel = new Hotel({
            managerName: organizationAccount.name,
            managerID: organizationAccount.id,
            hotelName: hotel_JOI.hotelName,
            hotelEmail: hotel_JOI.hotelEmail,
            description: hotel_JOI.description,
            phone: hotel_JOI.phone,
            website: hotel_JOI.website,
            restaurantHours: hotel_JOI.restaurantHours,
            cityName: validCity.cityName,
            cityID: validCity.id,   
        });
        await newHotel.save();

        return res.status(200).json({ message: "Hotel created successfully.", hotel: newHotel });
    }catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
});

async function validateHotel(hotel) {
    const restaurantHoursSchema = Joi.object({
        open: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // 24-hour format HH:mm
        close: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // 24-hour format HH:mm
        rangeSalary: Joi.string().min(2).max(10).required(),
    });
    const schema = Joi.object({
        hotelName: Joi.string().min(3).required(),
        hotelEmail: Joi.string().email().required(),
        description: Joi.string().required(),
        phone: Joi.string().min(11).max(15).required(),
        website: Joi.string().uri().required(),
        restaurantHours: Joi.object({
            breakfast: restaurantHoursSchema,
            lunch: restaurantHoursSchema,
            dinner: restaurantHoursSchema,
        }).required(),
    });

    try {
        return await schema.validateAsync(hotel);
    } catch (err) {
        throw err;
    }
}

module.exports = router;
