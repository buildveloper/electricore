import { cn } from '@/lib/cn';

/**
 * A tiled circuit board texture. Drawn as an SVG pattern so it is one element
 * and costs nothing to animate: the backdrop wrapper moves the whole layer.
 *
 * `id` must be unique per instance on a page because SVG pattern ids share one
 * document namespace.
 */

const VARIANTS = {
  1: [
    'M0 40 H60 V96 H132 V180',
    'M180 24 H120 V70 H96 V180',
    'M30 180 V140 H96 V96',
    'M0 150 H44 V180',
  ],
  2: [
    'M0 30 H96 V84 H180',
    'M180 120 H132 V60 H84',
    'M60 180 V132 H12 V96',
    'M180 180 H150 V140',
  ],
} as const;

const NODES = {
  1: [
    [60, 40],
    [132, 96],
    [96, 70],
    [96, 140],
  ],
  2: [
    [96, 30],
    [132, 120],
    [84, 60],
    [60, 132],
  ],
} as const;

export function CircuitPattern({
  id,
  variant = 1,
  className,
}: {
  id: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const size = 180;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn('h-full w-full', className)}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth={1} fill="none">
            {VARIANTS[variant].map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g fill="currentColor">
            {NODES[variant].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.2} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
