-- STAVLOS MAIN PRODUCT DATABASE SCHEMA

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. PROFILES (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  referred_by UUID, -- Link to waitlist referral if applicable
  referral_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. SYLLABUSES (PDF Metadata)
CREATE TABLE syllabuses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  file_path TEXT, -- Storage path if needed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_syllabuses_user ON syllabuses(user_id);

-- 4. SYLLABUS CHUNKS (Vector Store for RAG)
CREATE TABLE syllabus_chunks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  syllabus_id UUID REFERENCES syllabuses(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INT NOT NULL,
  embedding vector(1536), -- OpenAI embedding dimension
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector search index (IVFFlat for speed)
CREATE INDEX ON syllabus_chunks USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Search function
CREATE OR REPLACE FUNCTION match_syllabus_chunks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 3,
  filter_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  syllabus_id uuid,
  chunk_text text,
  chunk_index int,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.id,
    sc.syllabus_id,
    sc.chunk_text,
    sc.chunk_index,
    1 - (sc.embedding <=> query_embedding) AS similarity
  FROM syllabus_chunks sc
  JOIN syllabuses s ON sc.syllabus_id = s.id
  WHERE 
    (filter_user_id IS NULL OR s.user_id = filter_user_id)
    AND 1 - (sc.embedding <=> query_embedding) > match_threshold
  ORDER BY sc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. ANALYTICS LOGS (Cost & Usage Tracking)
CREATE TABLE analytics_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL, -- e.g., 'chat', 'upload', 'upgrade'
  model_used TEXT,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  cost NUMERIC(10, 6) DEFAULT 0,
  cache_hit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_date ON analytics_logs(created_at);
CREATE INDEX idx_analytics_user ON analytics_logs(user_id);

-- 6. SYSTEM CONFIG (Dynamic Controls)
CREATE TABLE system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO system_config (key, value, description) VALUES 
  ('daily_budget_eur', '20.00', 'Daily AI cost limit'),
  ('system_status', 'NORMAL', 'Current operational status'),
  ('maintenance_mode', 'false', 'Disable app access');

-- 7. USER USAGE TRACKING (Daily Limits)
CREATE TABLE user_usage (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'message', 'upload', 'solve'
  count INT DEFAULT 1,
  usage_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, action_type, usage_date)
);

CREATE INDEX idx_usage_user_date ON user_usage(user_id, usage_date);
-- 8. CONVERSATIONS (Grouped chat history)
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Conversation',
  preview TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON conversations(user_id);

-- 9. MESSAGES (Individual AI/User turns)
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  tokens_used INT DEFAULT 0,
  model_used TEXT,
  cache_hit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_convo ON messages(conversation_id);

-- 10. USER ACTIVITIES (For Streaks)
CREATE TABLE user_activities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, activity_date)
);

-- 11. WAITLIST & RANK (Ported from waitlist-app for parity)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist(id),
  referral_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE VIEW waitlist_with_rank AS
SELECT 
  *,
  ROW_NUMBER() OVER (ORDER BY created_at ASC) as current_rank
FROM waitlist;

-- 12. INITIAL CONFIG SEEDS
INSERT INTO system_config (key, value) VALUES ('kill_switch', 'false') ON CONFLICT (key) DO NOTHING;
INSERT INTO system_config (key, value) VALUES ('platform_revenue_total', '0') ON CONFLICT (key) DO NOTHING;
INSERT INTO system_config (key, value) VALUES ('referral_discount_percentage', '10') ON CONFLICT (key) DO NOTHING;

-- 13. ANALYTICS TABLES
CREATE TABLE IF NOT EXISTS daily_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  total_cost DECIMAL(10,5) DEFAULT 0,
  total_users_active INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
