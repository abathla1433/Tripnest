const mongoose = require('mongoose');
//listing-->places
const Review = require("./review");

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: {
            filename: String,
            url: {
                type: String,
                // default: "https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg",
                // set: (v) => v === "" ? "https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg" : v
            }
        },
        // default: {
        //     filename: "",
        //     url: "https://thumbs.dreamstime.com/b/idyllic-summer-landscape-clear-mountain-lake-alps-45054687.jpg"
        // }
    }
    ,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});


listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        //delete all reviews associated with the listing
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing = mongoose.model('Listin', listingSchema);
module.exports = Listing;
