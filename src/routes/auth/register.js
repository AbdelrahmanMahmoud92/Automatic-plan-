const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../../models/Auth/userModel')
const Cash = require('../../models/CashAccount/cashModel')
const City = require('../../models/Countries and cities/cityModel')


router.post("/register", async (req, res) => {
  try {
    const validatedUser = await validationUser(req.body);  
    // const validCountry = await Country.findOne({countryName: validatedUser.country});
    
    // Organization accounts should take admin accepte first.
    if(validatedUser.role !== 'admin' && validatedUser.role !== 'guest'){
      const validAdmin = await User.findOne({role: 'admin'});
      if(!validAdmin){
        return res.status(403).send('This is for developers, can\'t create account if there is no admin account')
      }else{
        const checkRequest = await User.findOne({email: validatedUser.email, role: validatedUser.role});
        if(checkRequest) return res.status(200).send('Request already sent.')
        const saltRounds = 10;
        const myPlaintextPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
        // if(!validCountry) return res.status(403).send('Please write a valid country.')
          
          
          const newUser = new User({
            name: validatedUser.name,
            email: validatedUser.email,
            role: validatedUser.role,
            // cityName: validatedUser.cityName,
            password: hashedPassword,
            status: 'pending'
          });
          if(newUser.role !== 'admin' && newUser.role !== 'guest'){
            const newCash = new Cash({
            userID: newUser._id,
          });
          await newCash.save();
          }
          
          await newUser.save();
          
          return res.status(200).json({ Message: "Request sent to the admin."});
        }
      }
      // If not organization accounts, create it direct.
      const saltRounds = 10;
      const myPlaintextPassword = req.body.password;
      const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
      
      
      // if(!validCountry) return res.status(403).send('Please write a valid country.')
      const newUser = new User({
        name: validatedUser.name,
        email: validatedUser.email,
        role: validatedUser.role,
        cityName: validatedUser.cityName,
        password: hashedPassword,
      });


      const validCity = await City.findOne({cityName: newUser.cityName});
      if(!validCity) return res.status(400).send('Pleae write a valid city');
      if(newUser.role !== 'admin' && newUser.role !== 'guest'){
        const newCash = new Cash({
        userID: newUser._id,
      });
      await newCash.save();
      }
    
      await newUser.save();
    
      return res.status(200).json({ Created: "Registering successfully.", user: newUser });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function validationUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().min(3).required(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid('admin', 'guest', 'restaurant_organization', 'fligth_Company', 'hotel_organization')
    .required(),
    cityName: Joi.string(),
  });

  try {
    return await schema.validateAsync(user);
  } catch (err) {
    throw err;
  }
}

module.exports = router;