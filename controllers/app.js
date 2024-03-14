const Product = require("../models/product"); // the products exports model
const Cart = require("../models/cart");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

module.exports.about = (req, res) => {
  res.render("app/about");
};

module.exports.contact = (req, res) => {
  res.render("app/contact");
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

  const event = req.body;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // since cartItems is string, we going to parse it as JSON so we can manipulate it
      const cartItems = JSON.parse(session.metadata.cartItems);
      const currentUser = JSON.parse(session.metadata.currentUser);
      updateProductStock(cartItems);
      await sendSuccessEmail("sohaibq914@gmail.com", currentUser, cartItems);
      await clearCart(currentUser);

      // handleCheckoutSessionCompleted(session);

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

module.exports.paypalPostPayment = async (req, res) => {
  const cartItems = req.body.cartItems;
  const currentUser = req.body.currentUser;
  try {
    // Update the product stock
    await sendSuccessEmail("hitech.taha@gmail.com", currentUser, cartItems);
    await updateProductStock(cartItems);
    await clearCart(currentUser);
  } catch (error) {
    console.log("Failed to process payment:", error);
    throw error;
  }
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

async function sendSuccessEmail(toEmail, currentUser, cartItems) {
  let htmlBody = `<p>Username: ${currentUser.username},</p>
                  <p>Email: ${currentUser.email}</p>
                  <p>Success Transaction!</p>
                  <p>Here's a summary of the order:</p>
                  <ul>`;

  // Construct the list items for each cart item
  let totalCost = 0;

  for (const item of cartItems) {
    const product = await Product.findById(item.id);

    // Calculate the cost of this item (price * quantity)
    let itemCost = product.price * item.quantity;

    // Add the cost of this item to the total cost
    totalCost += itemCost;
    htmlBody += `<li>
                   <strong>Name:</strong> ${product.name}<br />
                   <strong>Description:</strong> ${product.description}<br />
                   <strong>Price:</strong> $${product.price.toFixed(2)}<br />
                   <strong>Quantity:</strong> ${item.quantity}<br />
                   <strong>Cost:</strong> $${itemCost.toFixed(2)}
                 </li>`;
  }

  htmlBody += `</ul>`;
  htmlBody += `<p><strong>Total Cost:</strong> $${totalCost.toFixed(2)}</p>`;
  let transporter = nodemailer.createTransport({
    service: "gmail", // Use other email providers as needed
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email address
      pass: "fudx tkji fovu ldmn", // Your email password or app-specific password
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  // Set up email data with unicode symbols
  let mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: toEmail, // List of receivers
    subject: "Success Message", // Subject line
    text: "Your email client does not support HTML.", // Plain text body
    html: htmlBody, // HTML body

    // html: "<b>Hello world?</b>", // You can also send HTML body
  };

  // Send mail with defined transport object
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
