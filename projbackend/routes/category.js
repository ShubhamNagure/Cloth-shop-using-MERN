//imported router on top of express var
const express = require("express");
const router = express.Router();

//imported middleware/controller from category,auth,user
const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory}= require("../controllers/category");
const {isSignedIn, isAuthenticated, isAdmin}= require("../controllers/auth");
const {getUserById}= require("../controllers/user");

//imported controller used here to get param
router.param("userId" , getUserById)
router.param("categoryId" , getCategoryById)

//actual router begins here
//create route
router.post("/category/create/:userId", isSignedIn,isAuthenticated, isAdmin, createCategory);
//read route
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//delete
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated, isAdmin, removeCategory);

//this is generic--need to export router
module.exports = router;