'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

export function PlayTimer() {
  const { sessionStartTime, todayPlayTimeSeconds, checkAndUpdateStreak } = useGameStore();
  const [currentTime, setCurrentTime] = useState(todayPlayTimeSeconds);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionStartTime) {
        const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
        setCurrentTime(todayPlayTimeSeconds + sessionTime);
      } else {
        setCurrentTime(todayPlayTimeSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, todayPlayTimeSeconds]);

  useEffect(() => {
    if (currentTime >= 300) {
      checkAndUpdateStreak();
    }
  }, [currentTime, checkAndUpdateStreak]);

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  const goalReached = currentTime >= 300; // 5 minutes
  const progressPercent = Math.min(100, (currentTime / 300) * 100);

  return (
    <motion.div
      className="bg-white/90 rounded-2xl p-3 shadow-md min-w-[140px]"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Timer Display */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl">⏱️</span>
        <span
          className={`text-2xl font-bold ${goalReached ? 'text-green-500' : 'text-pink-500'}`}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        {goalReached && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl">
            ✅
          </motion.span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${goalReached ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Goal Text */}
      <p className="text-xs text-center text-gray-500 mt-1">
        {goalReached
          ? '🌟 Great job today!'
          : `${Math.ceil((300 - currentTime) / 60)} min to daily goal`}
      </p>
    </motion.div>
  );
}
