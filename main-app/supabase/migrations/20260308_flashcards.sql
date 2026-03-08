-- Flashcard sets table
CREATE TABLE flashcard_sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source TEXT DEFAULT 'tool', -- 'tool' | 'chat' | 'syllabus'
  syllabus_id UUID REFERENCES syllabuses(id) ON DELETE SET NULL,
  card_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Individual cards table
CREATE TABLE flashcards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  set_id UUID REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  card_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Per-card progress tracking (one row per user per card)
CREATE TABLE flashcard_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  set_id UUID REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  ease_factor FLOAT DEFAULT 2.5,
  interval INT DEFAULT 0,        -- days until next review
  repetitions INT DEFAULT 0,     -- consecutive correct answers
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  total_reviews INT DEFAULT 0,
  correct_reviews INT DEFAULT 0,
  UNIQUE(user_id, card_id)
);

-- RLS policies
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own flashcard sets"
ON flashcard_sets FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own flashcards"
ON flashcards FOR ALL USING (
  set_id IN (
    SELECT id FROM flashcard_sets WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can only see their own progress"
ON flashcard_progress FOR ALL USING (auth.uid() = user_id);

-- Index for fast due card queries
CREATE INDEX idx_flashcard_progress_due 
ON flashcard_progress(user_id, next_review_at);
