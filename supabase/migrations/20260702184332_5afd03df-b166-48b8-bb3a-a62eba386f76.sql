
CREATE TYPE public.threat_classification AS ENUM ('safe', 'suspicious', 'high_risk');
CREATE TYPE public.content_type_enum AS ENUM ('sms', 'email', 'url', 'other');

CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type public.content_type_enum NOT NULL,
  content TEXT NOT NULL,
  classification public.threat_classification NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  explanation TEXT NOT NULL,
  indicators JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.analyses TO authenticated;
GRANT ALL ON public.analyses TO service_role;

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own analyses"
  ON public.analyses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX analyses_user_created_idx ON public.analyses (user_id, created_at DESC);
