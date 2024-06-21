const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const Plane = require('../../models/Flights/planeModel');


router.post('/add', ensureAuth('admin'), async(req, res) => {
    try{
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();

        const plane_JOI = await validatePlane(req.body);

        const newPlane = new Plane({
            modelName: plane_JOI.modelName,
            planeType: plane_JOI.planeType,
            passengerCapacity: plane_JOI.passengerCapacity,
            ticketPrice: plane_JOI.ticketPrice,
            isAvailable: plane_JOI.isAvailable,
        });

        await newPlane.save();
        return res.status(200).json({Message: "Plane added successfully in website.", Plane: newPlane});

    }catch(err){
        console.log(err);
        return res.send(err);
    }
});


async function validatePlane(plane) {
    const schema = Joi.object({
        modelName: Joi.string().min(3).required(),
        planeType: Joi.string().valid('public', 'private').required(),
        passengerCapacity: Joi.number().min(1).max(600).required(),
        ticketPrice: Joi.object({
            Economy: Joi.number().required(),
            Business: Joi.number().greater(Joi.ref('Economy')).required(),
            FirstClass: Joi.number().greater(Joi.ref('Business')).required()
        }),
        isAvailable: Joi.boolean().default(true).required(),

    });

    try {
        return await schema.validateAsync(plane);
    } catch (err) {
        throw err;
    }
}
  module.exports = router;