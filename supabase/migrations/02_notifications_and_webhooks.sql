
-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('new_appointment', 'confirmed', 'canceled', 'admin_notification', 'appointment_created', 'appointment_edited')),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (true); -- Usually restricted to service role in production

CREATE POLICY "Users can update their own notifications (mark as read)" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.notifications FOR DELETE 
USING (auth.uid() = user_id);


-- 2. Add phone column to appointments table (if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'phone') THEN 
        ALTER TABLE public.appointments ADD COLUMN phone TEXT;
    END IF; 
END $$;


-- 3. Setup Webhooks (Requires pg_net extension)
-- Note: This MUST be run by a superuser or via the Supabase Dashboard SQL Editor
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to handle new appointments
CREATE OR REPLACE FUNCTION public.handle_new_appointment()
RETURNS TRIGGER AS $$
DECLARE
  user_phone text;
  user_name text;
  webhook_base_url text := 'https://primary-production-796d.up.railway.app'; -- REPLACE WITH YOUR N8N URL
BEGIN
  -- Fetch user details
  SELECT phone, name INTO user_phone, user_name FROM public.users WHERE id = NEW.user_id;

  -- 1. Notify User (New Appointment)
  PERFORM net.http_post(
    url := webhook_base_url || '/webhook/new-appointment',
    body := json_build_object(
      'event', 'new_appointment',
      'appointment_id', NEW.id,
      'user_id', NEW.user_id,
      'user_name', user_name,
      'user_phone', COALESCE(NEW.phone, user_phone),
      'appointment_date', NEW.date,
      'appointment_time', NEW.time,
      'exam_type', NEW.exam_type
    )::jsonb
  );

  -- 2. Notify Admin
  PERFORM net.http_post(
    url := webhook_base_url || '/webhook/admin-notification',
    body := json_build_object(
      'event', 'admin_notification',
      'appointment_id', NEW.id,
      'user_id', NEW.user_id,
      'user_name', user_name,
      'appointment_date', NEW.date,
      'appointment_time', NEW.time,
      'exam_type', NEW.exam_type,
      'admin_phone', '81997015454'
    )::jsonb
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT on appointments
DROP TRIGGER IF EXISTS on_new_appointment ON public.appointments;
CREATE TRIGGER on_new_appointment
AFTER INSERT ON public.appointments
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_appointment();


-- Function to handle status updates (Confirmed/Canceled)
CREATE OR REPLACE FUNCTION public.handle_appointment_status_change()
RETURNS TRIGGER AS $$
DECLARE
  user_phone text;
  webhook_base_url text := 'https://primary-production-796d.up.railway.app'; -- REPLACE WITH YOUR N8N URL
BEGIN
  -- Only proceed if status changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  SELECT phone INTO user_phone FROM public.users WHERE id = NEW.user_id;

  IF NEW.status = 'confirmed' THEN
    PERFORM net.http_post(
      url := webhook_base_url || '/webhook/appointment-confirmed',
      body := json_build_object(
        'event', 'confirmed',
        'appointment_id', NEW.id,
        'user_id', NEW.user_id,
        'user_phone', COALESCE(NEW.phone, user_phone),
        'appointment_date', NEW.date,
        'appointment_time', NEW.time,
        'exam_type', NEW.exam_type
      )::jsonb
    );
  ELSIF NEW.status = 'canceled' THEN
    PERFORM net.http_post(
      url := webhook_base_url || '/webhook/appointment-canceled',
      body := json_build_object(
        'event', 'canceled',
        'appointment_id', NEW.id,
        'user_id', NEW.user_id,
        'user_phone', COALESCE(NEW.phone, user_phone),
        'appointment_date', NEW.date,
        'appointment_time', NEW.time,
        'exam_type', NEW.exam_type
      )::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for UPDATE on appointments
DROP TRIGGER IF EXISTS on_appointment_status_change ON public.appointments;
CREATE TRIGGER on_appointment_status_change
AFTER UPDATE ON public.appointments
FOR EACH ROW EXECUTE PROCEDURE public.handle_appointment_status_change();
