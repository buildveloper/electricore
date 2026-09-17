'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRightIcon, CloseIcon, MenuIcon, PhoneIcon } from '@/components/ui/icons';
import { navigation, site } from '@/lib/site';
import { useActiveSection } from '@/lib/hooks/useActiveSection';
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll';
import { cn } from '@/lib/cn';

const sectionIds = navigation.map((item) => item.href.replace('#', ''));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const reduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Escape to dismiss, and keep Tab inside the panel while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-canvas transition-colors duration-300',
        scrolled ? 'border-rule' : 'border-transparent',
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
        <a
          href="#top"
          className="shrink-0 rounded-plate"
          aria-label={`${site.legalName} home`}
        >
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isActive = active === item.href.replace('#', '');
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'relative rounded-plate px-3 py-2 text-sm transition-colors duration-200',
                  isActive ? 'text-ink' : 'text-ink-2 hover:text-ink',
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-3 -bottom-0.5 h-px origin-left bg-copper transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2 font-mono text-[0.8125rem] tracking-tight text-ink-2 transition-colors hover:text-blue xl:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {site.phone.display}
          </a>

          <ThemeToggle />

          {/* Wrapped rather than given `hidden lg:inline-flex`: the Button's own
              display utility would win the cascade and leave it visible on mobile.
              The nav and this CTA only appear once there is room for the full row. */}
          <div className="hidden lg:block">
            <Button href="#quote">Get a Free Estimate</Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-rule-strong text-ink transition-colors hover:border-blue hover:text-blue lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-canvas lg:hidden"
          >
            <div className="shell flex h-16 shrink-0 items-center justify-between border-b border-rule">
              <Logo />
              <button
                type="button"
                onClick={closeMenu}
                autoFocus
                className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-rule-strong text-ink transition-colors hover:border-blue hover:text-blue"
              >
                <CloseIcon className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            {/* min-h-0 + overflow-y-auto, with the centring on an inner wrapper
                via `my-auto` rather than `justify-center`: rows stay centred in
                portrait, and on a short viewport (a landscape phone) the list
                scrolls inside the panel instead of overflowing it and pushing
                the links and buttons out of reach. Centring a scroll container
                with `justify-center` would clip the first row instead. */}
            <nav aria-label="Mobile" className="shell flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="my-auto flex flex-col gap-1">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="display-sm group flex items-center justify-between border-b border-rule py-5 text-2xl text-ink transition-colors hover:text-blue"
                  >
                    {item.label}
                    <ArrowRightIcon className="h-5 w-5 text-ink-3 transition-colors group-hover:text-blue" />
                  </a>
                ))}
              </div>
            </nav>

            <div className="shell flex shrink-0 flex-col gap-3 border-t border-rule py-6">
              <Button href={site.phone.href} variant="secondary" size="lg">
                <PhoneIcon className="h-5 w-5" />
                Call {site.phone.display}
              </Button>
              <Button href="#quote" size="lg" onClick={closeMenu}>
                Get a Free Estimate
              </Button>
              <p className="label pt-1 text-center text-ink-3">
                {site.credentials.headline} &middot; {site.serviceArea.full}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
