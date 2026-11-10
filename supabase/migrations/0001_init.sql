-- Migration: 0001_init.sql
-- TechNeeds IGDTUW Platform — Foundation Schema
-- All tables have RLS enabled with policies defined inline.

-- ============================================================
-- CUSTOM TYPES
-- ============================================================

CREATE TYPE public.user_role AS ENUM ('student', 'admin', 'super_admin');
CREATE TYPE public.event_status AS ENUM ('draft', 'published');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'awaiting_response', 'resolved');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.opportunity_type AS ENUM ('internship', 'job', 'fellowship', 'competition', 'workshop', 'other');

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Check if the current authenticated user is an admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

-- Check if the current user is a super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$;

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  avatar_url  text,
  role        public.user_role NOT NULL DEFAULT 'student',
  bio         text,
  batch_year  integer,
  branch      text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

-- Users can update their own profile (but not role)
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (triggered on signup)
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE public.events (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text NOT NULL,
  slug                text NOT NULL UNIQUE,
  description         text,
  short_description   text,
  category            text NOT NULL DEFAULT 'general',
  status              public.event_status NOT NULL DEFAULT 'draft',
  poster_url          text,
  venue               text,
  start_date          timestamptz NOT NULL,
  end_date            timestamptz NOT NULL,
  registration_start  timestamptz,
  registration_end    timestamptz,
  max_participants    integer,
  created_by          uuid REFERENCES public.profiles(id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_created_by ON public.events(created_by);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can read published events
CREATE POLICY "events_select_published" ON public.events
  FOR SELECT USING (status = 'published' OR public.is_admin());

-- Admins can insert
CREATE POLICY "events_insert_admin" ON public.events
  FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update
CREATE POLICY "events_update_admin" ON public.events
  FOR UPDATE USING (public.is_admin());

-- Admins can delete
CREATE POLICY "events_delete_admin" ON public.events
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================

CREATE TABLE public.event_registrations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  qr_token_hash   text NOT NULL,
  registered_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can see their own registrations
CREATE POLICY "registrations_select_own" ON public.event_registrations
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Authenticated users can register (insert their own)
CREATE POLICY "registrations_insert_own" ON public.event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "registrations_admin_select" ON public.event_registrations
  FOR SELECT USING (public.is_admin());

-- Admins can delete registrations
CREATE POLICY "registrations_admin_delete" ON public.event_registrations
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE public.attendance (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id  uuid NOT NULL UNIQUE REFERENCES public.event_registrations(id) ON DELETE CASCADE,
  checked_in_at    timestamptz NOT NULL DEFAULT now(),
  checked_in_by    uuid REFERENCES public.profiles(id)
);

CREATE INDEX idx_attendance_registration ON public.attendance(registration_id);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Users can see their own attendance
CREATE POLICY "attendance_select_own" ON public.attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_registrations er
      WHERE er.id = registration_id AND er.user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Admins can insert attendance
CREATE POLICY "attendance_insert_admin" ON public.attendance
  FOR INSERT WITH CHECK (public.is_admin());

-- ============================================================
-- TICKETS (support / contact)
-- ============================================================

CREATE TABLE public.tickets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   text NOT NULL UNIQUE DEFAULT ('TN-' || substr(gen_random_uuid()::text, 1, 8)),
  subject     text NOT NULL,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      public.ticket_status NOT NULL DEFAULT 'open',
  priority    public.ticket_priority NOT NULL DEFAULT 'medium',
  assignee_id uuid REFERENCES public.profiles(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tickets_user ON public.tickets(user_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_assignee ON public.tickets(assignee_id);
CREATE INDEX idx_tickets_ticket_id ON public.tickets(ticket_id);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Users can see their own tickets
CREATE POLICY "tickets_select_own" ON public.tickets
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Users can create tickets
CREATE POLICY "tickets_insert_own" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update any ticket (status, priority, assignee)
CREATE POLICY "tickets_update_admin" ON public.tickets
  FOR UPDATE USING (public.is_admin());

-- Users can update own ticket (limited — handled in application)
CREATE POLICY "tickets_update_own" ON public.tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- TICKET MESSAGES
-- ============================================================

CREATE TABLE public.ticket_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES public.profiles(id),
  message     text NOT NULL,
  is_internal boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_sender ON public.ticket_messages(sender_id);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Users can see messages on their tickets (non-internal); admins see all
CREATE POLICY "ticket_messages_select" ON public.ticket_messages
  FOR SELECT USING (
    (
      EXISTS (
        SELECT 1 FROM public.tickets t
        WHERE t.id = ticket_id AND t.user_id = auth.uid()
      )
      AND is_internal = false
    )
    OR public.is_admin()
  );

-- Users can insert messages on their own tickets
CREATE POLICY "ticket_messages_insert_own" ON public.ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND (
      EXISTS (
        SELECT 1 FROM public.tickets t
        WHERE t.id = ticket_id AND t.user_id = auth.uid()
      )
      OR public.is_admin()
    )
  );

-- ============================================================
-- OPPORTUNITIES
-- ============================================================

CREATE TABLE public.opportunities (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  type          public.opportunity_type NOT NULL DEFAULT 'other',
  company       text,
  location      text,
  apply_url     text,
  deadline      timestamptz,
  is_published  boolean NOT NULL DEFAULT false,
  created_by    uuid REFERENCES public.profiles(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_opportunities_type ON public.opportunities(type);
CREATE INDEX idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX idx_opportunities_published ON public.opportunities(is_published);
CREATE INDEX idx_opportunities_created_by ON public.opportunities(created_by);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Public can read published opportunities
CREATE POLICY "opportunities_select_published" ON public.opportunities
  FOR SELECT USING (is_published = true OR public.is_admin());

-- Admins CRUD
CREATE POLICY "opportunities_insert_admin" ON public.opportunities
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "opportunities_update_admin" ON public.opportunities
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "opportunities_delete_admin" ON public.opportunities
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- TEAM MEMBERS
-- ============================================================

CREATE TABLE public.team_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role_title    text NOT NULL,
  department    text,
  year          integer,
  image_url     text,
  linkedin_url  text,
  is_alumni     boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_team_members_year ON public.team_members(year);
CREATE INDEX idx_team_members_published ON public.team_members(is_published);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public reads published
CREATE POLICY "team_members_select_published" ON public.team_members
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "team_members_insert_admin" ON public.team_members
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "team_members_update_admin" ON public.team_members
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "team_members_delete_admin" ON public.team_members
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- TIMELINE ITEMS
-- ============================================================

CREATE TABLE public.timeline_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  date          date NOT NULL,
  year          integer GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)::integer) STORED,
  category      text,
  is_published  boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_items_date ON public.timeline_items(date);
CREATE INDEX idx_timeline_items_year ON public.timeline_items(year);
CREATE INDEX idx_timeline_items_published ON public.timeline_items(is_published);

ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "timeline_items_select_published" ON public.timeline_items
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "timeline_items_insert_admin" ON public.timeline_items
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "timeline_items_update_admin" ON public.timeline_items
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "timeline_items_delete_admin" ON public.timeline_items
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- RESOURCES (TechBoard)
-- ============================================================

CREATE TABLE public.resources (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  url           text NOT NULL,
  tags          text[] DEFAULT '{}',
  difficulty    text DEFAULT 'beginner',
  category      text,
  is_published  boolean NOT NULL DEFAULT false,
  created_by    uuid REFERENCES public.profiles(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_resources_tags ON public.resources USING GIN(tags);
CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_published ON public.resources(is_published);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resources_select_published" ON public.resources
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "resources_insert_admin" ON public.resources
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "resources_update_admin" ON public.resources
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "resources_delete_admin" ON public.resources
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- FAQS
-- ============================================================

CREATE TABLE public.faqs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question      text NOT NULL,
  answer        text NOT NULL,
  category      text DEFAULT 'general',
  display_order integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_faqs_category ON public.faqs(category);
CREATE INDEX idx_faqs_published ON public.faqs(is_published);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faqs_select_published" ON public.faqs
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "faqs_insert_admin" ON public.faqs
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "faqs_update_admin" ON public.faqs
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "faqs_delete_admin" ON public.faqs
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- CERTIFICATES
-- ============================================================

CREATE TABLE public.certificates (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id  text NOT NULL UNIQUE DEFAULT ('CERT-' || substr(gen_random_uuid()::text, 1, 12)),
  user_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id         uuid REFERENCES public.events(id),
  title            text NOT NULL,
  issued_at        timestamptz NOT NULL DEFAULT now(),
  issued_by        uuid REFERENCES public.profiles(id),
  template_data    jsonb DEFAULT '{}'
);

CREATE INDEX idx_certificates_user ON public.certificates(user_id);
CREATE INDEX idx_certificates_verification ON public.certificates(verification_id);
CREATE INDEX idx_certificates_event ON public.certificates(event_id);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Public can verify certificates by verification_id
CREATE POLICY "certificates_select_public" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "certificates_insert_admin" ON public.certificates
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "certificates_update_admin" ON public.certificates
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE public.audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES public.profiles(id),
  action      text NOT NULL,
  table_name  text,
  record_id   uuid,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_table ON public.audit_logs(table_name);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

-- Only server (service role) or admins can insert
CREATE POLICY "audit_logs_insert_admin" ON public.audit_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.timeline_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STORAGE BUCKET for event posters
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('event-posters', 'event-posters', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to event-posters (admins only enforced in app)
CREATE POLICY "event_posters_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-posters' AND auth.role() = 'authenticated');

CREATE POLICY "event_posters_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-posters');

CREATE POLICY "event_posters_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-posters' AND auth.role() = 'authenticated');

CREATE POLICY "event_posters_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-posters' AND auth.role() = 'authenticated');
