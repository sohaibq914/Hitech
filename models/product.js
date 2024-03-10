const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// we wanted a virtual property so we had define an ImageSchema separate from the CampgroundSchema
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// each image in the model gets a virtual thumbnail property
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200"); // sizing our images
});

const opts = { toJSON: { virtuals: true } };

const ProductSchema = new Schema(
  {
    name: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    features: [
      {
        type: String, // Each string in this array represents a feature, like a bullet point.
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review", // review model
      },
    ],
  },
  opts
);

// name of model is products (mongoose makes it plural and lowercase)
module.exports = mongoose.model("Product", ProductSchema);
