const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
  Comment:{
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema); // Export as "Review"
