'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [canAdvance, setCanAdvance] = useState(false);
  const { speak, speaking } = useSpeechSynthesis();
  const hasPlayedRef = useRef(false);

  const letter1 = digraph.letters[0];
  const letter2 = digraph.letters[1];

  // Auto-play audio when entering each step
  useEffect(() => {
    // Prevent double-playing
    if (hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    setCanAdvance(false);

    const playStepAudio = async () => {
      let audioText = '';
      switch (step) {
        case 'letter1':
          audioText = digraph.introAudio.letter1;
          break;
        case 'letter2':
          audioText = digraph.introAudio.letter2;
          break;
        case 'together':
          audioText = digraph.introAudio.together;
          break;
        case 'practice':
          // Play the digraph sound so they know what to say
          audioText = digraph.audioText;
          break;
      }

      await speak(audioText);

      // Estimate audio duration based on text length (approx 80ms per character)
      // Then add buffer time for the audio to actually finish playing
      const estimatedDuration = Math.min(Math.max(audioText.length * 80, 2000), 5000);

      setTimeout(() => {
        setCanAdvance(true);
      }, estimatedDuration);
    };

    // Small delay before playing audio to let the visual transition complete
    const timer = setTimeout(playStepAudio, 600);
    return () => clearTimeout(timer);
  }, [step, digraph, speak]);

  const handleNext = () => {
    if (!canAdvance || speaking) return;

    // Reset for next step
    hasPlayedRef.current = false;
    setCanAdvance(false);

    switch (step) {
      case 'letter1':
        setStep('letter2');
        break;
      case 'letter2':
        setStep('together');
        break;
      case 'together':
        setStep('practice');
        break;
      case 'practice':
        await speak(digraph.audioText);
        setTimeout(() => {
          setIsPlaying(false);
          onComplete();
        }, 500);
        break;
    }
  };

  // Replay audio button handler
  const handleReplay = async () => {
    if (speaking) return;
    setCanAdvance(false);

    let audioText = '';
    switch (step) {
      case 'letter1':
        audioText = digraph.introAudio.letter1;
        break;
      case 'letter2':
        audioText = digraph.introAudio.letter2;
        break;
      case 'together':
        audioText = digraph.introAudio.together;
        break;
      case 'practice':
        audioText = digraph.audioText;
        break;
    }

    await speak(audioText);
    const estimatedDuration = Math.min(Math.max(audioText.length * 80, 2000), 5000);
    setTimeout(() => setCanAdvance(true), estimatedDuration);
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

      {/* Replay button */}
      <motion.button
        className="mt-4 text-gray-500 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReplay}
        disabled={speaking}
      >
        <span className="text-2xl">🔊</span>
        <span>Hear again</span>
      </motion.button>

      <motion.button
        className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white
                   px-10 py-5 rounded-full text-2xl font-bold shadow-lg
                   disabled:opacity-50"
        whileHover={canAdvance ? { scale: 1.05 } : {}}
        whileTap={canAdvance ? { scale: 0.95 } : {}}
        onClick={handleNext}
        disabled={!canAdvance || speaking}
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
