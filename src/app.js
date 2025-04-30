const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userModal = require("./modals/user");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json()); // Middleware that will parse request data.
app.use(cookieParser()); // Middleware that will pasrse cookie data and we are able to see that data

app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// UPDATE API

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;
  try {
    const ALLOWED_UPDATEDFEILDS = [
      "password",
      "gender",
      "aboutUs",
      "photoUrl",
      "skills",
    ];
    const allowedFeilds = Object.keys(userData).every((feild) =>
      ALLOWED_UPDATEDFEILDS.includes(feild)
    );
    if (!allowedFeilds) {
      throw new Error("You cannot updated these data");
    }
    if (userData.skills.length > 10) {
      throw new Error("You should not allowed to enter more than 10 skills!");
    }
    const updatedData = await userModal.findByIdAndUpdate(userId, userData, {
      runValidators: true,
    });
    //const updatedData = await userModal.findOneAndUpdate({emailId:userEmail},userData)
    res.send("data updated sucessfully");
  } catch (err) {
    res.status(400).send("Something went wrong!!" + err.message);
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
