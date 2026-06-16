
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX visits_session_id_idx ON public.visits(session_id);
CREATE INDEX visits_created_at_idx ON public.visits(created_at DESC);
GRANT SELECT, INSERT ON public.visits TO anon, authenticated;
GRANT ALL ON public.visits TO service_role;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert a visit" ON public.visits FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read visit aggregates" ON public.visits FOR SELECT TO anon, authenticated USING (true);
