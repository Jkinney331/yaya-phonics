'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export function CloudSyncProvider({ children }: { children: React.ReactNode }) {
  const initializePlayer = useGameStore((state) => state.initializePlayer);

  useEffect(() => {
    // Initialize player and sync on app load
    initializePlayer();
  }, [initializePlayer]);

  return <>{children}</>;
}
