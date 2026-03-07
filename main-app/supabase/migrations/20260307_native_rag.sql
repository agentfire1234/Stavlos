-- STEP 1 & 4: Update Supabase schema for native embeddings

-- Drop old chunks table and recreate with 384 dimensions
DROP TABLE IF EXISTS syllabus_chunks CASCADE;

CREATE TABLE syllabus_chunks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  syllabus_id UUID REFERENCES syllabuses(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INT NOT NULL,
  embedding vector(384),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector search index (IVFFlat for speed)
CREATE INDEX ON syllabus_chunks USING ivfflat (embedding vector_cosine_ops);

-- Update search function for 384 dimensions
DROP FUNCTION IF EXISTS match_syllabus_chunks;

CREATE OR REPLACE FUNCTION match_syllabus_chunks(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  filter_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid, 
  syllabus_id uuid, 
  chunk_text text, 
  chunk_index int, 
  similarity float
)
LANGUAGE plpgsql AS $$
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
  WHERE (filter_user_id IS NULL OR s.user_id = filter_user_id)
    AND 1 - (sc.embedding <=> query_embedding) > match_threshold
  ORDER BY sc.embedding <=> query_embedding 
  LIMIT match_count;
END; $$;

-- STEP 4: Add total_chunks column to syllabuses
ALTER TABLE syllabuses ADD COLUMN IF NOT EXISTS total_chunks INT DEFAULT 0;
