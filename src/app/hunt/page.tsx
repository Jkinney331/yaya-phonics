'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SoundButton } from '@/components/SoundButton';
import { PlayTimer } from '@/components/PlayTimer';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { digraphs, Digraph } from '@/data/digraphs';
import { useGameStore } from '@/stores/gameStore';
import { useReward } from 'react-rewards';

interface HuntRound {
  targetDigraph: Digraph;
  options: Digraph[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateHuntRound(optionCount: number = 3): HuntRound {
  const shuffled = shuffleArray(digraphs);
  const targetDigraph = shuffled[0];
  const options = shuffleArray(shuffled.slice(0, optionCount));

  return { targetDigraph, options };
}

export default function HuntPage() {
  const [round, setRound] = useState<HuntRound | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(2); // Start with 2 options

  // Track session time
  useSessionTimer();

  const { speak, speakSound, speaking } = useSpeechSynthesis();
  const { recordPracticeAttempt, addSticker, addRainbowStripe } = useGameStore();
  const { reward: confettiReward } = useReward('hunt-confetti', 'confetti', {
    elementCount: 80,
    spread: 70,
    colors: ['#FF69B4', '#9B59B6', '#3498DB', '#F1C40F'],
  });

  const startNewRound = useCallback(() => {
    const optionCount = Math.min(difficulty, 5);
    setRound(generateHuntRound(optionCount));
    setSelected(null);
    setIsCorrect(null);
  }, [difficulty]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const playSound = useCallback(() => {
    if (round) {
      speakSound(round.targetDigraph.audioText);
    }
  }, [round, speakSound]);

  useEffect(() => {
    if (round && isCorrect === null) {
      setTimeout(playSound, 800);
    }
  }, [round, isCorrect, playSound]);

  const handleSelect = (digraph: Digraph) => {
    if (selected || !round) return;

    setSelected(digraph.id);
    const correct = digraph.id === round.targetDigraph.id;
    setIsCorrect(correct);

    if (correct) {
      confettiReward();
      // Say the sound instead of spelling the letters
      speak(`Yes! You found the ${round.targetDigraph.letters} sound!`);
      setScore(score + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      recordPracticeAttempt(round.targetDigraph.id, true);

      // Increase difficulty after 3 correct in a row
      if (newStreak % 3 === 0 && difficulty < 5) {
        setDifficulty(difficulty + 1);
        setTimeout(() => speak('Level up!'), 1000);
      }

      // Award rainbow stripe every 5 correct
      if ((score + 1) % 5 === 0) {
        addRainbowStripe();
      }

      // Award sticker every 4 correct
      if ((score + 1) % 4 === 0) {
        const stickers = ['🦕', '🐘', '🦋', '🐄', '🐒', '🐞', '🐕', '🐈'];
        addSticker(stickers[Math.floor(Math.random() * stickers.length)]);
      }
    } else {
      // Say what they clicked was wrong, then play the correct sound
      speak(
        `That was the ${digraph.letters} sound. Listen for the ${round.targetDigraph.letters} sound!`
      );
      // Play the actual sound of the correct digraph so they can hear it
      setTimeout(() => speak(round.targetDigraph.audioText), 1500);
      setStreak(0);
      recordPracticeAttempt(round.targetDigraph.id, false);
    }

    setTimeout(() => {
      startNewRound();
    }, correct ? 2000 : 3500);
  };

  if (!round) return null;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center gap-6">
      <span id="hunt-confetti" className="fixed top-1/2 left-1/2" />

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
        <h1 className="text-2xl font-bold text-[#3498DB]">Sound Hunt</h1>
        <div className="flex items-center gap-3">
          <PlayTimer />
          <div className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-1">
            <span>🔥</span>
            <span className="font-bold text-orange-500">{streak}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-1">
            <span>⭐</span>
            <span className="font-bold text-[#F1C40F]">{score}</span>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-lg text-gray-600">Listen to the sound...</p>
        <p className="text-xl font-bold text-[#3498DB]">Then find the letters!</p>
      </motion.div>

      {/* Sound Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      >
        <SoundButton
          onClick={playSound}
          speaking={speaking}
          size="large"
          color={round.targetDigraph.color}
        />
      </motion.div>

      <motion.p
        className="text-gray-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap to hear again
      </motion.p>

      {/* Letter Options */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        <AnimatePresence mode="wait">
          {round.options.map((digraph, index) => (
            <motion.button
              key={digraph.id + score}
              className={`
                w-28 h-28 rounded-3xl
                flex items-center justify-center
                text-5xl font-bold
                shadow-xl border-4
                ${selected === digraph.id && isCorrect === false ? 'animate-wiggle' : ''}
              `}
              style={{
                backgroundColor:
                  selected === digraph.id
                    ? isCorrect
                      ? '#D5F5E3'
                      : '#FADBD8'
                    : 'white',
                borderColor:
                  selected === digraph.id
                    ? isCorrect
                      ? '#2ECC71'
                      : '#E74C3C'
                    : selected && digraph.id === round.targetDigraph.id
                    ? '#2ECC71'
                    : digraph.color,
                color: digraph.color,
              }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={selected ? {} : { scale: 1.1, y: -5 }}
              whileTap={selected ? {} : { scale: 0.95 }}
              onClick={() => handleSelect(digraph)}
              disabled={selected !== null}
            >
              {digraph.letters}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {isCorrect ? (
              <p className="text-3xl font-bold text-green-500">🎉 Perfect!</p>
            ) : (
              <p className="text-2xl font-bold text-orange-500">
                It was {round.targetDigraph.letters}! Keep trying! 💪
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Difficulty indicator */}
      <motion.div
        className="mt-auto flex items-center gap-2 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span>Level:</span>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${i < difficulty - 1 ? '' : 'opacity-30'}`}
          >
            ⭐
          </span>
        ))}
      </motion.div>
    </div>
  );
}
