const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

module.exports.isLoggedIN=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","You must be Logged in!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("error","You are not the owner of listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curUser._id)){
        req.flash("error","You are not the author of review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}