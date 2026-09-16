'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'electricore-theme';
const THEME_COLOR = { dark: '#131927', light: '#f1f5f9' } as const;

/**
 * Switches the theme by setting data-theme on <html>. The initial value is
 * applied before paint by a blocking script in the root layout, so this
 * component only has to read it back and write changes.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'light' || current === 'dark') setTheme(current);
    setReady(true);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing or storage disabled: the choice just will not persist.
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[next]);
  }

  const target = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={ready && theme === 'light'}
      aria-label={`Switch to ${target} theme`}
      title={`Switch to ${target} theme`}
      onClick={toggle}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-control border border-rule-strong text-ink-2',
        'transition-colors duration-200 hover:border-blue hover:text-blue',
        className,
      )}
    >
      <span className="sr-only">Switch to {target} theme</span>
      {theme === 'dark' ? <MoonIcon className="h-4.5 w-4.5" /> : <SunIcon className="h-4.5 w-4.5" />}
    </button>
  );
}
