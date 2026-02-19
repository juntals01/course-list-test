export function clientLog(level: string, message: string, user: string, context: string) {
  if (level === 'error') {
    console.error(`[${context}] ${message}`);
  } else {
    console.log(`[${context}] ${message}`);
  }
}
