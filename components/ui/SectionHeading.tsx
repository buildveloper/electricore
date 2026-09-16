import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Section header in the "wire label" voice: a number, a mono eyebrow, then the
 * claim. Used by every section so the page reads in one consistent system.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  className,
  as: Tag = 'h2',
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  as?: 'h2' | 'h3';
}) {
  return (
    <header className={cn('max-w-2xl', className)}>
      <p className="label flex items-center gap-2.5 text-ink-3">
        <span aria-hidden="true" className="h-1.5 w-1.5 bg-copper" />
        <span className="text-blue">{index}</span>
        <span aria-hidden="true" className="h-px w-6 bg-rule-strong" />
        {eyebrow}
      </p>
      <Tag className="display mt-5 text-[clamp(1.75rem,4.6vw,2.75rem)] text-ink">
        {title}
      </Tag>
      {lede ? <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-2">{lede}</p> : null}
    </header>
  );
}
