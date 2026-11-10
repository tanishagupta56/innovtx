'use client';

import { motion } from 'framer-motion';

interface MarqueeProps {
  items?: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  bordered?: boolean;
}

const defaultItems = [
  'TECHNEEDS IGDTUW',
  'INNOVORTEX HACKATHON',
  'ENGINEERING PROFICIENCY',
  'OPEN INNOVATION',
  'SYSTEMS & WEB3',
  'WOMEN IN TECH',
  'BUILDING THE FUTURE',
];

export default function InfiniteMarquee({
  items = defaultItems,
  speed = 28,
  reverse = false,
  className = '',
  bordered = true,
}: MarqueeProps) {
  return (
    <div
      className={`relative w-full overflow-hidden select-none py-4 ${
        bordered ? 'border-y border-cobalt/20 bg-[#020409]' : ''
      } ${className}`}
    >
      {/* Edge gradient masks */}
      <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-midnight to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-midnight to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap gap-8 items-center"
        animate={{
          x: reverse ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {/* Double the list to ensure gapless loop */}
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span
              className={`font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase ${
                idx % 2 === 0
                  ? 'text-white'
                  : 'text-transparent [-webkit-text-stroke:1px_rgba(21,88,201,0.85)] hover:[-webkit-text-stroke:1px_#D4FF24] transition-all'
              }`}
            >
              {text}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-lime shadow-[0_0_10px_#D4FF24] inline-block" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
