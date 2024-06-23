const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const Reservation = require('../../models/Flights/reservationModel')
const User = require('../../models/Auth/userModel');
const Plane = require('../../models/Flights/planeModel');
const Flight = require('../../models/Flights/flightModel');
const Cash = require('../../models/CashAccount/cashModel');
const Company = require('../../models/Flights/companyModel');

// Show flights
router.get('/all', ensureAuth(['admin' ,'guest', 'restaurant_organization', 'fligth_Company', 'hotel_organization']),
async(req,res) =>{
    try{
        const user = await User.findById(req.user.id);
        const validRole = req.validRole();
        const flights = await Flight.find();
        const planeIds = flights.map(flight => flight.planeID);
        const relatedPlanes = await Plane.find({ _id: { $in: planeIds } }).select('ticketPrice')

        const flightsWithPlanes = flights.map(flight => {
            // Get plane that related with current flight.
            const plane = relatedPlanes.find(plane => plane._id === flight.planeID);
            // Return each flight with related plane.
            return {
                Flight: flight,
                Plane: plane 
            };
        });
        if(!flightsWithPlanes.length > 0) return res.status(200).send('No flights in this moment.');


        const response = {
            Flights: flightsWithPlanes,
        };
        
        return res.status(200).json(response);
    }catch(err){
        console.log(err);
        return res.send(err);
    }
});

router.post('/:flightID/reservation/', ensureAuth('guest'), async (req, res) => {
    try {
        const guestAccount = await User.findById(req.user.id);
        const validFlight = await Flight.findById(req.params.flightID);
        
        if(!validFlight) {
            return res.status(404).send('No flight with given ID.');
        }

        const relatedCompany = await Company.findOne({ _id: validFlight.companyID });
        const cashCompanyAccount = await Cash.findOne({ userID: relatedCompany.managerID });
        const cashUserAccount = await Cash.findOne({ userID: guestAccount._id });

        if(!cashUserAccount) {
            return res.status(401).send('Must have cash account.');
        }

        const existingReservation = await Reservation.findOne({ userID: guestAccount._id, flightID: validFlight._id });
        if(existingReservation) {
            return res.status(200).send('You already have a reservation for this flight.');
        }

        const reservation_JOI = await validateReservation(req.body);

        const relatedPlane = await Plane.findOne({ _id: validFlight.planeID }).select('ticketPrice passengerCapacity');
        if(relatedPlane.passengerCapacity === 0) return res.status(401).send('No tickets available.');
        const ticketPrice = relatedPlane.ticketPrice[reservation_JOI.ticketLevel];

        if (cashUserAccount.currentBalance < ticketPrice) {
            return res.send(`Your balance (${cashUserAccount.currentBalance}) is insufficient for this reservation.`);
        }

        const newReservation = new Reservation({
            flightID: validFlight._id,
            flightNumber: validFlight.flightNumber,
            userID: guestAccount.id,
            userName: guestAccount.name,
        });

        
        cashCompanyAccount.currentBalance += ticketPrice;
        cashUserAccount.currentBalance -= ticketPrice;
        relatedPlane.passengerCapacity -= 1;
        
        await Promise.all([
            newReservation.save(),
            cashCompanyAccount.save(),
            cashUserAccount.save(),
            relatedPlane.save()
        ]);

        return res.status(200).json({
            Message: `Reservation successful for flight to ${validFlight.cityTo}`,
            Reservation: newReservation,
            TransferCash: 'Cash transferred successfully to the company.'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});


async function validateReservation(flight) {
    
    const schema = Joi.object({
        ticketLevel: Joi.string().valid('Economy', 'Business', 'FirstClass').required(),
    });

    try {
        return await schema.validateAsync(flight);
    } catch (err) {
        throw err;
    }
}
  module.exports = router;