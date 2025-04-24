const express = require("express");
const app = express();

app.get("/user",(req,res)=>{
    res.send({firstName:"prachi..", lastName:"Gupta"})
    
})


app.get("/test",(req,res)=>{
    res.send("testing!");
})

app.get("/hello",(req,res)=>{
    res.send("namaste!");
})
app.use("/",(req,res)=>{
    res.send("hellow!678");
})
app.listen(7777,()=>{
    console.log("server is running!");
})