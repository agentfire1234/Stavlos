-- Add summary columns to chats table for conversation memory
ALTER TABLE chats ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS summary_updated_at TIMESTAMPTZ;

-- Comment for documentation
COMMENT ON COLUMN chats.summary IS 'AI generated summary of older messages in the conversation.';
COMMENT ON COLUMN chats.summary_updated_at IS 'Timestamp of when the summary was last calculated.';
