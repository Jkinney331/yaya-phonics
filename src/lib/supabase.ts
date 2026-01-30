import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface PlayerProfile {
  id: string;
  player_name: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerProgress {
  id: string;
  player_id: string;
  digraph_id: string;
  explored: boolean;
  practice_correct: number;
  practice_attempts: number;
  mastered: boolean;
  updated_at: string;
}

export interface PlayerRewards {
  id: string;
  player_id: string;
  stars: number;
  stickers: string[];
  rainbow_stripes: number;
  updated_at: string;
}

// Helper functions for syncing progress
export const syncProgressToCloud = async (
  playerId: string,
  progress: Record<string, { explored: boolean; practiceCorrect: number; practiceAttempts: number; mastered: boolean }>,
  rewards: { stars: number; stickers: string[]; rainbowStripes: number }
) => {
  // Sync progress for each digraph
  for (const [digraphId, data] of Object.entries(progress)) {
    await supabase
      .from('player_progress')
      .upsert({
        player_id: playerId,
        digraph_id: digraphId,
        explored: data.explored,
        practice_correct: data.practiceCorrect,
        practice_attempts: data.practiceAttempts,
        mastered: data.mastered,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'player_id,digraph_id',
      });
  }

  // Sync rewards
  await supabase
    .from('player_rewards')
    .upsert({
      player_id: playerId,
      stars: rewards.stars,
      stickers: rewards.stickers,
      rainbow_stripes: rewards.rainbowStripes,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'player_id',
    });
};

export const loadProgressFromCloud = async (playerId: string) => {
  const { data: progressData } = await supabase
    .from('player_progress')
    .select('*')
    .eq('player_id', playerId);

  const { data: rewardsData } = await supabase
    .from('player_rewards')
    .select('*')
    .eq('player_id', playerId)
    .single();

  return { progressData, rewardsData };
};

export const createPlayer = async (playerName: string) => {
  const { data, error } = await supabase
    .from('player_profiles')
    .insert({ player_name: playerName })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrCreatePlayer = async (playerName: string = 'Yaya') => {
  // Try to find existing player
  const { data: existing } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('player_name', playerName)
    .single();

  if (existing) return existing;

  // Create new player
  return createPlayer(playerName);
};
