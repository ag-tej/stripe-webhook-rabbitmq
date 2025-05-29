import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.route.js";
import webhookRoute from "./routes/webhook.route.js";
import { initRabbitMQ } from "./config/rabbitmq.js";

const app = express();
const PORT = process.env.PORT;
app.use(cors());

// webhook
app.use("/webhook", webhookRoute);

// middlewares
app.use(express.json());

// Routes
app.use("/api/payment", paymentRoutes);

// Start server
const startServer = async () => {
  await initRabbitMQ();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
