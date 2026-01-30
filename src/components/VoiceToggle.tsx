'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

export function VoiceToggle() {
  const { isMuted, toggleMuted } = useGameStore();

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 bg-white/90 shadow-lg rounded-full px-4 py-3 flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleMuted}
      aria-pressed={isMuted}
      aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
    >
      <span className="text-2xl" role="img" aria-hidden="true">
        {isMuted ? '🔇' : '🔊'}
      </span>
      <span className="text-sm font-bold text-gray-700">
        {isMuted ? 'Voice Off' : 'Voice On'}
      </span>
    </motion.button>
  );
}
