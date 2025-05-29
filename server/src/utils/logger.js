import fs from "fs";
import path from "path";

const logPath = path.resolve("logs", "webhook-events.log");

export const logEvent = (event) => {
  const logLine = `${new Date().toISOString()} | ${event.id} | ${event.type}\n`;
  fs.appendFileSync(logPath, logLine);
};
