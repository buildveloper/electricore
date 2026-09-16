'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * The one orchestrated entrance on the page: a circuit board traces itself on,
 * terminal pads land, and a copper signal runs into the core. Echoes the logo's
 * circuit-board tile and coiled copper wire.
 *
 * Everything after this is interaction-triggered only.
 */

type Trace = {
  d: string;
  tone: 'blue' | 'copper';
  width: number;
  /** Terminal pad at the end of the run. */
  pad: [number, number];
};

const CORE = { x: 620, y: 350, size: 104 };

const TRACES: Trace[] = [
  // copper feeder: enters the core from the left, like the wire in the mark
  { d: 'M120 350 H400 V480 H180 V560', tone: 'copper', width: 2.75, pad: [180, 560] },
  { d: 'M620 298 V170 H430 V56', tone: 'blue', width: 1.75, pad: [430, 56] },
  { d: 'M672 326 H800 V200 H940 V100', tone: 'blue', width: 1.75, pad: [940, 100] },
  { d: 'M672 374 H880 V470 H1000', tone: 'blue', width: 1.75, pad: [1000, 470] },
  { d: 'M620 402 V520 H440 V640', tone: 'blue', width: 1.75, pad: [440, 640] },
  { d: 'M568 300 H300 V180 H90', tone: 'blue', width: 1.75, pad: [90, 180] },
  { d: 'M568 400 H330 V600 H90', tone: 'blue', width: 1.75, pad: [90, 600] },
];

/** Waypoints the copper signal travels through, source to core. */
const SIGNAL: Array<[number, number]> = [
  [180, 560],
  [180, 480],
  [400, 480],
  [400, 350],
  [568, 350],
];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.15 },
    },
  },
};

const pad: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 20 },
  },
};

const core: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroCircuit({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <motion.g
        variants={container}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {TRACES.map((trace) => (
          <motion.path
            key={trace.d}
            d={trace.d}
            variants={draw}
            stroke={trace.tone === 'copper' ? 'var(--copper)' : 'var(--blue)'}
            strokeWidth={trace.width}
            opacity={trace.tone === 'copper' ? 0.85 : 0.5}
          />
        ))}

        {TRACES.map((trace) => (
          <motion.rect
            key={`pad-${trace.d}`}
            variants={pad}
            x={trace.pad[0] - 4}
            y={trace.pad[1] - 4}
            width={8}
            height={8}
            fill={trace.tone === 'copper' ? 'var(--copper)' : 'var(--blue)'}
            opacity={trace.tone === 'copper' ? 0.9 : 0.45}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        ))}

        {/* the core itself */}
        <motion.rect
          variants={core}
          x={CORE.x - CORE.size / 2}
          y={CORE.y - CORE.size / 2}
          width={CORE.size}
          height={CORE.size}
          rx={12}
          stroke="var(--blue)"
          strokeWidth={1.75}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <motion.rect
          variants={core}
          x={CORE.x - 20}
          y={CORE.y - 20}
          width={40}
          height={40}
          rx={6}
          fill="var(--copper)"
          stroke="none"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        {/* live signal, travelling source to core. Stops entirely on request. */}
        {reduceMotion
          ? null
          : (() => {
              const cx = SIGNAL.map(([x]) => x);
              const cy = SIGNAL.map(([, y]) => y);
              return (
                <motion.circle
                  r={4}
                  fill="var(--copper)"
                  initial={{ cx: SIGNAL[0][0], cy: SIGNAL[0][1], opacity: 0 }}
                  animate={{ cx, cy, opacity: [0, 1, 1, 1, 1, 0] }}
                  transition={{
                    duration: 2.6,
                    delay: 1.5,
                    times: [0, 0.05, 0.35, 0.55, 0.75, 1],
                    ease: 'linear',
                    repeat: Infinity,
                    repeatDelay: 2.4,
                  }}
                />
              );
            })()}
      </motion.g>
    </svg>
  );
}
