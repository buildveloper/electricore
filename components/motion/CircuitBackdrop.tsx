'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { CircuitPattern } from '@/components/motion/CircuitPattern';
import { cn } from '@/lib/cn';

/**
 * Section texture that drifts and breathes as the section passes through the
 * viewport, so long stretches of the page have depth instead of sitting flat.
 *
 * Transform and opacity only, and both are pinned to a static value when the
 * visitor asks for reduced motion.
 */
export function CircuitBackdrop({
  id,
  variant = 1,
  className,
  opacity = [0.05, 0.13, 0.05],
}: {
  id: string;
  variant?: 1 | 2;
  className?: string;
  /** Keyframe opacities at the start, middle and end of the scroll range. */
  opacity?: [number, number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-3.5%', '3.5%']);
  const fade = useTransform(scrollYProgress, [0, 0.5, 1], opacity);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <motion.div
        style={reduceMotion ? { opacity: opacity[1] } : { y, opacity: fade }}
        className="absolute -inset-[6%] text-blue"
      >
        <CircuitPattern id={id} variant={variant} />
      </motion.div>
    </div>
  );
}
