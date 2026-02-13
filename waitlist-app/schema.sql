-- STAVLOS WAITLIST DATABASE SCHEMA

-- 1. WAITLIST TABLE
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist(id),
  referral_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTO-INCREMENT REFERRAL COUNT TRIGGER
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

CREATE TRIGGER on_waitlist_signup
  AFTER INSERT ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION increment_referral_count();

-- 3. RANK VIEW (for leaderboard and badge assignment)
CREATE OR REPLACE VIEW waitlist_with_rank AS
SELECT 
  *,
  ROW_NUMBER() OVER (ORDER BY created_at ASC) as current_rank
FROM waitlist;

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX idx_waitlist_created ON waitlist(created_at);
CREATE INDEX idx_waitlist_referral_code ON waitlist(referral_code);
CREATE INDEX idx_waitlist_referred_by ON waitlist(referred_by);
