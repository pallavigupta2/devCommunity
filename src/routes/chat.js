const express = require("express");
const { userAuth } = require("../middlewares/auth");
const chatModal = require("../modals/chat");
const connectionRequestModal = require("../modals/connectionRequest");
const chatRouter = express.Router();
chatRouter.get("/chat/:targetId", userAuth, async (req, res) => {
  try {
    const userId = req.userData._id;
    const { targetId } = req.params;
    // check if userid and targetid are friends
        const isFriend = await connectionRequestModal.findOne({
        $or: [
          { fromUserId:userId, toUserId:targetId,status:"accepted" },
          { fromUserId: targetId, toUserId: userId ,status:"accepted"},
        ],
      });
      if(isFriend){
        let chat = await chatModal
      .findOne({
        participants: { $all: [userId, targetId] },
      })
      .populate({ path: "messages.senderId", select: "firstName lastName" });
    if (!chat) {
      chat = new chatModal({
        participants: [userId, targetId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
      }
    
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});
module.exports = chatRouter;
