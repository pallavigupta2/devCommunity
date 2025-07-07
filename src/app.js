const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userModal = require("./modals/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")
const chatRouter = require("./routes/chat");
const cors = require("cors")
const http = require("http");

require('dotenv').config()
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json()); // Middleware that will parse request data.
app.use(cookieParser()); // Middleware that will pasrse cookie data and we are able to see that data

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter)
app.use("/",chatRouter)
const initializeSocketConnection = require("./utils/socket");

const server = http.createServer(app)
initializeSocketConnection(server)
connectDB()
  .then(() => {
    console.error("CONNECTION ESTABLISHED!");
    server.listen(process.env.PORT, () => {
      console.log("server is running!");
    });
  })
  .catch((err) => {
    console.error("CONNECTION NOT ESTABLISHED!", err);
  });
