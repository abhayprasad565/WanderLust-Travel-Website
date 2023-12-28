const express = require("express");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")

// validate listing schema
const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    } else next();
}




// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}));
// create listing route
router.post("/", validateListing, wrapAsync(async (req, res) => {
    let data = new Listing(req.body.listing);
    await data.save();
    res.redirect("/listings");
}));
// update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let data = req.body.listing;
    let { id } = req.params;
    let obj = await Listing.findByIdAndUpdate(id, { ...data });
    res.redirect(`/listings/${id}`);
}));
// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));




module.exports = router;