
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require('../../models/Auth/userModel')
dotenv.config();

router.post("/login", async (req, res) => {
  try {
    const requestUser = req.body;
    const user = await User.findOne({
      name : requestUser.name,
      email: requestUser.email,
      role: requestUser.role
    });

    if (!user) {
      return res.status(400).send("invalid Credentials");
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).send("invalid Credentials");
    }
    const jwtUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(jwtUser, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });



    return res.status(200).json({
      token,
    });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});


module.exports = router;