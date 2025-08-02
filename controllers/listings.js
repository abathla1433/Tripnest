const Listing = require("../models/listing.js");

//index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

//new
module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}

//show
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    //    console.log(id);

    let listData = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    })
        .populate("owner");
    if (!listData) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings");
    }
    // console.log(listData);

    res.render("listings/show.ejs", { listData });
}

//create
module.exports.createListing = async (req, res) => {
    let { title, description, price, location, country } = req.body;

    let url = req.file.path;
    let filename = req.file.filename;


    // let imageUrl = req.body.image?.url;
    if (!{ title, description, price, location, country }) {
        throw new ExpressError(400, "badreq");
    }
    let newListing = new Listing({
        title: title,
        description: description,
        image: {
            url: url,
            filename: filename,
        },
        price: price,
        location: location,
        country: country,
        owner: req.user._id
    });
    let data1 = await newListing.save();
    console.log(data1);
    req.flash("success", "New Listing created successfully!");
    res.redirect("/listings")
}

//edit
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listingData = await Listing.findById(id);

    let originalImageUrl=listingData.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs", { listingData, originalImageUrl });
}

//update
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;

        let updated = await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country
        }, { new: true });

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updated.image={url,filename};
        await updated.save();
    }    


    // else{ 
    //     req.flash("error","Please update the image ");
    //     return res.redirect(`/listings/${id}`);
    // }
    // let imageUrl = req.body.image?.url;

    res.redirect(`/listings/${id}`);
}

//delete
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
}