const express = require("express");
const router = express.Router();
const app = require("../controllers/app");
const bodyParser = require("body-parser");

router.get("/aboutus", app.aboutus);
router.post("/create-checkout-session", app.createCheckoutSession);

// Stripe requires the raw body to construct the event
router.post("/stripe-webhook", express.json({ type: "application/json" }), app.stripeWebhook);
module.exports = router;
