'use client';

import { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const DivineLight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x,
        y,
      }}
      className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none z-40 mix-blend-screen"
    >
      <div className="w-full h-full rounded-full bg-gradient-radial from-orange-500/20 via-orange-500/5 to-transparent blur-3xl" />
    </motion.div>
  );
};
