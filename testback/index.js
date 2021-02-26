const express = require("express")
const app = express();

const port = 3000;

app.get("/", (req,res) =>{
    return res.send("Home page");
});

app.get("/login", (req,res) =>{
    return res.send("Login route");
});

app.get("/signup", (req,res) =>{
    return res.send("Sign up");
});

app.listen(port, () => {
    console.log("server is UP and running...");
});