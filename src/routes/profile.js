const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const userData = req.userData;
    res.send(userData);
  } catch (err) {
    res.status(400).send("Cannot get profile data : " + err.message);
  }
});

module.exports = profileRouter;
