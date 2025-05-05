const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequestModal = require("../modals/connectionRequest");
const userModal = require("../modals/user");

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
      const isToUserIdPresent = await userModal.findById(toUserId);
      if (!isToUserIdPresent) {
        return res.status(400).json({ message: "User does not exist" });
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
        message: `${status} your request.`,
        data,
      });
    } catch (err) {
      res.status(400).send("something went wrong!!!!!" + err.message);
    }
  }
);

// Api for accepting or rejecting connection request

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // get loggedin user details
      const loggedInUser = req.userData;
      const { status, requestId } = req.params;
      // validate allowed status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status!" });
      }
      // is loggedIn user == toUserId
      // if status is intersted then only user will be able to accept or reject
      const connectRequest = await connectionRequestModal.findOne({
        _id: requestId,
        status: "intrested",
        toUserId: loggedInUser._id,
      });
      if (!connectRequest) {
        return res.status(400).json({ message: "Request not found." });
      }
      connectRequest.status = status;
      const data = await connectRequest.save();
      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("Somethinh went wrong : " + err.message);
    }
  }
);

module.exports = requestRouter;
