-- STAVLOS COMBINED DATABASE SCHEMA
-- This script contains all tables for both the Waitlist and Main App.
-- Run this in your Supabase SQL Editor.

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. WAITLIST TABLES
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist(id),
  referral_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral count trigger
CREATE OR REPLACE FUNCTION increment_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE waitlist 
    SET referral_count = referral_count + 1
    WHERE id = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_waitlist_signup ON waitlist;
CREATE TRIGGER on_waitlist_signup
  AFTER INSERT ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION increment_referral_count();

-- Rank View
CREATE OR REPLACE VIEW waitlist_with_rank AS
SELECT 
  *,
  ROW_NUMBER() OVER (ORDER BY created_at ASC) as current_rank
FROM waitlist;

-- 3. PROFILE & AUTH TABLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  referred_by_code TEXT, -- Referral code from waitlist
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. APPLICATION TABLES (Syllabus, etc.)
CREATE TABLE IF NOT EXISTS syllabuses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS syllabus_chunks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  syllabus_id UUID REFERENCES syllabuses(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 5. ANALYTICS & LOGGING
CREATE TABLE IF NOT EXISTS analytics_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  model_used TEXT,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  cost NUMERIC(10, 6) DEFAULT 0,
  cache_hit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_usage (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  count INT DEFAULT 1,
  usage_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, action_type, usage_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_syllabuses_user ON syllabuses(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON user_usage(user_id, usage_date);
