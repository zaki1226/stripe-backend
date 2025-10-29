import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

app.get("/", (req, res) => res.send("Stripe backend working ✅"));

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;

    if (!amount) return res.status(400).json({ error: "Missing amount" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
