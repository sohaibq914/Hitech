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
            unit_amount: product.price * 100, // `product.price` is in dollars, neeed to convert to cents
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
      success_url: `${process.env.SERVER_URL}/cart`,
      cancel_url: `${process.env.SERVER_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.stripeWebhook = async (req, res) => {
  // const sig = req.headers["stripe-signature"];
  const event = req.body;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // const paymentIntent = event.data.object;
      console.log("STTTTIPPPEEEE was successful!");

      console.log("PaymentIntent was successful!");
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};
