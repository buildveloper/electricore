'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';
import { PhoneIcon } from '@/components/ui/icons';

/**
 * Mobile-only action bar. Slides in once the hero is behind you and steps out
 * of the way near the end of the page so it never covers the footer or form.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const hero = document.getElementById('top');
      const threshold = hero ? hero.offsetHeight * 0.7 : 520;
      const nearEnd =
        window.innerHeight + y >= document.documentElement.scrollHeight - 480;
      setVisible(y > threshold && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <motion.div
      aria-hidden={!visible}
      initial={false}
      animate={
        reduceMotion
          ? { opacity: visible ? 1 : 0 }
          : { y: visible ? '0%' : '130%', opacity: visible ? 1 : 0 }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-canvas/95 px-3 pt-3 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-stretch gap-2.5">
        <a
          href={site.phone.href}
          tabIndex={visible ? undefined : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-control border border-rule-strong py-3.5 text-sm font-semibold text-ink transition-colors active:border-blue active:text-blue"
        >
          <PhoneIcon className="h-4.5 w-4.5" />
          Call Now
        </a>
        <a
          href="#quote"
          tabIndex={visible ? undefined : -1}
          className="flex flex-1 items-center justify-center rounded-control bg-copper py-3.5 text-sm font-semibold text-on-accent"
        >
          Get a Quote
        </a>
      </div>
    </motion.div>
  );
}
