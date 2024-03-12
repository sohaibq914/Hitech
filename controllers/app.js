const Product = require("../models/product"); // the products exports model
const Cart = require("../models/cart");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
module.exports.aboutus = (req, res) => {
  res.render("app/aboutus");
};

module.exports.createCheckoutSession = async (req, res) => {
  const cartItems = req.body.cartItems;
  const currentUser = req.body.currentUser;

  try {
    // formatting the data for Stripe
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

    // Create Stripe checkout session with lineItems from above
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.SERVER_URL}/cart`,
      cancel_url: `${process.env.SERVER_URL}/cart`,
      metadata: {
        // stripe needs to send metadata as a string but we'll parse as JSON later
        cartItems: JSON.stringify(cartItems),
        currentUser: JSON.stringify(currentUser),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.stripeWebhook = async (req, res) => {
  // const sig = req.headers["stripe-signature"];

  // console.log("Type of cartItems:", typeof cartItems);
  // console.log("Is cartItems an array?:", Array.isArray(cartItems));
  const event = req.body;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // since cartItems is string, we going to parse it as JSON so we can manipulate it
      console.log("ATTEMPTING TO PARSE", session.metadata.cartItems);
      const cartItems = JSON.parse(session.metadata.cartItems);
      console.log("THESE ARE CART ITEMS", cartItems);
      console.log("CURRENT USER!!!!", session.metadata.currentUser);
      const currentUser = JSON.parse(session.metadata.currentUser);
      console.log("THIS IS CURRENT USER", currentUser);
      updateProductStock(cartItems);
      await clearCart(currentUser);
      // handleCheckoutSessionCompleted(session);

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

async function updateProductStock(cartItems) {
  try {
    await Promise.all(
      cartItems.map(async (item) => {
        // Fetch the product by its ID
        const product = await Product.findById(item.id);

        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        // Subtract the quantity bought from the product's stock
        product.stockCount = product.stockCount - item.quantity;

        // Ensure stock doesn't drop below zero
        if (product.stockCount < 0) product.stockCount = 0;

        // Save the updated product
        await product.save();
      })
    );

    console.log("Product stock updated successfully.");
  } catch (error) {
    console.error("Failed to update product stock:", error);
    throw error; // Rethrow or handle as needed
  }
}

async function clearCart(currentUser) {
  try {
    // Assuming currentUser is the user object and has a cart property
    if (!currentUser.cart) {
      console.log("User does not have a cart to clear.");
      return;
    }

    // Update the cart by setting items to an empty array
    const updatedCart = await Cart.findByIdAndUpdate(currentUser.cart, { $set: { items: [] } }, { new: true });

    if (!updatedCart) {
      console.log("Cart not found or unable to clear.");
    } else {
      console.log("Cart cleared successfully.");
    }
  } catch (error) {
    console.error("Error clearing the cart:", error);
  }
}
