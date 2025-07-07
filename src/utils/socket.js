const socket = require("socket.io");
const crypto = require("crypto");
const chatModal = require("../modals/chat");
const connectionRequestModal = require("../modals/connectionRequest");
const generateSecreteRoomId = (userId, targetId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetId].sort().join("_"))
    .digest("hex");
};
const initializeSocketConnection = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ targetId, userId, firstName }) => {
      const roomId = generateSecreteRoomId(userId, targetId);

      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetId, text }) => {
        const roomId = generateSecreteRoomId(userId, targetId);

        // Save chat data in the database.
        try {
          // check if userid and targetid are friends
          const isFriend = await connectionRequestModal.findOne({
            $or: [
              { fromUserId: userId, toUserId: targetId, status: "accepted" },
              { fromUserId: targetId, toUserId: userId, status: "accepted" },
            ],
          });
          if (isFriend) {
            let chat = await chatModal.findOne({
              participants: { $all: [userId, targetId] },
            });
            if (!chat) {
              chat = await new chatModal({
                participants: [userId, targetId],
                messages: [],
              });
            }
            chat.messages.push({ senderId: userId, text });
            await chat.save();
            io.to(roomId).emit("messageReceived", {
              firstName,
              lastName,
              text,
            });
          }
        } catch (err) {
          console.log("ERROR: ", err);
        }
      }
    );
    socket.on("disconnectChat", () => {});
  });
};

module.exports = initializeSocketConnection;
