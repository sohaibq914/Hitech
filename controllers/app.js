const Product = require("../models/product"); // the products exports model
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports.aboutus = (req, res) => {
  res.render("app/aboutus");
};

module.exports.createCheckoutSession = async (req, res) => {
  const cartItems = req.body.cartItems;

  try {
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.id).lean(); // Fetch product details using ID

        // Check if product exists
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              // Add images if available, ensure it's in an array format for Stripe
            },
            unit_amount: product.price * 100, // Assuming `product.price` is in dollars
          },
          quantity: item.quantity,
        };
      })
    );

    // Create Stripe checkout session with lineItems
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://google.com`,
      cancel_url: `https://youtube.com`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session", error);
    res.status(500).json({ error: error.message });
  }
};
