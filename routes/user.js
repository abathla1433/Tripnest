const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport=require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");


const userController=require("../controllers/user.js");

//signup
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.userSignup));

//login

router.get("/login",userController.renderLoginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate(
        "local",
        {failureRedirect:"/login", failureFlash:true}
    ),
    userController.userLogin);

router.get("/logout",userController.userLogout);


module.exports = router;