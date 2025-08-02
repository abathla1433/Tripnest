if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session= require("express-session");

const MongoStore=require("connect-mongo");


const flash= require("connect-flash");
const multer=require("multer");

const passport=require("passport");
const LocalStrategy= require("passport-local");
const User=require("./models/user.js");


const wrapAsync=require("./utils/wrapAsync.js");

const ExpressError=require("./utils/ExpressError.js");



const {listingSchema}=require("./schema.js");

const listingRouter =require("./routes/listing.js"); //route for listings
const reviewRouter =require("./routes/review.js"); //route for reviews
const userRouter =require("./routes/user.js"); //route for user 




const { v4: uuid } = require('uuid');

const Listing = require("./models/listing");
const Review = require("./models/review");



const dbUrl=process.env.ATLASDB_URL;
console.log(dbUrl);

async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then((res) => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log("connection failed");
    });

const port = 3000;


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
    
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);

})

sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge : 7 *24 *60 * 60 * 1000,
        httpOnly: true
    }
}



app.use(session(sessionOptions));
app.use(flash());

//always use passport after session beacause it needs session to work
//authentication middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
//serializeUser is used to store user information in the session

passport.deserializeUser(User.deserializeUser());
//deserializeUser is used to retrieve user information from the session


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.revSuccessMsg = req.flash("revSuccess");
    res.locals.revDeleteMsg =req.flash("revDelete");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});

// app.get("/demoUser", async(req,res)=>{
//     let fakeUser1=new User({
//         email:"stud1@gmail.com",
//         username: "stud1"
//     });

//     await User.register(fakeUser1,"hello123");
// })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));

app.engine('ejs', ejsMate);




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// app.all("*", (req, res, next) => {
//   // Set a flash message
//   req.flash("error", "Page Not Found");
//   // Pass to the error handler using a custom error object (here ExpressError is a custom error class)
//   next(new ExpressError("Page Not Found", 4-04));
// });


//cookie parser middleware
app.use(cookieParser("secretkey"));

app.use((err, req, res, next) => {
    let {statusCode=500,message}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{err});
});

app.get("/", (req, res) => {
  res.send("It works");
  console.log(req.cookies);

});


app.get("/map",(req,res)=>{
    res.render("listings/map.ejs");
})

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello",{signed:true});
//     res.cookie("hello","Radhe Radhe",{signed:true});

//     res.send("Cookies are set");
// });




app.get("/getsignedcookies", (req, res) => {
    res.cookie("greet", "hello", { signed: true });
    res.send("done");
});

app.get("/verify",(req,res)=>{
    console.log(req.cookies);
    res.send(req.signedCookies);
})

