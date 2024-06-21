const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const User = require('../../models/Auth/userModel');
const Hotel = require('../../models/Hotel management/hotelModel');
const City = require("../../models/Countries and cities/cityModel");


router.delete('/city/:cityID/hotel/:hotelID/delete', ensureAuth('hotel_organization'), async (req, res) => {
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validCity = await City.findById(req.params.cityID);
        if(!validCity) return res.status(403).send('City not exists');

        const validHotel = await Hotel.findById(req.params.hotelID);
        if(!validHotel) return res.status(403).send('Hotel not found.');

        const manager = await Hotel.findOne({managerID: req.user.id});
        if(!manager) return res.status(400).send('You don\'t have access.');
        await Hotel.findOneAndDelete({_id: validHotel.id});
        return res.status(200).send(`${validHotel.hotelName} deleted successfully.`);

    }catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    };
});

module.exports = router;