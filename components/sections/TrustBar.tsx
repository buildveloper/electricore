'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BoltIcon, MapPinIcon, ShieldIcon } from '@/components/ui/icons';
import { trustBar } from '@/lib/site';
import { cn } from '@/lib/cn';

const icons = [ShieldIcon, BoltIcon, MapPinIcon];

/**
 * Credential badges. Each plate pulses once in the electric blue as the bar
 * first enters view, staggered left to right: the "electric" idea stated in
 * motion rather than decoration.
 */
export function TrustBar() {
  const [lit, setLit] = useState(false);
  const reduceMotion = useReducedMotion();
  const pulsing = lit && !reduceMotion;

  return (
    <section aria-label="Credentials" className="border-y border-rule bg-surface">
      <motion.ul
        className="shell grid md:grid-cols-3"
        onViewportEnter={() => setLit(true)}
        viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
      >
        {trustBar.map((item, index) => {
          const Icon = icons[index] ?? ShieldIcon;
          return (
            <li
              key={item.label}
              className="flex items-center gap-4 border-b border-rule py-6 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:last:border-r-0 md:first:pl-0 md:last:pr-0"
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-plate border border-rule-strong bg-canvas text-blue',
                  pulsing && 'badge-pulse',
                )}
                style={pulsing ? { animationDelay: `${index * 130}ms` } : undefined}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.9375rem] font-semibold text-ink">{item.label}</p>
                <p className="mt-0.5 text-sm text-ink-3">{item.detail}</p>
              </div>
            </li>
          );
        })}
      </motion.ul>
    </section>
  );
}
