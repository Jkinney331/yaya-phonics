'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

export function StreakDisplay() {
  const { streakDays, streakGoal, iceCreamEarned, iceCreamRedeemed } = useGameStore();

  const daysUntilIceCream = Math.max(0, streakGoal - streakDays);

  return (
    <motion.div
      className="bg-white/90 rounded-2xl p-4 shadow-lg"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* Streak Counter */}
      <div className="flex items-center gap-3 mb-3">
        <motion.span
          className="text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          🔥
        </motion.span>
        <div>
          <p className="text-2xl font-bold text-pink-500">
            {streakDays} Day{streakDays !== 1 ? 's' : ''} Streak!
          </p>
          <p className="text-sm text-gray-600">Play 5 minutes every day</p>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-3">
        {Array.from({ length: streakGoal }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
              ${i < streakDays ? 'bg-pink-500' : 'bg-gray-200'}`}
            initial={i < streakDays ? { scale: 0 } : {}}
            animate={i < streakDays ? { scale: 1 } : {}}
            transition={{ delay: i * 0.1 }}
          >
            {i < streakDays ? '⭐' : '○'}
          </motion.div>
        ))}
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
            ${iceCreamEarned ? 'bg-yellow-300' : 'bg-gray-100'}`}
          animate={
            iceCreamEarned ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}
          }
          transition={{ repeat: iceCreamEarned ? Infinity : 0, duration: 1 }}
        >
          🍦
        </motion.div>
      </div>

      {/* Status Message */}
      {iceCreamEarned && !iceCreamRedeemed ? (
        <motion.div
          className="text-center p-3 bg-yellow-100 rounded-xl"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <p className="text-xl font-bold text-yellow-700">🎉 ICE CREAM TIME! 🍦</p>
          <p className="text-sm text-yellow-600">You did it! 5 days in a row!</p>
        </motion.div>
      ) : (
        <p className="text-center text-gray-600">
          {daysUntilIceCream === 1
            ? '🎯 Just 1 more day until ice cream!'
            : `${daysUntilIceCream} more days until ice cream!`}
        </p>
      )}
    </motion.div>
  );
}
