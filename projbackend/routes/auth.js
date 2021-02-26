//imported router on top of express var
var express = require('express');
var router = express.Router();

//imported middleware/controller from auth & 
const {signout,signin,signup, isSignedIn} =require("../controllers/auth");
//'express-validator' is used for prevalidating like below example, ex1,ex2
const { body, validationResult } = require('express-validator');

//ex1: [body("a").isLength({min:3}).withMessage("b"),]
router.post("/signup",[
    body("name").isLength({min:3}).withMessage("Name should contain atleast 3 characters !"),
    body("email").isEmail().withMessage("Please enter valid Email address"),
    body("password").isLength({min:3}).withMessage("Password is too short! atleast 3 charachter needed "),
], signup);

//ex2: [body("a").isLength({min:3}).withMessage("b"),]
router.post("/signin",[
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({min:1}).withMessage("Password is Required"),
], signin);


router.get("/signout", signout);

//this is generic--need to export router
module.exports= router;