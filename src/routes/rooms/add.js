const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Hotel = require('../../models/Hotel management/hotelModel');
const City = require("../../models/Countries and cities/cityModel");
const Room = require("../../models/Hotel management/roomModel");

router.post('/city/:cityID/hotel/:hotelID/add', ensureAuth('hotel_organization'), async(req, res) =>{
    try{
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();

        const validCity = await City.findById(req.params.cityID);
        if(!validCity) return res.status(403).send('City not exists');

        const validHotel = await Hotel.findById(req.params.hotelID);
        if(!validHotel) return res.status(403).send('Hotel not exists.');
        
        const manager = await Hotel.findOne({managerID: req.user.id});
        if(!manager) return res.status(400).send('You don\'t have access.');

        const room_JOI = await validateRoom(req.body);
        console.log("Validated Room Data:", room_JOI); 
        
        const newRoom = new Room({
            hotelId: validHotel.id,
            hotelName: validHotel.hotelName,
            roomLevel: room_JOI.roomLevel,
            priceInNight: room_JOI.priceInNight,
            isAvailable: room_JOI.isAvailable,
        });
        await newRoom.save();

        return res.status(200).json({Message: `${validHotel.hotelName}'s room added successfully`, Room: newRoom})

    }catch(err){
        console.log(err);
        return res.send(err);
    };
});

async function validateRoom(room){
    const schema = Joi.object({
        roomLevel : Joi.string().valid('Standard', 'Superior', 'Deluxe', 'Grand Deluxe', 'Junior Suite', 'Deluxe Suite', 'Presidential Suite')
        .required(),
        priceInNight: Joi.number().required(),
        isAvailable: Joi.boolean().default(true).required(),
    });
    try{
        return await schema.validateAsync(room);
    }catch (err){
        throw err;
    };
};


module.exports = router;

