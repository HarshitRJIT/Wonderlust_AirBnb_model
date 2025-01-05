// Import necessary modules
const mongoose = require("mongoose"); // Mongoose for MongoDB interaction
const initData = require("./data.js"); // Import initial data for database seeding
const Listing = require("../models/listing.js"); // Import Listing model to interact with listings collection

// MongoDB URL to connect to the local database named 'wanderlust'
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Main function to establish connection to the MongoDB database
main()
  .then(() => {
    console.log("connected to DB"); // Log message if the connection is successful
  })
  .catch((err) => {
    console.log(err); // Log any error if connection fails
  });

// Async function to connect to the MongoDB database
async function main() {
  await mongoose.connect(MONGO_URL); // Establish connection to the database
}

// Function to initialize the database by clearing and inserting data
const initDB = async () => {
  await Listing.deleteMany({}); // Delete all existing listings in the database
  await Listing.insertMany(initData.data); // Insert initial data from the data.js file into the database
  console.log("data was initialized"); // Log message confirming that data was successfully inserted
};

// Call the function to initialize the database
initDB();
