'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function useSessionTimer() {
  const { startSession, endSession } = useGameStore();

  useEffect(() => {
    // Start session when component mounts (entering a game)
    startSession();

    // End session on unmount or page close
    const handleBeforeUnload = () => endSession();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      endSession();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [startSession, endSession]);
}
