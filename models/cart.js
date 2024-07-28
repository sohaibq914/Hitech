const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
  ],
});

// Add a default value for the items array
cartSchema.pre("save", function (next) {
  if (!this.items) {
    this.items = [];
  }
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
