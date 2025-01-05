const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Listing Schema Definition
const listingSchema = new Schema({
  
  // Title of the listing (required field)
  title: {
    type: String,
    required: true,
  },
  
  // Description of the listing (optional field)
  description: String,

  // Image URL for the listing with a default value
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1551524164-687a55dd1126?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) => (v === "" ? "https://images.unsplash.com/photo-1551524164-687a55dd1126?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v),
  },

  // Price of the listing (optional field)
  price: Number,

  // Location of the listing (optional field)
  location: String,

  // Country where the listing is located (optional field)
  country: String,

  // Reviews for the listing, referencing the Review model
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review", // Reference to the Review model
  }],
});

// Create and Export the Listing model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
