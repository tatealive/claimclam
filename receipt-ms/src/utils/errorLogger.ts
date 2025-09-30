/**
 * Logs an error to the console with a consistent format.
 * @param context A string providing context for where the error occurred.
 * @param error The error object to be logged.
 */
export const logError = (context: string, error: unknown) => {
  console.error(`[Error Context: ${context}]`, error);
};
