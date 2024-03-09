const { productSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Product = require("./models/product");

module.exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  console.log("after validation");
  if (error) {
    // getting the message of every error in object
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400); // q: why i'm getting this when submitting new form?
  } else {
    next();
  }
};
