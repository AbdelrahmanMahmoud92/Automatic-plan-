const express = require("express");
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Joi = require("joi");
const User = require('../../models/Auth/userModel');
const City = require("../../models//Countries and cities/cityModel");
const Country = require("../../models/Countries and cities/countryModel");

// This is the best practice, add all cities for some country automatic. 
const cityData = {
    Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
    Spain: ["Madrid", "Barcelona", "Valencia"],
    USA: ["New York", "Los Angeles", "Chicago"],
    Brazil: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza"],
    Belgium: ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège"],
    Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"]
};


router.post('/add', ensureAuth('admin'), async (req, res) => {
    try {
        const organizationAccount = await User.findById(req.user.id);
        const validRole = req.validRole();
        const country_JOI = await validateCountry(req.body);

        const newCountry = new Country({
            countryName: country_JOI.countryName,
        });
        await newCountry.save();

        // After adding country, we'll move to add cities.
        const cities = cityData[newCountry.countryName] || [];
        const cityPromises = cities.map(cityName => {
            const newCity = new City({
                cityName: cityName,
                conutryName: newCountry.countryName,
                conutryID: newCountry._id,
            });
            return newCity.save();
        });
        await Promise.all(cityPromises);
        return res.status(200).json({ message: "Country and cities added successfully.", country: newCountry});

    }catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
});

async function validateCountry(organization) {
    const schema = Joi.object({
        countryName: Joi.string()
        .valid('Germany', 'Spain', 'USA', 'UK', 'Belgium', 'Brazil', 'Canada')
        .min(3).required(),
    });

    try {
        return await schema.validateAsync(organization);
    } catch (err) {
        throw err;
    }
}

module.exports = router;
