'use client';

import { motion } from 'framer-motion';

interface SplitHeadingProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  delay?: number;
  highlightWord?: string;
}

export default function SplitHeading({
  children,
  className = '',
  as = 'h2',
  delay = 0.1,
  highlightWord,
}: SplitHeadingProps) {
  const words = children.split(' ');
  const Tag = as as any;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      rotateX: -45,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Tag className={`overflow-hidden font-display ${className}`}>
      <motion.span
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-1"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {words.map((word, i) => {
          const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
          return (
            <span key={i} className="inline-block overflow-hidden py-1">
              <motion.span
                variants={wordVariants}
                className={`inline-block origin-bottom ${
                  isHighlight ? 'text-lime text-glow-lime' : ''
                }`}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
