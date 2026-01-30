-- Yaya's Sound Safari Database Schema
-- Player profiles table
CREATE TABLE IF NOT EXISTS player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player progress per digraph
CREATE TABLE IF NOT EXISTS player_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  digraph_id TEXT NOT NULL, -- 'sh', 'ch', 'th', 'wh', 'ck'
  explored BOOLEAN DEFAULT FALSE,
  practice_correct INTEGER DEFAULT 0,
  practice_attempts INTEGER DEFAULT 0,
  mastered BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, digraph_id)
);

-- Player rewards
CREATE TABLE IF NOT EXISTS player_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE UNIQUE,
  stars INTEGER DEFAULT 0,
  stickers TEXT[] DEFAULT '{}',
  rainbow_stripes INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game sessions for analytics (optional)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  game_mode TEXT NOT NULL, -- 'explore', 'match', 'hunt'
  digraph_id TEXT,
  correct_answers INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a kids app without auth)
-- In production, you'd want proper auth
DROP POLICY IF EXISTS "Allow public read" ON player_profiles;
DROP POLICY IF EXISTS "Allow public insert" ON player_profiles;
DROP POLICY IF EXISTS "Allow public update" ON player_profiles;
CREATE POLICY "Allow public read" ON player_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON player_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON player_profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read" ON player_progress;
DROP POLICY IF EXISTS "Allow public insert" ON player_progress;
DROP POLICY IF EXISTS "Allow public update" ON player_progress;
CREATE POLICY "Allow public read" ON player_progress FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON player_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON player_progress FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read" ON player_rewards;
DROP POLICY IF EXISTS "Allow public insert" ON player_rewards;
DROP POLICY IF EXISTS "Allow public update" ON player_rewards;
CREATE POLICY "Allow public read" ON player_rewards FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON player_rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON player_rewards FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read" ON game_sessions;
DROP POLICY IF EXISTS "Allow public insert" ON game_sessions;
CREATE POLICY "Allow public read" ON game_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON game_sessions FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_progress_player_id ON player_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_player_rewards_player_id ON player_rewards(player_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_player_id ON game_sessions(player_id);

-- Insert default player "Yaya"
INSERT INTO player_profiles (player_name) VALUES ('Yaya') ON CONFLICT DO NOTHING;
