const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Hotel = require('../../models/Hotel management/hotelModel');
const City = require("../../models/Countries and cities/cityModel");

router.patch('/city/:cityID/hotel/:hotelID/update', ensureAuth('hotel_organization'), async (req, res) => {
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validCity = await City.findById(req.params.cityID);
        if(!validCity) return res.status(403).send('City not exists');

        const validHotel = await Hotel.findById(req.params.hotelID);
        if(!validHotel) return res.status(403).send('Hotel not found.');

        const manager = await Hotel.findOne({managerID: req.user.id});
        if(!manager) return res.status(400).send('You don\'t have access.');

        

        const hotel_JOI = await validateHotel(req.body);

        const hotel = {
            ...validHotel.toObject(),
            ...hotel_JOI
        };

        if(hotel.hotelName !== validHotel.hotelName 
            || hotel.hotelEmail !== validHotel.hotelEmail
            || hotel.description !== validHotel.description
            || hotel.phone !== validHotel.phone
            || hotel.website !== validHotel.website
            || hotel.restaurantHours !== validHotel.restaurantHours
            || hotel.checkInTime !== validHotel.checkInTime
            || hotel.checkOutTime !== validHotel.checkOutTime
            || hotel.frontDeskHours !== validHotel.frontDeskHours
            || hotel.cafeHours !== validHotel.cafeHours
        ){
            const newHotelInformation = await Hotel.findByIdAndUpdate(req.params.hotelID, hotel);
            await newHotelInformation.save();
    
            return res.status(200).json({ message: "Hotel updated successfully.", hotel: hotel_JOI });

        }else{
            return res.status(200).send('Nothing have changed.')
        };

    }catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
});


// Note: when updating something; don't add required() method, you code where gonna BOM!!
async function validateHotel(hotel) {

    const frontDeskHours = Joi.object({
        open: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        close: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
    });
    // const cafeHours = Joi.object({
        // });
    const restaurantHoursSchema = Joi.object({
        open: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/), // 24-hour format HH:mm
        close: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/), // 24-hour format HH:mm
        rangeSalary: Joi.string().min(2).max(10),
    });
    const schema = Joi.object({
        hotelName: Joi.string().min(3),
        hotelEmail: Joi.string().email(),
        description: Joi.string().required(),
        phone: Joi.string().min(11).max(15),
        website: Joi.string().uri(),
        restaurantHours: Joi.object({
            breakfast: restaurantHoursSchema,
            lunch: restaurantHoursSchema,
            dinner: restaurantHoursSchema,
        }),
        checkInTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        checkOutTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        frontDeskHours: Joi.object({
            open: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
            close: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        }),
        cafeHours: Joi.object({
            open: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
            close: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        }),
    });

    try {
        return await schema.validateAsync(hotel);
    } catch (err) {
        throw err;
    }
}

module.exports = router;


