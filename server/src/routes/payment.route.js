import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";

const router = Router();

// @route   POST /api/payment/create-intent
// @desc    Create a Stripe Payment Intent
router.post("/create-intent", createPaymentIntent);

export default router;
