const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const Reservation = require('../../models/Flights/reservationModel')
const User = require('../../models/Auth/userModel');
const Plane = require('../../models/Flights/planeModel');
const Flight = require('../../models/Flights/flightModel');
const Cash = require('../../models/CashAccount/cashModel');

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
})
router.post('/:flightID/reservation/', ensureAuth('guest'), async(req, res) =>{
    try {
        const guestAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const validFlight = await Flight.findById(req.params.flightID);
        if(!validFlight) return res.status(404).send('No flight with given ID.')

        const reservation_JOI = await validateReservation(req.body);
        // const cashCompanyAccount = await Cash.findOne({userID: })
        const cashUserAccount = await Cash.findOne({userID: guestAccount._id});

        const relatedPlane = await Plane.findOne({_id: validFlight.planeID}).select('ticketPrice');
        const validReservation = await Reservation.findOne({userID: guestAccount._id});
        if(validateReservation) return res.status(200).send('You are already reservation this flight.')
        if(reservation_JOI.ticketLevel === 'Economy'){
            if(cashUserAccount.currentBalance >= relatedPlane.ticketPrice.Economy){
                const newReservation = new Reservation({
                    flightID: validFlight._id,
                    flightNumber: validFlight.flightNumber,
                    userID: guestAccount.id,
                    userName: guestAccount.name,
                });
                newReservation.save();
                return res.status(200).json({Message: `Reservastion successfully to ${validFlight.cityTo}`,
                Reservation: newReservation
                });
            }else{
                return res.send(`Your money is: ${cashUserAccount.currentBalance}, flight cash is: ${relatedPlane.ticketPrice.Business}`);
            }
            }else if(reservation_JOI.ticketLevel === 'Business'){
            if(cashUserAccount.currentBalance >= relatedPlane.ticketPrice.Business){
                const newReservation = new Reservation({
                    flightID: validFlight._id,
                    flightNumber: validFlight.flightNumber,
                    userID: guestAccount.id,
                    userName: guestAccount.name,
                });
                newReservation.save();
                return res.status(200).json({Message: `Reservastion successfully to ${validFlight.cityTo}`,
                Reservation: newReservation
                });
            }else{
                return res.send(`Your money is: ${cashUserAccount.currentBalance}, flight cash is: ${relatedPlane.ticketPrice.Business}`);
            }
        }else if(reservation_JOI.ticketLevel === 'FirstClass'){
            if(cashUserAccount.currentBalance >= relatedPlane.ticketPrice.FirstClass){
                const newReservation = new Reservation({
                    flightID: validFlight._id,
                    flightNumber: validFlight.flightNumber,
                    userID: guestAccount.id,
                    userName: guestAccount.name,
                });
                newReservation.save();

                return res.status(200).json({Message: `Reservastion successfully to ${validFlight.cityTo}`,
                    Reservation: newReservation
                });
            }else{
                return res.send(`Your money is: ${cashUserAccount.currentBalance}, flight cash is: ${relatedPlane.ticketPrice.Business}`);
            }
        }
        
    }catch(err){
        console.log(err);
        return res.send(err);
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