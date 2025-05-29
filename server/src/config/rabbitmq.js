import amqplib from "amqplib";

let channel;
let connection;

export const initRabbitMQ = async () => {
  if (!channel || !connection) {
    connection = await amqplib.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue("mainQueue", { durable: true });
    await channel.assertQueue("retryQueue", { durable: true });
    // create a failedQueue to track failed jobs for debugging (can later create a small UI or CLI tool to view failed jobs, re-publish them to mainQueue after fixing or log them to a database instead of a RabbitMQ queue)
  }
};

export const getChannel = () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
};
