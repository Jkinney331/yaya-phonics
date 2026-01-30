'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useReward } from 'react-rewards';

export function IceCreamCelebration() {
  const { iceCreamEarned, iceCreamRedeemed, redeemIceCream } = useGameStore();
  const { reward } = useReward('iceCreamReward', 'confetti', {
    colors: ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#9B59B6'],
    elementCount: 150,
    spread: 90,
  });

  const show = iceCreamEarned && !iceCreamRedeemed;

  const handleClaim = () => {
    reward();
    setTimeout(() => redeemIceCream(), 2500);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              🍦
            </motion.div>

            <h2 className="text-3xl font-bold text-pink-500 mb-2">AMAZING JOB!</h2>

            <p className="text-xl text-gray-700 mb-4">
              You played for 5 days in a row!
            </p>

            <p className="text-2xl font-bold text-purple-500 mb-6">
              🎉 You earned ICE CREAM! 🎉
            </p>

            <span id="iceCreamReward" className="fixed top-1/2 left-1/2" />

            <motion.button
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white
                         px-8 py-4 rounded-full text-xl font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
            >
              🍦 Claim My Ice Cream! 🍦
            </motion.button>

            <p className="text-sm text-gray-500 mt-4">(Show this to Daddy!)</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
