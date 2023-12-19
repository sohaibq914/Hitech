const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  bulletDesc: String,
});

// name of model is products (mongoose makes it plural and lowercase)
module.exports = mongoose.model("Product", ProductSchema);
