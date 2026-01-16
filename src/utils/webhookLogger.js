
const WEBHOOK_LOG_KEY = 'n8n_webhook_logs';
const MAX_LOG_ENTRIES = 50;

/**
 * Logs a webhook attempt to localStorage.
 * 
 * @param {string} appointmentId - The ID of the appointment associated with the webhook.
 * @param {string} status - 'success' | 'error' | 'pending'.
 * @param {object} details - Additional details like error message or response status.
 */
export const logWebhookAttempt = (appointmentId, status, details = {}) => {
  try {
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      appointmentId,
      status,
      ...details
    };

    const storedLogs = localStorage.getItem(WEBHOOK_LOG_KEY);
    let logs = storedLogs ? JSON.parse(storedLogs) : [];

    // Add new log to the beginning
    logs.unshift(logEntry);

    // Keep only the last MAX_LOG_ENTRIES
    if (logs.length > MAX_LOG_ENTRIES) {
      logs = logs.slice(0, MAX_LOG_ENTRIES);
    }

    localStorage.setItem(WEBHOOK_LOG_KEY, JSON.stringify(logs));
    console.log(`[Webhook Logger] Logged ${status} for ${appointmentId}`);
  } catch (e) {
    console.error('[Webhook Logger] Failed to save log:', e);
  }
};

/**
 * Retrieves all webhook logs from localStorage.
 * 
 * @returns {Array} List of log entries.
 */
export const getWebhookLogs = () => {
  try {
    const storedLogs = localStorage.getItem(WEBHOOK_LOG_KEY);
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (e) {
    console.error('[Webhook Logger] Failed to retrieve logs:', e);
    return [];
  }
};

/**
 * Clears all webhook logs from localStorage.
 */
export const clearWebhookLogs = () => {
  localStorage.removeItem(WEBHOOK_LOG_KEY);
};

/**
 * Exports logs as a JSON string for debugging.
 * 
 * @returns {string} JSON string of logs.
 */
export const exportLogsAsJson = () => {
  const logs = getWebhookLogs();
  return JSON.stringify(logs, null, 2);
};
