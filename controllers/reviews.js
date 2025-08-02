const Review = require("../models/review");
const Listing = require("../models/listing");



module.exports.addReview=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const { rating, comment } = req.body.review;
    const newReview = new Review({
        rating,
        comment,
        author: req.user._id // store user id
    });
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review added");
    req.flash("revSuccess", "New review added successfully!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deletReview=async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("revDelete", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
}