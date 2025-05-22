const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequestModal = require("../modals/connectionRequest");
const userModal = require("../modals/user");

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
        "age",
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
        "age",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "aboutUs",
        "skills",
        "gender",
        "age",
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

// Api for feed(get all users data except user present in connection request table)
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequestData = await connectionRequestModal
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    const hideUserInFeed = new Set();
    connectionRequestData.forEach((request) => {
      hideUserInFeed.add(request.fromUserId.toString());
      hideUserInFeed.add(request.toUserId.toString());
    });
    const feedUsers = await userModal
      .find({
        $and: [
          {
            _id: { $nin: Array.from(hideUserInFeed) },
          },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select("firstName lastName photoUrl aboutUs skills gender age")
      .skip(skip)
      .limit(limit);
    res.send(feedUsers);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
module.exports = userRouter;
