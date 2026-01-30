'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameModeCardProps {
  title: string;
  description: string;
  emoji: string;
  href: string;
  color: string;
  delay?: number;
}

export const GameModeCard = ({
  title,
  description,
  emoji,
  href,
  color,
  delay = 0,
}: GameModeCardProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
    >
      <Link href={href}>
        <motion.div
          className="
            p-6 rounded-3xl
            flex flex-col items-center justify-center gap-3
            min-h-[180px] w-full
            shadow-xl
            border-4 border-white
            cursor-pointer
            touch-target
          "
          style={{
            backgroundColor: color,
          }}
          whileHover={{ scale: 1.05, y: -10, rotate: [-1, 1, -1, 0] }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-6xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emoji}
          </motion.span>
          <h2 className="text-2xl font-bold text-white drop-shadow-md">
            {title}
          </h2>
          <p className="text-white/90 text-center text-sm">
            {description}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
};
