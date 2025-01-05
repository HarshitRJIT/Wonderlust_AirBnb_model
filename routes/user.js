const express = require("express"); // Importing the express module
const router = express.Router(); // Creating a new router object for handling routes
const user = require("../models/user"); // Importing the user model for interacting with the user data
const passport = require("passport"); // Importing passport for handling user authentication
const passportLocal = require("passport-local"); // Importing passport-local for local authentication strategy
const passportLocalMongoose = require("passport-local-mongoose"); // Importing passport-local-mongoose for easier integration of passport and mongoose


// Signup Route (GET /signup)
router.get("/signup", (req, res, next) => { 
    res.render("users/signup.ejs"); // Rendering the signup form (signup.ejs)
    // res.send("form"); // Alternative way to send a response if you don't use a view
});


// Signup Route (POST /signup)
router.post("/signup", async (req, res, next) => { 
   try {
    
    // Destructuring the request body to get the username, email, and password
    let { username, email, password } = req.body;
    
    // Creating a new user instance with the username and email
    const newUser = new user({ email, username });
    
    // Registering the new user with the given password
    const registeredUser = await user.register(newUser, password);
    
    console.log(registeredUser); // Logging the registered user to the console (for debugging)
    
    // Flashing a success message after successful signup
    req.flash("success", "Welcome to Wonderlust");
    
    // Redirecting the user to the listings page after successful signup
    res.redirect("/listings");
   
   } catch (e) {
    
    // If there's an error (such as validation error or duplicate user), it will be caught here
    req.flash("error", e.message); // Flashing the error message
    
    res.redirect("/signup"); // Redirecting back to the signup page on error
   }
});


// Login Route (GET /login)
router.get("/login", (req, res) => {
    res.render("users/login.ejs"); // Rendering the login form (login.ejs)
});


// Login Route (POST /login)
router.post("/login", 
    passport.authenticate("local", { // Using passport's local strategy for authentication
        failureRedirect: "/login", // Redirecting to login if authentication fails
        failureFlash: true // Enabling flash messages for failed login attempts
    }),
    (req, res) => { 
        req.flash("success", "Welcome to Wanderlust"); // Flashing a success message after successful login
        res.redirect("/listings"); // Redirecting to the listings page after login
    }
);



// Exporting the router to use it in other parts of the application
module.exports = router;
