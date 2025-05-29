import { initRabbitMQ, getChannel } from "../config/rabbitmq.js";
import { publishToRetryQueue } from "../queue/producer.js";
import { handleWebhookJob } from "../jobs/webhook.job.js";

await initRabbitMQ();
const channel = getChannel();

console.log("Worker is listening to mainQueue");

channel.consume("mainQueue", async (msg) => {
  if (!msg) return;
  const job = JSON.parse(msg.content.toString());
  try {
    await handleWebhookJob(job);
    channel.ack(msg);
  } catch (err) {
    console.error(
      `Initial job failed, sending to retryQueue: ${job.data.object.id}`,
      err
    );
    await publishToRetryQueue({ ...job, retryCount: 1 });
    channel.ack(msg);
  }
});

channel.consume("retryQueue", async (msg) => {
  if (!msg) return;
  const job = JSON.parse(msg.content.toString());
  const retryCount = job.retryCount ?? 1;
  try {
    await handleWebhookJob(job);
    channel.ack(msg);
  } catch (err) {
    console.error(
      `Retry ${job.retryCount} failed, retrying again: ${job.data.object.id}`,
      err
    );
    if (retryCount < 5) {
      await publishToRetryQueue(job, retryCount + 1);
    } else {
      console.error(
        `Job failed permanently after ${job.retryCount} retries:`,
        job
      );
      // optionally: log to DB or file
    }
    channel.ack(msg);
  }
});
