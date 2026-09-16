import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Standard section shell.
 *
 * `band="invert"` flips the whole token set to the opposite of the active
 * theme, so the rhythm of the page survives either theme: the project gallery
 * is light on the dark theme and dark on the light theme.
 */
export function Section({
  id,
  children,
  className,
  band = 'default',
  label,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  band?: 'default' | 'invert';
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      data-band={band === 'invert' ? 'invert' : undefined}
      className={cn('relative bg-canvas', className)}
    >
      {children}
    </section>
  );
}
