'use client';

import { useEffect, useState } from 'react';

/** Highlights the nav item for the section currently in view. */
export function useActiveSection(ids: readonly string[], offset = 120): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const update = () => {
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset <= 0) current = section.id;
      }
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ids, offset]);

  return active;
}
