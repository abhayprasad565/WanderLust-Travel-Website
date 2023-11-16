// require 
const express = require("express");
const app = express();
const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js")
const mongoose = require("mongoose");
const MONGOURL = `mongodb://127.0.0.1:27017/wanderlust`;
const ejsMate = require("ejs-mate");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


main()
    .then(() => console.log("connected to db wanderlust"))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGOURL);
}
// validate listing schema
const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    } else next();
}
// validate review schema
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    } else next();
}
// home route to show all hotels
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
})
// new listings route
app.get("/listings/new", (req, res) => {
    //console.log("new listing")
    res.render("listings/new.ejs");
})
// edit listing  route
app.get("/listings/edit/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));
// create listing route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {

    let data = new Listing(req.body.listing);
    await data.save();
    res.redirect("/listings");
}));
// update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let data = req.body.listing;

    let { id } = req.params;
    let obj = await Listing.findByIdAndUpdate(id, { ...data });
    res.redirect(`/listings/${id}`);
}));
// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findByIdAndDelete(id);
    console.log(data);
    res.redirect("/listings");
}));
// reviews  
// create review route
app.post("/listings/review/:id", validateReview, wrapAsync(async (req, res) => {
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



// 404 error res
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

// error handling middieware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("app is listening on port 8080");
})