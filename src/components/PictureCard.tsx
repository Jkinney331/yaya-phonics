'use client';

import { motion } from 'framer-motion';

interface PictureCardProps {
  word: string;
  image: string;
  color?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isCorrect?: boolean | null;
  disabled?: boolean;
}

export const PictureCard = ({
  word,
  image,
  color = '#FF69B4',
  onClick,
  isSelected = false,
  isCorrect = null,
  disabled = false,
}: PictureCardProps) => {
  const getBorderColor = () => {
    if (isCorrect === true) return '#2ECC71'; // Green
    if (isCorrect === false) return '#E74C3C'; // Red
    if (isSelected) return color;
    return 'white';
  };

  const getBgColor = () => {
    if (isCorrect === true) return '#D5F5E3';
    if (isCorrect === false) return '#FADBD8';
    return 'white';
  };

  return (
    <motion.button
      className={`
        p-4 rounded-3xl
        flex flex-col items-center justify-center gap-2
        min-w-[120px] min-h-[140px]
        shadow-lg
        border-4
        touch-target
        focus:outline-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        backgroundColor: getBgColor(),
        borderColor: getBorderColor(),
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={disabled ? {} : { scale: 1.05, y: -5 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <motion.span
        className="text-6xl"
        animate={
          isCorrect === true
            ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
            : isCorrect === false
            ? { x: [-5, 5, -5, 5, 0] }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        {image}
      </motion.span>
      <span
        className="text-xl font-bold"
        style={{ color: color }}
      >
        {word}
      </span>
    </motion.button>
  );
};
