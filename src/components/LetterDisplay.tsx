'use client';

import { motion } from 'framer-motion';

interface LetterDisplayProps {
  letters: string;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animate?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  small: 'text-4xl',
  medium: 'text-6xl',
  large: 'text-8xl',
  xlarge: 'text-9xl',
};

export const LetterDisplay = ({
  letters,
  color = '#FF69B4',
  size = 'large',
  animate = true,
  onClick,
}: LetterDisplayProps) => {
  return (
    <motion.div
      className={`
        ${sizeClasses[size]}
        font-bold
        cursor-pointer
        select-none
        drop-shadow-lg
        touch-target
        flex items-center justify-center
      `}
      style={{
        color: color,
        textShadow: `3px 3px 0px ${color}40, 6px 6px 0px ${color}20`,
        WebkitTextStroke: `2px ${color}80`,
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: animate ? [0, -10, 0] : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {letters.split('').map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};
