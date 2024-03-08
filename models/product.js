const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  features: [
    {
      type: String, // Each string in this array represents a feature, like a bullet point.
    },
  ],
});

// name of model is products (mongoose makes it plural and lowercase)
module.exports = mongoose.model("Product", ProductSchema);
