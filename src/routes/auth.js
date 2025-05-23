const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const userModal = require("../modals/user");
const { validateSignupData } = require("../utils/validation");
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt password
    const encodedPassword = await bcrypt.hash(password, 10);
    // Creating instance of an user modal
    const userData = new userModal({
      firstName,
      lastName,
      emailId,
      password: encodedPassword,
    });
    const isUserPresent = await userModal.findOne({ emailId });
    if(isUserPresent){
      throw new Error("User Already Exist.");
      
    }
    const savedUser = await userData.save();
    // Create jwt token and wrap it in cookies
    const jwtToken = await savedUser.getJWT();
    res.cookie("token", jwtToken);
    res.json({ data: savedUser });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // Get input from user
    const { emailId, password } = req.body;
    const userData = await userModal.findOne({ emailId });
    // Validate if user exist or not
    if (!userData) {
      throw new Error("User not found");
    }
    // Validate if password matches or not
    const isPasswordValid = await userData.validatePassword(password);
    if (isPasswordValid) {
      // Create jwt token and wrap it in cookies
      const jwtToken = await userData.getJWT();
      res.cookie("token", jwtToken);
      res.send(userData);
    } else {
      throw new Error("Incorrect Credentials...");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  // Clear the cookies.
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out succesfully...");
});

module.exports = authRouter;
