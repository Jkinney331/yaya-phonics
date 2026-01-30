'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore } from '@/stores/gameStore';
import { digraphs } from '@/data/digraphs';

const allStickers = [
  { emoji: '🦕', name: 'Dinosaur' },
  { emoji: '🐘', name: 'Elephant' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '🐄', name: 'Cow' },
  { emoji: '🐒', name: 'Monkey' },
  { emoji: '🐞', name: 'Ladybug' },
  { emoji: '🐕', name: 'Dog' },
  { emoji: '🐈', name: 'Cat' },
  { emoji: '🦈', name: 'Shark' },
  { emoji: '🐋', name: 'Whale' },
  { emoji: '🦆', name: 'Duck' },
  { emoji: '🐔', name: 'Chicken' },
];

const rainbowColors = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
];

export default function RewardsPage() {
  const { stars, stickers, rainbowStripes, progress } = useGameStore();

  const masteredCount = Object.values(progress).filter(p => p.mastered).length;
  const exploredCount = Object.values(progress).filter(p => p.explored).length;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center gap-8">
      {/* Header */}
      <motion.div
        className="w-full flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Link href="/">
          <motion.button
            className="text-4xl"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            🏠
          </motion.button>
        </Link>
        <h1 className="text-2xl font-bold text-[#F1C40F]">My Rewards</h1>
        <div className="w-12" />
      </motion.div>

      {/* Stars Counter */}
      <motion.div
        className="bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-3xl px-8 py-6 shadow-xl text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <motion.p
          className="text-6xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⭐
        </motion.p>
        <p className="text-4xl font-bold text-yellow-600 mt-2">{stars}</p>
        <p className="text-yellow-700">Stars Collected!</p>
      </motion.div>

      {/* Rainbow Progress */}
      <motion.div
        className="bg-white/80 rounded-3xl p-6 shadow-xl w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-purple-600 text-center mb-4">
          🌈 Rainbow Builder
        </h2>
        <div className="flex justify-center gap-2">
          {rainbowColors.map((color, i) => (
            <motion.div
              key={i}
              className="w-8 h-20 rounded-full"
              style={{
                backgroundColor: i < rainbowStripes ? color : '#E0E0E0',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scaleY: 1.1 }}
            />
          ))}
        </div>
        <p className="text-center text-gray-600 mt-3">
          {rainbowStripes >= 7
            ? '🎉 Rainbow Complete!'
            : `${7 - rainbowStripes} more to complete!`}
        </p>
      </motion.div>

      {/* Sticker Collection */}
      <motion.div
        className="bg-white/80 rounded-3xl p-6 shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-pink-600 text-center mb-4">
          🦕 Sticker Collection
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {allStickers.map((sticker, i) => {
            const owned = stickers.includes(sticker.emoji);
            return (
              <motion.div
                key={sticker.emoji}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center
                  ${owned ? 'bg-pink-100' : 'bg-gray-100'}
                `}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                whileHover={owned ? { scale: 1.1, rotate: [0, -5, 5, 0] } : {}}
              >
                <span className={`text-4xl ${owned ? '' : 'grayscale opacity-30'}`}>
                  {sticker.emoji}
                </span>
                {owned && (
                  <span className="text-xs text-pink-600 mt-1">{sticker.name}</span>
                )}
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-gray-600 mt-4">
          {stickers.length} / {allStickers.length} collected
        </p>
      </motion.div>

      {/* Sound Progress */}
      <motion.div
        className="bg-white/80 rounded-3xl p-6 shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-blue-600 text-center mb-4">
          📚 Sound Progress
        </h2>
        <div className="space-y-3">
          {digraphs.map((digraph) => {
            const p = progress[digraph.id];
            const percentage = p ? Math.min((p.practiceCorrect / 5) * 100, 100) : 0;

            return (
              <div key={digraph.id} className="flex items-center gap-3">
                <span
                  className="text-2xl font-bold w-12"
                  style={{ color: digraph.color }}
                >
                  {digraph.letters}
                </span>
                <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: digraph.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                </div>
                <span className="w-8 text-right">
                  {p?.mastered ? '⭐' : p?.explored ? '✓' : ''}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-gray-600 mt-4">
          {exploredCount} explored • {masteredCount} mastered
        </p>
      </motion.div>

      {/* Encouragement */}
      <motion.p
        className="text-lg text-purple-600 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {masteredCount === 5
          ? '🎉 You mastered ALL the sounds! Amazing!'
          : masteredCount > 0
          ? `Great job! Keep learning to master all ${5 - masteredCount} more sounds!`
          : 'Keep playing to earn more rewards! 💪'}
      </motion.p>
    </div>
  );
}
