-- Add streak tracking columns to player_rewards
ALTER TABLE player_rewards
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_play_date DATE,
ADD COLUMN IF NOT EXISTS ice_cream_earned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ice_cream_redeemed BOOLEAN DEFAULT FALSE;

-- Add has_seen_intro column to player_progress
ALTER TABLE player_progress
ADD COLUMN IF NOT EXISTS has_seen_intro BOOLEAN DEFAULT FALSE;
