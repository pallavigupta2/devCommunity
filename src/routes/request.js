const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sentconnectionrequest", userAuth, (req, res) => {
  try {
    const userData = req.userData;
    res.send(userData.firstName + " sent you connection request.");
  } catch (err) {
    res.status(400).send("something went wrong!!!!!");
  }
});

module.exports = requestRouter;
