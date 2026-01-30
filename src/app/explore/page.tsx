'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LetterDisplay } from '@/components/LetterDisplay';
import { SoundButton } from '@/components/SoundButton';
import { PictureCard } from '@/components/PictureCard';
import { PlayTimer } from '@/components/PlayTimer';
import { DigraphIntroduction } from '@/components/DigraphIntroduction';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { digraphs, getAllWords } from '@/data/digraphs';
import { useGameStore } from '@/stores/gameStore';

export default function ExplorePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const { speak, speakDigraph, speaking } = useSpeechSynthesis();
  const { markDigraphExplored, addStars, progress, markIntroSeen } = useGameStore();

  // Track session time
  useSessionTimer();

  const currentDigraph = digraphs[currentIndex];
  const allWords = getAllWords(currentDigraph);
  const isExplored = progress[currentDigraph.id]?.explored;
  const hasSeenIntro = progress[currentDigraph.id]?.hasSeenIntro;

  // Show intro for new digraphs
  const shouldShowIntro = !hasSeenIntro && !showIntro;

  const handleSoundClick = () => {
    speakDigraph(currentDigraph.audioText, currentDigraph.examplePhrase);
  };

  const handleWordClick = (word: string) => {
    speak(word);
  };

  const handleNext = () => {
    if (!isExplored) {
      markDigraphExplored(currentDigraph.id);
      addStars(1);
    }
    if (currentIndex < digraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTeachingTip = () => {
    speak(`${currentDigraph.teachingTip} ${currentDigraph.mouthPosition}`);
  };

  const handleIntroComplete = () => {
    markIntroSeen(currentDigraph.id);
    setShowIntro(false);
  };

  // Show introduction for new digraphs
  if (shouldShowIntro) {
    return (
      <DigraphIntroduction
        digraph={currentDigraph}
        onComplete={handleIntroComplete}
      />
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center gap-6">
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
        <h1 className="text-2xl font-bold text-[#FF69B4]">Sound Explorer</h1>
        <PlayTimer />
        <div className="flex gap-1">
          {digraphs.map((d, i) => (
            <motion.div
              key={d.id}
              className="w-3 h-3 rounded-full cursor-pointer"
              style={{
                backgroundColor: i === currentIndex ? d.color : '#E0E0E0',
              }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDigraph.id}
          className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-lg"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Letter Display */}
          <LetterDisplay
            letters={currentDigraph.letters}
            color={currentDigraph.color}
            size="xlarge"
            onClick={handleSoundClick}
          />

          {/* Sound Button */}
          <SoundButton
            onClick={handleSoundClick}
            speaking={speaking}
            color={currentDigraph.color}
          />

          {/* Teaching Tip */}
          <motion.button
            className="bg-white/80 rounded-2xl px-6 py-3 shadow-lg text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTeachingTip}
          >
            <p className="text-lg font-bold" style={{ color: currentDigraph.color }}>
              {currentDigraph.teachingTip}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {currentDigraph.mouthPosition}
            </p>
          </motion.button>

          {/* Yaya's Special Word */}
          <motion.div
            className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl px-6 py-3 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <p className="text-sm text-purple-600">Yaya&apos;s special word:</p>
            <motion.p
              className="text-2xl font-bold text-[#FF69B4] cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => speak(currentDigraph.yayaSpecial.split(' ')[0])}
            >
              {currentDigraph.yayaSpecial}
            </motion.p>
          </motion.div>

          {/* Word Examples */}
          <div className="w-full">
            <p className="text-center text-gray-600 mb-3">Tap a picture to hear the word!</p>
            <div className="flex flex-wrap justify-center gap-3">
              {allWords.slice(0, 4).map((wordData) => (
                <PictureCard
                  key={wordData.word}
                  word={wordData.word}
                  image={wordData.image}
                  color={currentDigraph.color}
                  onClick={() => handleWordClick(wordData.word)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        className="flex gap-8 items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.button
          className="text-5xl disabled:opacity-30"
          whileHover={{ scale: 1.2, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ⬅️
        </motion.button>

        <motion.button
          className="px-8 py-4 rounded-full text-white font-bold text-xl shadow-lg"
          style={{ backgroundColor: currentDigraph.color }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
        >
          {currentIndex === digraphs.length - 1 ? 'Done! 🎉' : 'Next Sound ➡️'}
        </motion.button>

        <motion.button
          className="text-5xl disabled:opacity-30"
          whileHover={{ scale: 1.2, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          disabled={currentIndex === digraphs.length - 1}
        >
          ➡️
        </motion.button>
      </motion.div>

      {/* Explored Badge */}
      {isExplored && (
        <motion.div
          className="absolute top-20 right-4 bg-green-400 text-white px-4 py-2 rounded-full font-bold"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
        >
          ✓ Explored!
        </motion.div>
      )}
    </div>
  );
}
