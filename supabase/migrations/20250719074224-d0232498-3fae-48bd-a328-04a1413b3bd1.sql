-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to run auto content generation every hour
SELECT cron.schedule(
  'auto-content-generation',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://wiylggtouvdspdrymzlr.supabase.co/functions/v1/auto-content-cron',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeWxnZ3RvdXZkc3BkcnltemxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODQzNjMsImV4cCI6MjA2ODM2MDM2M30._nN-B5hUBdzQhqFpnUmwvIqVmj33dDOS9OkmgQECZJ0"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);