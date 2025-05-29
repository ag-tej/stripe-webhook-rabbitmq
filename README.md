# Stripe Webhooks + RabbitMQ Queue System

A full-stack application that handles **Stripe webhook events** using a **RabbitMQ-backed queue system** with retry and fail-safe logic. Built with **Node.js**, **React (Vite)**, **MongoDB**, **Docker**, and **RabbitMQ**.

![Stripe](https://img.shields.io/badge/Stripe-Payments-blue.svg)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Queueing-orange)
![Node.js](https://img.shields.io/badge/Node.js-API-green)
![React](https://img.shields.io/badge/React-Client-lightblue)
![MIT License](https://img.shields.io/badge/license-MIT-brightgreen)

---

## 📂 Folder Structure

```bash
.
├── client         # Frontend (React + Vite)
└── server         # Backend (Express, Stripe, RabbitMQ)
````

---

## 📦 Features

* ✅ Stripe payment integration
* ✅ Secure webhook handling
* ✅ Asynchronous job queue with RabbitMQ
* ✅ Retry logic with exponential backoff (max 5 retries)
* ✅ Failed job handling (future: dead-letter queue or DB logging)

---

## 🧑‍💻 Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas) (optional)
* Docker
* Stripe account → [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
* [LocalTunnel](https://theboroer.github.io/localtunnel-www/) (or similar service for local testing)

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ag-tej/stripe-webhook-rabbitmq.git
cd stripe-webhook-rabbitmq
```

---

## 🌐 Frontend Setup (`/client`)

```bash
cd client
npm install
cp .env.example .env
```

### ✏️ In `.env`:

```env
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

🔗 Find this key at:
[https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)

```bash
npm run dev
```

---

## 🖥️ Backend Setup (`/server`)

```bash
cd server
npm install
cp .env.example .env
```

### ✏️ In `.env`:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
MONGODB_URI=mongodb://mongo:27017/stripe-webhook-rabbitmq
RABBITMQ_URI=amqp://guest:guest@localhost:5672
PORT=5000
```

🔐 Get keys from:

* [Stripe API Keys](https://dashboard.stripe.com/test/apikeys)
* [Stripe Webhooks](https://dashboard.stripe.com/test/workbench/webhooks)

```bash
npm run dev
```

---

## 🧵 Stripe Webhook Setup

1. Expose your local server:

   ```bash
   lt --port 5000
   ```

2. Create a webhook in Stripe Dashboard:
   [https://dashboard.stripe.com/test/workbench/webhooks](https://dashboard.stripe.com/test/workbench/webhooks)

   * **Endpoint URL:** `https://your-localtunnel-url/webhook/stripe`
   * **Events to subscribe:**

     * `payment_intent.succeeded`
     * `payment_intent.payment_failed`

3. Copy the **Webhook Secret** and paste it in `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 🧃 RabbitMQ (Docker Setup)

```bash
docker run -it --rm --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:4-management
```

📊 RabbitMQ Dashboard: [http://localhost:15672](http://localhost:15672)
Login: `guest` / `guest`

---

## 🖥️ Dev Environment (Terminals)

| Terminal                  | Command                           |
| ------------------------- | --------------------------------- |
| Frontend                  | `cd client && npm run dev`        |
| Backend API               | `cd server && npm run dev`        |
| Worker (consumer)         | `cd server && npm run dev:worker` |
| Tunnel (for webhook)      | `lt --port 5000`                  |
| RabbitMQ (if not running) | `docker run ...` (see above)      |

---

## 💳 Stripe Test Checkout

Open your browser at:

```bash
http://localhost:5173/checkout
```

1. Click the **Pay Now** button to open the Stripe card element.

2. Use the following test card details:

   ```
   Card number: 4242 4242 4242 4242
   Expiry: 12/36
   CVC: 567
   ZIP: 12345
   ```

3. Submit the form. You’ll see a success or failure message based on Stripe’s mock response.

🪝 The webhook then triggers a `POST` to `/api/webhook/stripe`, handled via RabbitMQ queues.

---

## 💣 Simulating Failures for Retry Logic

To simulate job failure (e.g., in `jobs/webhook.job.js`):

```js
// Simulate failure (for testing retries)
if (true) throw new Error("Random failure");
```

* The job will be **requeued** to `retryQueue` with **exponential delay**.
* Retries up to 5 times.
* After exceeding retry count, you can move the job to a **failedQueue** (optional, see below).

---

## 🧟 Failed Job Handling (Optional)

You can set up a `failedQueue` to track exhausted jobs:

* 🔍 Use it to debug.
* 🛠️ Add a UI or CLI to inspect and republish jobs.
* 🧾 Alternatively, store failed jobs in a database.

---

## 🧠 Future Ideas

* Add a monitoring dashboard for queues.
* Create dedicated consumers for email, SMS, WhatsApp via a notification queue.

---

## 📝 License

MIT License — Feel free to fork and build upon it!
