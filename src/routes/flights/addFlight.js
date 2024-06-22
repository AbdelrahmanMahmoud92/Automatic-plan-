const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const moment = require('moment')
const User = require('../../models/Auth/userModel');
const Plane = require('../../models/Flights/planeModel');
const Flight = require('../../models/Flights/flightModel');
const Company = require('../../models/Flights/companyModel');
const City = require('../../models/Countries and cities/cityModel');


router.post('/:companyID/:planeID/add', ensureAuth('fligth_Company'), async(req,res)=>{
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const flight_JOI = await validateFlight(req.body);
        const plane = await Plane.findById(req.params.planeID);
        if(!plane) return res.status(403).send('No plane with given ID');
        if(plane.isAvailable !== true) return res.status(400).send('This plane is on the move')
        
            
        const validCompany = await Company.findById(req.params.companyID)
        if(!validCompany) return res.status(403).send('No company with this ID.');

        const cityFrom = await City.findOne({ cityName: flight_JOI.cityFrom });
        const cityTo = await City.findOne({ cityName: flight_JOI.cityTo });
        if(!cityFrom || !cityTo) {
            return res.status(403).send('Invalid city');
        }

        const newFlight = new Flight({
            cityFrom: flight_JOI.cityFrom,
            cityTo: flight_JOI.cityTo,
            departureTime: flight_JOI.departureTime,
            arrivalTime: flight_JOI.arrivalTime,
            companyName: validCompany.companyName,
            companyID: validCompany._id,
            planeID: plane._id
        });
        

        await newFlight.save();
        plane.isAvailable = false;
        plane.save();
        return res.status(200).json({Message: "Flight added successfully in website.", Flight_Information: newFlight});

    }catch(err){
        console.log(err);
        return res.send(err);
    };
});



async function validateFlight(flight) {
    const formattedFlight = {
        ...flight,
        departureTime: moment(flight.departureTime, 'D/M/YYYY HH:mm').toISOString(),
        arrivalTime: moment(flight.arrivalTime, 'D/M/YYYY HH:mm').toISOString()
    };
    const schema = Joi.object({
        cityFrom: Joi.string().required(),
        cityTo: Joi.string().required(),
        departureTime: Joi.date().required(),
        arrivalTime: Joi.date().greater(Joi.ref('departureTime')).required(),
        // planeID: Joi.d
    });

    try {
        return await schema.validateAsync(flight);
    } catch (err) {
        throw err;
    }
}
  module.exports = router;