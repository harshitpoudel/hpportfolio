import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface NetflixIntroProps {
  onComplete: () => void;
}

export function NetflixIntro({ onComplete }: NetflixIntroProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const name = "HARSHIT POUDEL";
  const letters = name.split("");

  useEffect(() => {
    if (animationComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animationComplete, onComplete]);

  // Different starting positions for each letter
  const getRandomPosition = (index: number) => {
    const positions = [
      { x: -200, y: -200 },
      { x: 200, y: -200 },
      { x: -200, y: 200 },
      { x: 200, y: 200 },
      { x: -300, y: 0 },
      { x: 300, y: 0 },
      { x: 0, y: -300 },
      { x: 0, y: 300 },
    ];
    return positions[index % positions.length];
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: animationComplete ? 0 : 1 }}
      transition={{ duration: 0.5, delay: animationComplete ? 0 : 0 }}
    >
      <div className="relative">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 px-4">
          {letters.map((letter, index) => {
            const pos = getRandomPosition(index);
            return (
              <motion.span
                key={`${letter}-${index}`}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-black"
                initial={{
                  x: pos.x,
                  y: pos.y,
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 360 - 180,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.05,
                  duration: 0.8,
                }}
                onAnimationComplete={() => {
                  if (index === letters.length - 1) {
                    setTimeout(() => setAnimationComplete(true), 800);
                  }
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}