'use client';

import { useState, useCallback, useRef } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useSpeechSynthesis = (options: UseSpeechSynthesisOptions = {}) => {
  const { rate = 0.8, pitch = 1.1, volume = 1 } = options;
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any currently playing audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  // Fallback to Web Speech API
  const fallbackSpeak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [rate, pitch, volume]
  );

  // Main speak function using ElevenLabs
  const speak = useCallback(
    async (text: string) => {
      stop(); // Stop any current audio

      try {
        setSpeaking(true);

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error(`TTS API failed: ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          // Fallback to Web Speech
          fallbackSpeak(text);
        };

        await audio.play();
      } catch (error) {
        console.error('ElevenLabs TTS error, falling back to Web Speech:', error);
        setSpeaking(false);
        fallbackSpeak(text);
      }
    },
    [stop, fallbackSpeak]
  );

  // Speak digraph with example phrase
  const speakDigraph = useCallback(
    async (digraphSound: string, examplePhrase?: string) => {
      const fullText = examplePhrase
        ? `${digraphSound}... ${examplePhrase}`
        : digraphSound;
      await speak(fullText);
    },
    [speak]
  );

  // Speak just the sound (for games)
  const speakSound = useCallback(
    async (soundText: string) => {
      await speak(soundText);
    },
    [speak]
  );

  return {
    speak,
    speakDigraph,
    speakSound,
    cancel: stop,
    speaking,
    supported: true,
  };
};
