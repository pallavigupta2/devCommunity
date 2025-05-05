const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userModal = require("./modals/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use(express.json()); // Middleware that will parse request data.
app.use(cookieParser()); // Middleware that will pasrse cookie data and we are able to see that data

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter)
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
