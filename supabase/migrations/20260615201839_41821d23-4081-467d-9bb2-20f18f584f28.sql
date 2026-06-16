
DROP POLICY "Anyone can insert a visit" ON public.visits;
CREATE POLICY "Public can log a visit with valid payload" ON public.visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(session_id) BETWEEN 8 AND 64
    AND (country IS NULL OR char_length(country) BETWEEN 2 AND 56)
  );
