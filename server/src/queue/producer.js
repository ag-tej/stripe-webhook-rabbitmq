import { getChannel } from "../config/rabbitmq.js";

export const publishToMainQueue = async (event) => {
  const channel = getChannel();
  channel.sendToQueue("mainQueue", Buffer.from(JSON.stringify(event)), {
    persistent: true,
  });
};

export const publishToRetryQueue = async (job, retryCount = 1) => {
  const channel = getChannel();
  // Exponential backoff
  const delay = Math.pow(2, retryCount) * 1000;
  setTimeout(() => {
    channel.sendToQueue(
      "retryQueue",
      Buffer.from(JSON.stringify({ ...job, retryCount })),
      { persistent: true }
    );
  }, delay);
};
