import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface DigraphProgress {
  explored: boolean;
  practiceCorrect: number;
  practiceAttempts: number;
  mastered: boolean;
  hasSeenIntro: boolean;
}

export interface GameState {
  // Player
  playerId: string | null;
  playerName: string;

  // Progress tracking
  progress: Record<string, DigraphProgress>;
  currentDigraphId: string | null;

  // Rewards
  stars: number;
  stickers: string[];
  rainbowStripes: number;

  // Streak system
  streakDays: number;
  lastPlayDate: string | null;
  streakGoal: number;
  iceCreamEarned: boolean;
  iceCreamRedeemed: boolean;

  // Play timer
  todayPlayTimeSeconds: number;
  sessionStartTime: number | null;
  lastSessionDate: string | null;

  // Sync status
  isSyncing: boolean;
  lastSyncedAt: string | null;

  // Actions
  setCurrentDigraph: (id: string) => void;
  markDigraphExplored: (id: string) => void;
  markIntroSeen: (id: string) => void;
  recordPracticeAttempt: (id: string, correct: boolean) => void;
  addStars: (count: number) => void;
  addSticker: (sticker: string) => void;
  addRainbowStripe: () => void;
  resetProgress: () => void;

  // Streak actions
  startSession: () => void;
  endSession: () => void;
  checkAndUpdateStreak: () => void;
  redeemIceCream: () => void;

  // Cloud sync
  initializePlayer: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
}

const initialProgress: Record<string, DigraphProgress> = {
  sh: { explored: false, practiceCorrect: 0, practiceAttempts: 0, mastered: false, hasSeenIntro: false },
  ch: { explored: false, practiceCorrect: 0, practiceAttempts: 0, mastered: false, hasSeenIntro: false },
  th: { explored: false, practiceCorrect: 0, practiceAttempts: 0, mastered: false, hasSeenIntro: false },
  wh: { explored: false, practiceCorrect: 0, practiceAttempts: 0, mastered: false, hasSeenIntro: false },
  ck: { explored: false, practiceCorrect: 0, practiceAttempts: 0, mastered: false, hasSeenIntro: false },
};

const getTodayDate = () => new Date().toISOString().split('T')[0];
const getYesterdayDate = () => new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerId: null,
      playerName: 'Yaya',
      progress: initialProgress,
      currentDigraphId: null,
      stars: 0,
      stickers: [],
      rainbowStripes: 0,
      streakDays: 0,
      lastPlayDate: null,
      streakGoal: 5,
      iceCreamEarned: false,
      iceCreamRedeemed: false,
      todayPlayTimeSeconds: 0,
      sessionStartTime: null,
  lastSessionDate: null,
      isSyncing: false,
      lastSyncedAt: null,

      setCurrentDigraph: (id) => set({ currentDigraphId: id }),

      markDigraphExplored: (id) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [id]: { ...state.progress[id], explored: true },
          },
        }));
        get().syncToCloud();
      },

      markIntroSeen: (id) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [id]: { ...state.progress[id], hasSeenIntro: true },
          },
        }));
        get().syncToCloud();
      },

      recordPracticeAttempt: (id, correct) => {
        set((state) => {
          const current = state.progress[id];
          const newCorrect = correct ? current.practiceCorrect + 1 : current.practiceCorrect;
          const newAttempts = current.practiceAttempts + 1;
          const mastered = newCorrect >= 5;

          return {
            progress: {
              ...state.progress,
              [id]: {
                ...current,
                practiceCorrect: newCorrect,
                practiceAttempts: newAttempts,
                mastered,
              },
            },
            stars: correct ? state.stars + 1 : state.stars,
          };
        });
        get().syncToCloud();
      },

      addStars: (count) => {
        set((state) => ({ stars: state.stars + count }));
        get().syncToCloud();
      },

      addSticker: (sticker) => {
        set((state) => ({
          stickers: state.stickers.includes(sticker)
            ? state.stickers
            : [...state.stickers, sticker],
        }));
        get().syncToCloud();
      },

      addRainbowStripe: () => {
        set((state) => ({
          rainbowStripes: Math.min(state.rainbowStripes + 1, 7),
        }));
        get().syncToCloud();
      },

      resetProgress: () => {
        set({
          progress: initialProgress,
          currentDigraphId: null,
          stars: 0,
          stickers: [],
          rainbowStripes: 0,
        });
        get().syncToCloud();
      },

      // Streak and timer actions
      startSession: () => {
        const today = getTodayDate();
        const { lastSessionDate } = get();

        // Reset today's time if it's a new day
        if (lastSessionDate !== today) {
          set({
            sessionStartTime: Date.now(),
            todayPlayTimeSeconds: 0,
            lastSessionDate: today,
          });
        } else {
          set({ sessionStartTime: Date.now() });
        }
      },

      endSession: () => {
        const { sessionStartTime, todayPlayTimeSeconds } = get();
        if (sessionStartTime) {
          const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
          const newTotalTime = todayPlayTimeSeconds + sessionDuration;
          set({
            todayPlayTimeSeconds: newTotalTime,
            sessionStartTime: null,
          });
          get().checkAndUpdateStreak();
        }
      },

      checkAndUpdateStreak: () => {
        const { todayPlayTimeSeconds, lastPlayDate, streakDays, streakGoal } = get();
        const today = getTodayDate();
        const yesterday = getYesterdayDate();

        // Need at least 5 minutes (300 seconds) for a successful day
        const MIN_PLAY_TIME = 300;

        if (todayPlayTimeSeconds >= MIN_PLAY_TIME) {
          let newStreakDays = streakDays;

          if (lastPlayDate === yesterday) {
            // Consecutive day - increment streak
            newStreakDays = streakDays + 1;
          } else if (lastPlayDate !== today) {
            // Missed a day or first day - reset to 1
            newStreakDays = 1;
          }
          // If lastPlayDate === today, don't change streak (already counted today)

          const earnedIceCream = newStreakDays >= streakGoal;

          set({
            streakDays: newStreakDays,
            lastPlayDate: today,
            iceCreamEarned: earnedIceCream || get().iceCreamEarned,
          });

          get().syncToCloud();
        }
      },

      redeemIceCream: () => {
        set({
          iceCreamRedeemed: true,
          streakDays: 0,
          iceCreamEarned: false,
        });
        get().syncToCloud();
      },

      initializePlayer: async () => {
        const state = get();
        if (state.playerId) return;

        try {
          const { data: existing } = await supabase
            .from('player_profiles')
            .select('*')
            .eq('player_name', 'Yaya')
            .single();

          if (existing) {
            set({ playerId: existing.id });
            await get().loadFromCloud();
          } else {
            const { data: newPlayer } = await supabase
              .from('player_profiles')
              .insert({ player_name: 'Yaya' })
              .select()
              .single();

            if (newPlayer) {
              set({ playerId: newPlayer.id });
            }
          }
        } catch (error) {
          console.error('Failed to initialize player:', error);
        }
      },

      syncToCloud: async () => {
        const state = get();
        if (!state.playerId || state.isSyncing) return;

        set({ isSyncing: true });

        try {
          // Sync progress for each digraph
          for (const [digraphId, data] of Object.entries(state.progress)) {
            await supabase.from('player_progress').upsert(
              {
                player_id: state.playerId,
                digraph_id: digraphId,
                explored: data.explored,
                practice_correct: data.practiceCorrect,
                practice_attempts: data.practiceAttempts,
                mastered: data.mastered,
                has_seen_intro: data.hasSeenIntro,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'player_id,digraph_id',
              }
            );
          }

          // Sync rewards including streak data
          await supabase.from('player_rewards').upsert(
            {
              player_id: state.playerId,
              stars: state.stars,
              stickers: state.stickers,
              rainbow_stripes: state.rainbowStripes,
              streak_days: state.streakDays,
              last_play_date: state.lastPlayDate,
              ice_cream_earned: state.iceCreamEarned,
              ice_cream_redeemed: state.iceCreamRedeemed,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'player_id',
            }
          );

          set({ lastSyncedAt: new Date().toISOString() });
        } catch (error) {
          console.error('Failed to sync to cloud:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      loadFromCloud: async () => {
        const state = get();
        if (!state.playerId) return;

        try {
          const { data: progressData } = await supabase
            .from('player_progress')
            .select('*')
            .eq('player_id', state.playerId);

          if (progressData && progressData.length > 0) {
            const progress = { ...initialProgress };
            for (const row of progressData) {
              progress[row.digraph_id] = {
                explored: row.explored,
                practiceCorrect: row.practice_correct,
                practiceAttempts: row.practice_attempts,
                mastered: row.mastered,
                hasSeenIntro: row.has_seen_intro ?? row.explored,
              };
            }
            set({ progress });
          }

          const { data: rewardsData } = await supabase
            .from('player_rewards')
            .select('*')
            .eq('player_id', state.playerId)
            .single();

          if (rewardsData) {
            set({
              stars: rewardsData.stars,
              stickers: rewardsData.stickers || [],
              rainbowStripes: rewardsData.rainbow_stripes,
              streakDays: rewardsData.streak_days || 0,
              lastPlayDate: rewardsData.last_play_date || null,
              iceCreamEarned: rewardsData.ice_cream_earned || false,
              iceCreamRedeemed: rewardsData.ice_cream_redeemed || false,
            });
          }
        } catch (error) {
          console.error('Failed to load from cloud:', error);
        }
      },
    }),
    {
      name: 'yaya-phonics-game',
    }
  )
);
