const express = require("express");
const app=express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.get("/getcookies", (req, res) =>{
    res.send("sent you some cookies");
})

app.get("/", (req, res)=>{
    res.send("hii I am root");
})


