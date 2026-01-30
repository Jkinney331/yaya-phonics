import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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
  has_seen_intro: boolean;
  updated_at: string;
}

export interface PlayerRewards {
  id: string;
  player_id: string;
  stars: number;
  stickers: string[];
  rainbow_stripes: number;
  streak_days: number;
  last_play_date: string | null;
  ice_cream_earned: boolean;
  ice_cream_redeemed: boolean;
  updated_at: string;
}

// Helper functions for syncing progress
export const syncProgressToCloud = async (
  playerId: string,
  progress: Record<
    string,
    { explored: boolean; practiceCorrect: number; practiceAttempts: number; mastered: boolean; hasSeenIntro: boolean }
  >,
  rewards: {
    stars: number;
    stickers: string[];
    rainbowStripes: number;
    streakDays: number;
    lastPlayDate: string | null;
    iceCreamEarned: boolean;
    iceCreamRedeemed: boolean;
  }
) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
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
        has_seen_intro: data.hasSeenIntro,
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
      streak_days: rewards.streakDays,
      last_play_date: rewards.lastPlayDate,
      ice_cream_earned: rewards.iceCreamEarned,
      ice_cream_redeemed: rewards.iceCreamRedeemed,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'player_id',
    });
};

export const loadProgressFromCloud = async (playerId: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
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
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
  const { data, error } = await supabase
    .from('player_profiles')
    .insert({ player_name: playerName })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrCreatePlayer = async (playerName: string = 'Yaya') => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }
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
