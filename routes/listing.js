const express=require("express");
const router=express.Router();
const flash =require("connect-flash");

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { v4: uuid } = require('uuid');
const {isLoggedIN, isOwner}=require("../middleware.js");


const multer=require("multer");

const {storage}=require("../cloudConfig.js");

// const upload= multer({dest:"uploads/"});
const upload=multer({storage});



const listingController=require("../controllers/listings.js");

router.use(flash());

//if the path is same but the method are diffrent,
//we can write in the form of router.route(path).get().post()



router.route("/")
.get(wrapAsync(listingController.index)) //index route
.post(isLoggedIN,
    upload.single('image[url]'),
     wrapAsync(listingController.createListing)); //create route 


// .post(upload.single('image[url]'),(req,res)=>{
//     res.send(req.file);
// });
// router.get("/search", async (req, res) => {
//     const { title } = req.query;

//     if (!title) {
//         return res.redirect("/listings");
//     }

//     const listing = await Listing.findOne({ title: { $regex: title, $options: "i" } });

//     res.render("listings/search", { listing, title });
// });


router.get("/search", async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.redirect("/listings");
    }

    const keywords = title.trim().split(/\s+/); // correct split by spaces

    const listings = await Listing.find({
        $and: keywords.map(word => ({
            title: { $regex: word, $options: "i" }
        }))
    });

    res.render("listings/search", { listings, title });
});




//new route
router.get("/new", isLoggedIN, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))  //show route
.put(isOwner,
    upload.single("image[url]"),
    wrapAsync(listingController.updateListing))//update route
.delete(isOwner, isLoggedIN, wrapAsync(listingController.deleteListing)); //delete route

// edit route
router.get("/:id/edit", isLoggedIN ,wrapAsync(listingController.editListing));




module.exports = router;