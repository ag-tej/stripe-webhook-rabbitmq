const processedEvents = new Set(); // For production, use DB

export const isDuplicateEvent = async (eventId) => {
  return processedEvents.has(eventId);
};

export const markEventHandled = async (eventId) => {
  processedEvents.add(eventId);
};
