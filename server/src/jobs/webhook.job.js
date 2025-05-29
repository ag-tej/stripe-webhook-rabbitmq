export const handleWebhookJob = async (job) => {
  switch (job.type) {
    case "payment_intent.succeeded":
      console.log(`Processing successful payment: ${job.data.object.id}`);
      // send confirmation email
      // send notifications
      // process orders
      break;

    case "payment_intent.payment_failed":
      console.log(`Payment failed: ${job.data.object.id}`);
      // handle failed payment
      break;

    default:
      console.log(`Unhandled event type: ${job.type}`);
      break;
  }
  // Simulate failure (for testing retries)
  if (true) throw new Error("Random failure");
};
