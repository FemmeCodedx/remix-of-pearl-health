
-- Enable scheduling + HTTP for cron job
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Opt-out flag on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notif_phase_change boolean NOT NULL DEFAULT true;

-- Push subscription endpoints (one per device/browser)
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own push subs"
  ON public.push_subscriptions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users insert own push subs"
  ON public.push_subscriptions FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own push subs"
  ON public.push_subscriptions FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Log of phase notifications sent (dedupe)
CREATE TABLE public.notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  phase text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  success boolean NOT NULL DEFAULT true
);

CREATE INDEX idx_notification_log_user_sent ON public.notification_log(user_id, sent_at DESC);

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notification log"
  ON public.notification_log FOR SELECT
  TO authenticated USING (user_id = auth.uid());
