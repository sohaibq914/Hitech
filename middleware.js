const { productSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Product = require("./models/product");

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    // getting the message of every error in object
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
