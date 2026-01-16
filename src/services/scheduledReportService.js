
import { supabase } from '@/lib/customSupabaseClient';
import { addDays, addWeeks, addMonths } from 'date-fns';

/**
 * Triggers the N8N webhook to schedule the report in the automation system.
 * This effectively syncs our DB schedule with N8N triggers.
 */
export const triggerScheduledReportWebhook = async (reportData, action = 'upsert') => {
  const webhookUrl = import.meta.env.VITE_N8N_SCHEDULED_REPORTS_WEBHOOK_BASE_URL 
    ? `${import.meta.env.VITE_N8N_SCHEDULED_REPORTS_WEBHOOK_BASE_URL}/webhook/scheduled-reports`
    : null;

  if (!webhookUrl) {
    console.warn('VITE_N8N_SCHEDULED_REPORTS_WEBHOOK_BASE_URL is not configured.');
    // We don't block execution if webhook is missing in dev, but log it
    return { success: false, error: 'Webhook URL not configured' };
  }

  try {
    const payload = {
      action, // 'upsert' or 'delete' or 'trigger_now'
      scheduled_report_id: reportData.id,
      name: reportData.name,
      report_type: reportData.report_type,
      frequency: reportData.frequency,
      execution_time: reportData.execution_time,
      recipients: reportData.recipients,
      format: reportData.format,
      filters: reportData.filters,
      user_id: reportData.user_id,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error triggering scheduled report webhook:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Executes a report immediately (Run Now).
 * In a real scenario, this might call a specific Edge Function or N8N webhook 
 * that generates the file and emails it.
 */
export const executeReportImmediately = async (reportId) => {
  try {
    // 1. Fetch report details
    const { data: report, error } = await supabase
      .from('scheduled_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;

    // 2. Trigger webhook specifically for immediate execution
    const webhookResult = await triggerScheduledReportWebhook(report, 'trigger_now');
    
    if (!webhookResult.success && import.meta.env.MODE !== 'development') {
       throw new Error(webhookResult.error || 'Failed to trigger execution');
    }

    // 3. Log attempt (optimistic success for UI feedback if webhook isn't actually waiting)
    // Real implementation would have the webhook/worker update history upon completion.
    // For demo/UI responsiveness:
    await supabase.from('scheduled_reports_history').insert({
        scheduled_report_id: reportId,
        status: 'pending', // Pending real execution
        recipients_sent: report.recipients,
        executed_at: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error executing report:', error);
    return { success: false, error: error.message };
  }
};

export const validateRecipients = (emails) => {
  if (!Array.isArray(emails) || emails.length === 0) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.every(email => emailRegex.test(email.trim()));
};

export const validateReportData = (data) => {
  const errors = [];
  if (!data.name) errors.push("Name is required");
  if (!data.report_type) errors.push("Report type is required");
  if (!['daily', 'weekly', 'monthly'].includes(data.frequency)) errors.push("Invalid frequency");
  if (!data.execution_time) errors.push("Execution time is required");
  if (!validateRecipients(data.recipients)) errors.push("Valid recipients are required");
  return errors;
};
