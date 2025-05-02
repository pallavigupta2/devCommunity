const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequestModal = require("../modals/connectionRequest");
const userModal = require("../modals/user")

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // Getting logged in user data basically user (fromUserId)
      const userData = req.userData;
      const fromUserId = userData._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .send({ message: "Invalid Status!! : " + status });
      }
      // finding if toUserId is preset in User table or not.
            const isToUserIdPresent = await userModal.findById(toUserId)
            if(!isToUserIdPresent){
              return res.status(400).json({message:"User does not exist"})
            }

      // Finding if their is any existing connection request.
      const existingRequest = await connectionRequestModal.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).send("Request already present!");
      }
      const connectionRequestData = new connectionRequestModal({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequestData.save();

      res.json({
        message:`${status} your request.`,
        data,
      });
    } catch (err) {
      res.status(400).send("something went wrong!!!!!" + err.message);
    }
  }
);

module.exports = requestRouter;
