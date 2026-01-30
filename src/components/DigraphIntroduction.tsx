'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Digraph } from '@/data/digraphs';

interface Props {
  digraph: Digraph;
  onComplete: () => void;
}

type IntroStep = 'letter1' | 'letter2' | 'together' | 'practice';

export function DigraphIntroduction({ digraph, onComplete }: Props) {
  const [step, setStep] = useState<IntroStep>('letter1');
  const [isPlaying, setIsPlaying] = useState(false);
  const { speak, speaking } = useSpeechSynthesis();

  const letter1 = digraph.letters[0];
  const letter2 = digraph.letters[1];

  const handleNext = async () => {
    if (isPlaying || speaking) return;
    setIsPlaying(true);

    switch (step) {
      case 'letter1':
        await speak(digraph.introAudio.letter1);
        setTimeout(() => {
          setStep('letter2');
          setIsPlaying(false);
        }, 500);
        break;
      case 'letter2':
        await speak(digraph.introAudio.letter2);
        setTimeout(() => {
          setStep('together');
          setIsPlaying(false);
        }, 500);
        break;
      case 'together':
        await speak(digraph.introAudio.together);
        setTimeout(() => {
          setStep('practice');
          setIsPlaying(false);
        }, 500);
        break;
      case 'practice':
        onComplete();
        break;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-b from-pink-100 to-purple-100 flex flex-col items-center justify-center p-8 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {step === 'letter1' && (
          <motion.div
            key="letter1"
            className="text-center"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            <p className="text-2xl text-gray-700 mb-4">Meet the letter...</p>
            <motion.div
              className="text-[150px] font-bold text-pink-500 mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {letter1}
            </motion.div>
          </motion.div>
        )}

        {step === 'letter2' && (
          <motion.div
            key="letter2"
            className="text-center"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            <p className="text-2xl text-gray-700 mb-4">And this letter...</p>
            <motion.div
              className="text-[150px] font-bold text-purple-500 mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {letter2}
            </motion.div>
          </motion.div>
        )}

        {step === 'together' && (
          <motion.div
            key="together"
            className="text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
          >
            <p className="text-2xl text-gray-700 mb-4">
              But when they&apos;re TOGETHER...
            </p>
            <motion.div
              className="text-[150px] font-bold mb-4"
              style={{
                background: `linear-gradient(to right, ${digraph.color}, #9B59B6)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {digraph.letters}
            </motion.div>
            <p className="text-3xl font-bold text-pink-500">
              They make a NEW sound!
            </p>
          </motion.div>
        )}

        {step === 'practice' && (
          <motion.div
            key="practice"
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <motion.div
              className="text-[120px] font-bold mb-4"
              style={{ color: digraph.color }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              {digraph.letters}
            </motion.div>
            <p className="text-2xl text-gray-700 mb-4">Now YOU say it!</p>
            <p className="text-xl text-purple-500 mb-4">{digraph.teachingTip}</p>
            <p className="text-lg text-gray-600">{digraph.mouthPosition}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white
                   px-10 py-5 rounded-full text-2xl font-bold shadow-lg
                   disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        disabled={isPlaying || speaking}
      >
        {step === 'practice' ? 'I Said It! ✨' : 'Next →'}
      </motion.button>

      {/* Skip button for returning users */}
      <motion.button
        className="mt-4 text-gray-500 underline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={onComplete}
      >
        Skip intro
      </motion.button>
    </motion.div>
  );
}
