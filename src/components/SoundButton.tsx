'use client';

import { motion } from 'framer-motion';

interface SoundButtonProps {
  onClick: () => void;
  speaking?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const sizeClasses = {
  small: 'w-16 h-16 text-2xl',
  medium: 'w-24 h-24 text-4xl',
  large: 'w-32 h-32 text-5xl',
};

export const SoundButton = ({
  onClick,
  speaking = false,
  size = 'large',
  color = '#FF69B4',
}: SoundButtonProps) => {
  return (
    <motion.button
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        shadow-xl
        border-4 border-white
        touch-target
        focus:outline-none focus:ring-4 focus:ring-pink-200
      `}
      style={{
        backgroundColor: color,
        boxShadow: `0 8px 0 ${color}80, 0 12px 20px rgba(0,0,0,0.2)`,
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95, y: 0, boxShadow: `0 2px 0 ${color}80` }}
      animate={
        speaking
          ? {
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0],
            }
          : {}
      }
      transition={
        speaking
          ? {
              duration: 0.5,
              repeat: Infinity,
            }
          : {
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }
      }
      onClick={onClick}
      aria-label="Play sound"
    >
      <span role="img" aria-label="speaker">
        {speaking ? '🔊' : '🔈'}
      </span>
    </motion.button>
  );
};
