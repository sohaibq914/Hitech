const BaseJoi = require("joi");
console.log("BEFORE JOI");

// validations on the server side (can't bypass even thru postman)
// not a mongoose schema... this will validate before saving it to mongoose

const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);
console.log("BEFORE JOI");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required().escapeHTML(), // title is required
    price: Joi.number().required().min(0), // price is required and min is 0
    // image: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
  }).required(), // saying the campground is required
  deleteImages: Joi.array(),
  features: Joi.array().required(), // putting it here so it's required and then putting it into features array model later
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
