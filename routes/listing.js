const express = require("express");
const router = express.Router();
const Listing = require("../models/listing"); // Listing model for database interaction
const wrapAsync = require("../utils/collectAsync"); // Utility for error handling
const passport = require("passport");

// Middleware
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** 
 * INDEX Route
 * Fetch and display all listings
 */
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

/** 
 * NEW Route
 * Render form for creating a new listing
 */
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

/** 
 * CREATE Route
 * Add a new listing to the database
 */
router.post("/", wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

/** 
 * SHOW Route
 * Display details of a specific listing
 */
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

/** 
 * EDIT Route
 * Render edit form for a specific listing
 */
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

/** 
 * UPDATE Route
 * Update details of a specific listing
 */
router.put("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
}));

/** 
 * DELETE Route
 * Remove a listing from the database
 */
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}));

/** 
 * BOOK NOW Route
 * Display booking form for a specific listing
 */
router.get("/:id/book", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/book.ejs", { listing });
}));

/** 
 * BOOKING CONFIRMATION Route
 * Handle booking logic
 */
router.post("/book/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    req.flash("success", `You have successfully booked ${listing.title}`);
    res.redirect("/listings");
}));

module.exports = router;
