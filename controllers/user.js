const User = require("../models/user.js");

module.exports.renderSignupForm= (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.userSignup=async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username,
            email
        });

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to TripNest!");
            res.redirect("/listings");
        });

       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.userLogin=async(req,res)=>{
        req.flash("success","Logged-in Successfully!");
        if(!res.locals.redirectUrl){
            return res.redirect("/listings");
        }
        res.redirect(res.locals.redirectUrl);

}

module.exports.userLogout=(req,res,next) =>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged out!");
        res.redirect("/listings");
    });
}