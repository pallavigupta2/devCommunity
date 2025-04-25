const express = require("express");
const app = express();
app.use("/user",(req,res,next)=>{
    console.log("checking user authentication")
    const token = "xyz"
    const isUserAuth = token === "xyz"
    if(!isUserAuth){
        res.status(301).send("UNAUTHORIZED USER")
    }else{
        next()
    }
})
app.get("/user",(req,res)=>{
    console.log("1st route handler")
    res.send({firstName:"prachi..", lastName:"Gupta"})
    
})

app.delete("/user",(req,res)=>{
    console.log("deleting user...")
    res.send("user deleted,.,")
    
})

app.listen(7777,()=>{
    console.log("server is running!");
})