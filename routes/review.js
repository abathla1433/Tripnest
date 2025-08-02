const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ FIXED
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIN,isReviewAuthor} = require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

// Add a review
router.post("/",isLoggedIN, wrapAsync(reviewController.addReview));

// Delete a review
router.delete("/:reviewId",
    isReviewAuthor,
    isLoggedIN, wrapAsync(reviewController.deletReview));


    
module.exports = router;
