const Product = require("../models/product"); // the product exports model
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  product.reviews.push(review);
  await review.save();
  await product.save();
  req.flash("success", "Created new review!");
  res.redirect(`/products/${product._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // get product and delete item that has reviewId in reviews array
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/products/${id}`);
};
