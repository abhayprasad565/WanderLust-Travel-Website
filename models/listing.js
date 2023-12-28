const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;
// listing schema
const listingSchema = new mongoose.Schema({
    title: {            // name of the listing
        type: String,
        required: true,
    },
    description: {      // description of the listing
        type: String,
        required: true,
    },
    image: {            // image of th listing set default image when no image is provided
        type: String,
        default: 'https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
        set: function (v) {
            // If v is an empty string, set it to the default URL
            return v === '' ? 'https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80' : v;
        }
    },
    price: {           // price
        type: Number,
        required: true,
    },
    location: {        // address of the listing
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ]
});
// mongoose middileware to delete data when this q is called
listingSchema.post("findOneAndDelete", async (listing) => {
    // delete all reviews in the listing.reviews array
    if (listing) await review.deleteMany({ reviews: { $in: listing.reviews } })
})
// listing model obj 
const Listing = new mongoose.model("Listing", listingSchema);

module.exports = Listing;