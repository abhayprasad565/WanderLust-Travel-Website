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
// middilewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
main()
    .then(() => console.log("connected to db wanderlust"))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGOURL);
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


// listing backend route
app.use("/listings", listingRoute)
// listing review route
app.use("/listings/review", reviewRoute);


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