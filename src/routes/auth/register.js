const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../../models/userModel')
const defaultPicture = '/'
router.post("/register", async (req, res) => {
  try {
    const validatedUser = await validationUser(req.body);
    if (validatedUser) {
      const saltRounds = 10;
      const myPlaintextPassword = req.body.password;
      const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
      
      const newUser = new User({
        name: validatedUser.name,
        email: validatedUser.email,
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(200).json({ Created: "Registering successfully.", user: newUser });
    }
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
  });

  try {
    return await schema.validateAsync(user);
  } catch (err) {
    throw err;
  }
}

module.exports = router;