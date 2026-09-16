import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Credential badge styled as an equipment nameplate: hairline box, wire-label
 * type, no pill shapes or drop shadows.
 */
export function Badge({
  icon,
  children,
  className,
}: {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 rounded-plate border border-rule-strong bg-surface/60 px-3 py-2',
        className,
      )}
    >
      {icon ? <span className="text-blue">{icon}</span> : null}
      <span className="label text-ink-2">{children}</span>
    </span>
  );
}
