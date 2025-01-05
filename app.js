// =====================================
// Imports and Initial Setup
// =====================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const wrapAsync = require("./utils/collectAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const Review = require('./models/review');
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const Listing = require("./models/listing.js");


// =====================================
// MongoDB Connection
// =====================================
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB connection error:", err));

// =====================================
// Middleware Configuration
// =====================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', engine);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// =====================================
// Session and Flash Configuration
// =====================================
const sessionOptions = {
  resave: false,
  saveUninitialized: true,
  secret: "mysupersecreat",
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Set up flash message middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// =====================================
// Passport Authentication Configuration
// =====================================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  { usernameField: "email" }, // Use email as username
  user.authenticate()
));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



//======================================
//Login route
//======================================
app.post("/login", passport.authenticate("local", {
    successRedirect: "/listings", // Redirect to /listings on success
    failureRedirect: "/login", // Redirect back to /login on failure
    failureFlash: true, // Optional: Enable flash messages for errors
}));


// =====================================
// Routes
// =====================================

// Root Route
app.get("/", (_req, res) => {
  res.send("Hi, I am root");
});


// Listing and User Routes
app.use("/listings", listingRouter);
app.use("/", userRouter);

// Reviews Routes
app.post("/listings/:id/reviews", async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).send({
      message: "Error saving review",
      error: error.message
    });
  }
});



// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    // Check if the listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    // Check if the review exists
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).send("Review not found");
    }

    // Remove review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review from the Review collection
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
}));

// =====================================
// Error Handling
// =====================================

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("error", { message: err.message, error: err });
});

// =====================================
// Start Server
// =====================================
app.listen(3000, () => {
  console.log("Server is listening on port 8080");
});
