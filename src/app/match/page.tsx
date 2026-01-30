'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LetterDisplay } from '@/components/LetterDisplay';
import { PictureCard } from '@/components/PictureCard';
import { PlayTimer } from '@/components/PlayTimer';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { digraphs, getAllWords, Digraph, DigraphWord } from '@/data/digraphs';
import { useGameStore } from '@/stores/gameStore';
import { useReward } from 'react-rewards';

interface GameRound {
  digraph: Digraph;
  correctWord: DigraphWord;
  options: DigraphWord[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateRound(): GameRound {
  const digraph = digraphs[Math.floor(Math.random() * digraphs.length)];
  const words = getAllWords(digraph);
  const correctWord = words[Math.floor(Math.random() * words.length)];

  // Get distractor words from other digraphs
  const otherDigraphs = digraphs.filter(d => d.id !== digraph.id);
  const distractors: DigraphWord[] = [];

  while (distractors.length < 2) {
    const randomDigraph = otherDigraphs[Math.floor(Math.random() * otherDigraphs.length)];
    const randomWords = getAllWords(randomDigraph);
    const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
    if (!distractors.find(d => d.word === randomWord.word) && randomWord.word !== correctWord.word) {
      distractors.push(randomWord);
    }
  }

  return {
    digraph,
    correctWord,
    options: shuffleArray([correctWord, ...distractors]),
  };
}

export default function MatchPage() {
  const [round, setRound] = useState<GameRound | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);

  // Track session time
  useSessionTimer();

  const { speak, speakDigraph, speakSound } = useSpeechSynthesis();
  const { recordPracticeAttempt, addSticker } = useGameStore();
  const { reward: confettiReward, isAnimating } = useReward('confetti-reward', 'confetti', {
    elementCount: 100,
    spread: 90,
    colors: ['#FF69B4', '#9B59B6', '#3498DB', '#F1C40F', '#2ECC71'],
  });

  const startNewRound = useCallback(() => {
    setRound(generateRound());
    setSelected(null);
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  useEffect(() => {
    if (round && isCorrect === null) {
      // Announce the digraph at the start of each round
      setTimeout(() => {
        speakSound(round.digraph.audioText);
      }, 500);
    }
  }, [round, isCorrect, speakSound]);

  const handleSelect = (word: DigraphWord) => {
    if (selected || !round) return;

    setSelected(word.word);
    const correct = word.word === round.correctWord.word;
    setIsCorrect(correct);

    if (correct) {
      confettiReward();
      speak('Amazing! Great job!');
      setScore(score + 1);
      recordPracticeAttempt(round.digraph.id, true);

      // Award sticker every 3 correct answers
      if ((score + 1) % 3 === 0) {
        const stickers = ['🦕', '🐘', '🦋', '🐄', '🐒', '🐞', '🐕', '🐈', '🦈', '🐋'];
        addSticker(stickers[Math.floor(Math.random() * stickers.length)]);
      }
    } else {
      speak(`Let's try again! Listen for the sound.`);
      setTimeout(() => speakSound(round.digraph.audioText), 1500);
      recordPracticeAttempt(round.digraph.id, false);
    }

    // Move to next round after delay
    setTimeout(() => {
      setRoundCount(roundCount + 1);
      startNewRound();
    }, correct ? 2000 : 2500);
  };

  if (!round) return null;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center gap-6">
      {/* Confetti anchor */}
      <span id="confetti-reward" className="fixed top-1/2 left-1/2" />

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
        <h1 className="text-2xl font-bold text-[#9B59B6]">Picture Match</h1>
        <div className="flex items-center gap-3">
          <PlayTimer />
          <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2">
            <span className="text-xl">⭐</span>
            <span className="text-xl font-bold text-[#F1C40F]">{score}</span>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.p
        className="text-lg text-gray-600 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Find the picture that starts or ends with...
      </motion.p>

      {/* Digraph Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={round.digraph.id + roundCount}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          <LetterDisplay
            letters={round.digraph.letters}
            color={round.digraph.color}
            size="large"
            onClick={() => speakSound(round.digraph.audioText)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Sound Hint Button */}
      <motion.button
        className="bg-white/80 rounded-full px-6 py-3 shadow-lg flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => speakSound(round.digraph.audioText)}
      >
        <span className="text-2xl">🔊</span>
        <span className="font-bold" style={{ color: round.digraph.color }}>
          Hear the sound
        </span>
      </motion.button>

      {/* Picture Options */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <AnimatePresence mode="wait">
          {round.options.map((option, index) => (
            <motion.div
              key={option.word + roundCount}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PictureCard
                word={option.word}
                image={option.image}
                color={round.digraph.color}
                onClick={() => handleSelect(option)}
                isSelected={selected === option.word}
                isCorrect={
                  selected === option.word
                    ? option.word === round.correctWord.word
                    : selected && option.word === round.correctWord.word
                    ? true
                    : null
                }
                disabled={selected !== null}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div
              className={`
                text-8xl p-8 rounded-full
                ${isCorrect ? 'bg-green-100' : 'bg-red-100'}
              `}
            >
              {isCorrect ? '🎉' : '💪'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <motion.div
        className="mt-auto flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: i < roundCount ? '#2ECC71' : '#E0E0E0',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
