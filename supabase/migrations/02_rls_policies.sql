
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
CREATE POLICY "Users can view their own data" 
  ON public.users FOR SELECT 
  USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'master'))
  );

CREATE POLICY "Master can view all users" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'master')
  );

CREATE POLICY "Users can update their own data" 
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- APPOINTMENTS TABLE POLICIES
CREATE POLICY "Users can create appointments" 
  ON public.appointments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointments" 
  ON public.appointments FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'master'))
  );

CREATE POLICY "Admin/Master can update appointments" 
  ON public.appointments FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'master'))
  );

-- NOTIFICATIONS TABLE POLICIES
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE 
  USING (user_id = auth.uid());

-- AVAILABILITIES TABLE POLICIES
CREATE POLICY "Everyone can view availabilities" 
  ON public.availabilities FOR SELECT 
  USING (true);

CREATE POLICY "Admin/Master can manage availabilities" 
  ON public.availabilities FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'master'))
  );
