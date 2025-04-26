const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userModal = require("./modals/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // we are creating an instance of an user modal
  const user = new userModal(req.body);
  try {
    await user.save();
    res.send("DATA SAVED SUCCESUFULLY");
  } catch (err) {
    res.status(400).send("ERROR SAVING USER...");
  }
});

connectDB()
  .then(() => {
    console.error("CONNECTION ESTABLISHED!");
    app.listen(7777, () => {
      console.log("server is running!");
    });
  })
  .catch((err) => {
    console.error("CONNECTION NOT ESTABLISHED!", err);
  });
