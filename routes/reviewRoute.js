const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// validate review schema
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    } else next();
}

// reviews  
// create review route
router.post("/:id", validateReview, wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    console.log(id);
    await newReview.save();
    await listing.save();
    let redirect_id = `/listings/${id}`;
    res.redirect(redirect_id);
}));
// delete review route
router.delete("/:id/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    // delet review from listing schema
    // pull deletes all events with matching conditon
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    // delete review from review schema
    let review = await Review.findByIdAndDelete(reviewId);
    // console.log(review);
    // console.log(Listing.findById(id));
    res.redirect(`/listings/${id}`);
}))

module.exports = router;