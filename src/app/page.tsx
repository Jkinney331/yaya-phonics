'use client';

import { motion } from 'framer-motion';
import { GameModeCard } from '@/components/GameModeCard';
import { StreakDisplay } from '@/components/StreakDisplay';
import { IceCreamCelebration } from '@/components/IceCreamCelebration';
import { useGameStore } from '@/stores/gameStore';

export default function Home() {
  const { stars, rainbowStripes } = useGameStore();

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-6">
      {/* Ice Cream Celebration Modal */}
      <IceCreamCelebration />

      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-[#FF69B4] drop-shadow-lg"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Yaya&apos;s Sound Safari
        </motion.h1>
        <motion.div
          className="flex items-center justify-center gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-4xl">🦕</span>
          <span className="text-4xl">🌈</span>
          <span className="text-4xl">🐘</span>
        </motion.div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        className="flex gap-6 bg-white/80 rounded-full px-8 py-3 shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-[#F1C40F]">{stars}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 h-8 rounded-full"
              style={{
                backgroundColor:
                  i < rainbowStripes
                    ? ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'][i]
                    : '#E0E0E0',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Streak Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StreakDisplay />
      </motion.div>

      {/* Game Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        <GameModeCard
          title="Sound Explorer"
          description="Learn new sounds with Rich!"
          emoji="🔍"
          href="/explore"
          color="#FF69B4"
          delay={0.5}
        />
        <GameModeCard
          title="Picture Match"
          description="Match pictures to sounds!"
          emoji="🎯"
          href="/match"
          color="#9B59B6"
          delay={0.6}
        />
        <GameModeCard
          title="Sound Hunt"
          description="Find the letters!"
          emoji="👂"
          href="/hunt"
          color="#3498DB"
          delay={0.7}
        />
        <GameModeCard
          title="My Stickers"
          description="See your collection!"
          emoji="🦕"
          href="/rewards"
          color="#F1C40F"
          delay={0.8}
        />
      </div>

      {/* Footer */}
      <motion.p
        className="text-[#9B59B6] text-lg mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Made with 💜 for Yaya
      </motion.p>
    </div>
  );
}
