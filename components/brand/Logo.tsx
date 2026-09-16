import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * The supplied emblem, used as-is.
 *
 * public/logo/electricore-mark.webp is a sized copy of
 * public/logo/electricore-logo.png produced by scripts/build-brand-assets.mjs.
 *
 * The artwork carries its own deep navy ground, which is also the page canvas,
 * so on the dark theme it sits flush with no plate. `logo-plate` restores that
 * ground on the light theme. See DESIGN.md.
 *
 * The wordmark next to the emblem is typeset in the site's own display face at
 * every size where the emblem's internal lettering would be too small to read.
 */

const MARK_SIZES = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-40 w-40 sm:h-52 sm:w-52',
} as const;

export function Logo({
  size = 'sm',
  variant = 'lockup',
  className,
  priority = false,
}: {
  size?: keyof typeof MARK_SIZES;
  /** `lockup` pairs the emblem with the typeset name; `mark` is the emblem alone. */
  variant?: 'lockup' | 'mark';
  className?: string;
  priority?: boolean;
}) {
  const mark = (
    <span
      className={cn(
        'logo-plate inline-flex shrink-0 items-center justify-center rounded-[6px]',
        variant === 'mark' && 'p-2',
      )}
    >
      <Image
        src="/logo/electricore-mark.webp"
        alt={variant === 'mark' ? 'ElectriCore LLC' : ''}
        width={384}
        height={382}
        priority={priority}
        className={cn('rounded-[4px] object-contain', MARK_SIZES[size])}
      />
    </span>
  );

  if (variant === 'mark') {
    return <span className={cn('inline-flex', className)}>{mark}</span>;
  }

  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      {mark}
      <span className="flex items-baseline gap-1.5">
        <span
          className={cn(
            'display tracking-[-0.03em] text-ink',
            size === 'lg' ? 'text-[2rem]' : 'text-[1.35rem] md:text-[1.5rem]',
          )}
        >
          Electri<span className="text-blue">Core</span>
        </span>
        <span className="label pb-0.5 text-[0.5625rem] text-ink-3">L.L.C</span>
      </span>
    </span>
  );
}
