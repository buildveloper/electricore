'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/lib/gallery';
import { photoAlt } from '@/lib/gallery';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from '@/components/ui/icons';
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll';
import { cn } from '@/lib/cn';

/** Full-screen viewer for a project's photos. Keyboard and focus aware. */
export function Lightbox({
  project,
  index,
  onIndexChange,
  onClose,
}: {
  project: Project;
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const total = project.photos.length;

  useLockBodyScroll(true);

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + total) % total);
    },
    [index, total, onIndexChange],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      } else if (event.key === 'Tab') {
        // Keep focus inside the dialog.
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])');
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
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, onClose]);

  const src = project.photos[index];

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-[#05090f]/94 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title ?? `Project ${project.index}`} photo viewer`}
    >
      {/* Click-away layer */}
      <button
        type="button"
        aria-label="Close photo viewer"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />

      <div className="relative flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <p className="label text-white/70">
          <span className="text-white">Project {project.index}</span>
          {project.title ? <span className="text-white/70"> &middot; {project.title}</span> : null}
        </p>
        <div className="flex items-center gap-4">
          <p className="label text-white/70">
            {index + 1} / {total}
          </p>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-white/25 text-white transition-colors hover:border-white/60"
          >
            <CloseIcon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>

      <div ref={panelRef} className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-control border border-white/25 bg-[#05090f]/70 text-white transition-colors hover:border-white/60 md:left-5"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="sr-only">Previous photo</span>
        </button>

        <motion.div
          key={src}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full max-h-[68vh] w-full max-w-3xl"
        >
          <Image
            src={src}
            alt={photoAlt(project, index)}
            fill
            sizes="(min-width: 1024px) 60vw, 92vw"
            className="object-contain"
          />
        </motion.div>

        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-control border border-white/25 bg-[#05090f]/70 text-white transition-colors hover:border-white/60 md:right-5"
        >
          <ArrowRightIcon className="h-5 w-5" />
          <span className="sr-only">Next photo</span>
        </button>
      </div>

      <div className="relative overflow-x-auto px-4 pb-5 pt-1 md:px-6">
        <ul className="flex justify-center gap-2">
          {project.photos.map((photo, photoIndex) => (
            <li key={photo}>
              <button
                type="button"
                onClick={() => onIndexChange(photoIndex)}
                aria-current={photoIndex === index ? 'true' : undefined}
                className={cn(
                  'relative block h-14 w-11 overflow-hidden rounded-plate border transition-opacity',
                  photoIndex === index
                    ? 'border-white/80 opacity-100'
                    : 'border-white/20 opacity-55 hover:opacity-90',
                )}
              >
                <Image src={photo} alt="" fill sizes="44px" className="object-cover" />
                <span className="sr-only">View photo {photoIndex + 1}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
