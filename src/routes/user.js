const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequestModal = require("../modals/connectionRequest");

// Api to Get all pending request of logged in user

userRouter.get("/user/received/pendingrequest", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const pendingRequest = await connectionRequestModal
      .find({
        toUserId: loggedInUser._id,
        status: "intrested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "aboutUs",
        "skills",
        "gender",
      ]);
    res.json({ data: pendingRequest });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Api to get all connection request which user accepted
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const connections = await connectionRequestModal
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "aboutUs",
        "skills",
        "gender",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "aboutUs",
        "skills",
        "gender",
      ]);
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = userRouter;
