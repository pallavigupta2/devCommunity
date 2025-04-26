const express = require("express");
const app = express();
const connectDB = require("./config/database");
const userModal = require("./modals/user");

app.use(express.json());

// Signup API
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

//GET API -  To get single user
app.get("/user", async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const userDetail = await userModal.findOne({ emailId: emailId });
    if (!userDetail) {
      res.send("USER NOT FIND");
    } else {
      res.send(userDetail);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

// GET FEED API - to fetch all user data

app.get("/feed",async (req,res)=>{
    try{
        const usersData = await userModal.find({})
    if(usersData.length === 0){
        res.send("No users found")
    }else{
        res.send(usersData)
    }
    }catch (err) {
        res.status(400).send("Something went wrong!!");
      }
    
})

// DELETE API

app.delete("/user",async(req,res)=>{
    try{
        const userId = req.body.userId
        const user = await userModal.findByIdAndDelete(userId)
        res.send("user deleted!!")
    }catch (err) {
        res.status(400).send("Something went wrong!!");
      }
})

// UPDATE API

app.patch("/user",async(req,res)=>{
    const userId=req.body.userId
    const userEmail = req.body.emailId
    const userData = req.body
    try{
        //const updatedData = await userModal.findByIdAndUpdate(userId,userData)
        const updatedData = await userModal.findOneAndUpdate({emailId:userEmail},userData)
        res.send("data updated sucessfully")
    }catch (err) {
        res.status(400).send("Something went wrong!!");
      }
})

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
