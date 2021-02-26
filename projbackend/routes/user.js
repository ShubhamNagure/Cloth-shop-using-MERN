//imported router on top of express var
const express = require("express");
const router = express.Router();

const {getUserById, getUser, updateUser,userPurchaseList} =require("../controllers/user");
const { isSignedIn, isAuthenticated,isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId" , isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId",isSignedIn, isAuthenticated ,updateUser);
router.get("/orders/user/:userId",isSignedIn, isAuthenticated ,userPurchaseList);

//this is generic--need to export router
module.exports = router;