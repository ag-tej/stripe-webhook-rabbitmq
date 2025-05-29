import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import webhookService from "../services/webhook.service.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// @route   POST /webhook/stripe
// @desc    Webhook for Stripe Payment
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
      await webhookService.handleEvent(event);
      return res.status(200).send("Received");
    } catch (err) {
      console.error("Error handling webhook:", err);
      return res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
