import { isDuplicateEvent, markEventHandled } from "../utils/idempotency.js";
import { publishToMainQueue } from "../queue/producer.js";
import { logEvent } from "../utils/logger.js";

const handleEvent = async (event) => {
  // Log the incoming event
  logEvent(event);
  // Prevent duplicate event processing
  if (await isDuplicateEvent(event.id)) {
    console.log(`Duplicate webhook event ignored: ${event.id}`);
    return;
  }
  // Push job to queue
  await publishToMainQueue(event);
  // Mark event as handled
  await markEventHandled(event.id);
};

export default { handleEvent };
