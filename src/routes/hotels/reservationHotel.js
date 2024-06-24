const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const Reservation = require('../../models/Flights/reservationModel')
const User = require('../../models/Auth/userModel');
const Hotel = require('../../models/Hotel management/hotelModel');
const Room = require('../../models/Hotel management/roomModel');
const Cash = require('../../models/CashAccount/cashModel');

// Show flights
router.get('/all', ensureAuth(['admin' ,'guest', 'restaurant_organization', 'fligth_Company', 'hotel_organization']),
async(req,res) =>{
    try{
        const user = await User.findById(req.user.id);
        const validRole = req.validRole();
        const hotels = await Hotel.find();
        const hotelIds = hotels.map(hotel => hotel._id);
        console.log("hotels ids: ",hotelIds)
                
        const relatedRooms = await Room.find({ hotelId: { $in: hotelIds } }).select('priceInNight roomLevel');
        const hotelsWithRooms = hotels.map(hotel => {
            return {
                Hotel: hotel,
                Rooms: relatedRooms 
            };
        });
        console.log("hotels: ",hotelsWithRooms)
        
        
        if (!hotelsWithRooms.length > 0) {
            return res.status(200).send('No hotels in this moment.');
        };
        return res.status(200).json({ Hotels: hotelsWithRooms });
    }catch(err){
        console.log(err);
        return res.send(err);
    }
});

router.post('/:hotelID/rooms/:roomID/reservation/', ensureAuth('guest'), async (req, res) => {
    try {
        const guestAccount = await User.findById(req.user.id);
        const validHotel = await Hotel.findById(req.params.hotelID);
        
        if(!validHotel) {
            return res.status(404).send('No hotel with given ID.');
        };
        const relatedRoom = await Room.findById(req.params.roomID);
        if(!relatedRoom) return res.status(401).send('Invalid room.');

        const cashHotelAccount = await Cash.findOne({ userID: validHotel.managerID });
        const cashUserAccount = await Cash.findOne({ userID: guestAccount._id });
        
        if(!cashUserAccount) {
            return res.status(401).send('Must have cash account.');
        };

        const existingReservation = await Reservation.findOne({ userID: guestAccount._id, hotelID: validHotel._id });
        if(existingReservation) {
            return res.status(200).send('You already have a reservation for this hotel.');
        };

        const reservation_JOI = await validateReservation(req.body);

        const allCash = await relatedRoom.priceInNight * reservation_JOI.nights;

        if(cashUserAccount.currentBalance < allCash) return res.status(401).send('You don\'t have enough cash.')


        const newReservation = new Reservation({
            hotelID: validHotel._id,
            hotelName: validHotel.hotelName,
            userID: guestAccount.id,
            userName: guestAccount.name,
        });

        
        cashHotelAccount.currentBalance += relatedRoom.priceInNight * reservation_JOI.nights;
        cashUserAccount.currentBalance -= relatedRoom.priceInNight * reservation_JOI.nights;
        
        await Promise.all([
            newReservation.save(),
            cashHotelAccount.save(),
            cashUserAccount.save(),
        ]);

        return res.status(200).json({
            Message: `Hotel reservation successfully`,
            Reservation: newReservation,
            TransferCash: 'Cash transferred successfully to the hotel.'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});


async function validateReservation(flight) {
    
    const schema = Joi.object({
        nights: Joi.number().min(1).max(100).required(),
    });

    try {
        return await schema.validateAsync(flight);
    } catch (err) {
        throw err;
    }
}
  module.exports = router;