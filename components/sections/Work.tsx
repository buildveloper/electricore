'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Lightbox } from '@/components/sections/Lightbox';
import { PlusIcon } from '@/components/ui/icons';
import { photoAlt, projects } from '@/lib/gallery';

/**
 * Finished-work proof, on the light "spec sheet" band so the photos carry the
 * colour. A straight grid, hover zoom, and a lightbox. No per-image entrances.
 */

const TILE_SIZES = '(min-width: 1024px) 24vw, (min-width: 640px) 31vw, 46vw';
const MAX_TILES = 8;

type OpenState = { projectIndex: number; photoIndex: number };

export function Work() {
  const [open, setOpen] = useState<OpenState | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const openAt = useCallback((projectIndex: number, photoIndex: number) => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    setOpen({ projectIndex, photoIndex });
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    restoreFocusTo.current?.focus();
  }, []);

  const activeProject = open ? projects[open.projectIndex] : null;

  return (
    <Section id="work" band="invert" className="border-b border-rule py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="Our Work"
          title="Finished work, not promises"
          lede="Real photos from completed jobs. Every one of them passed rough-in and final inspection. If any of this looks like what you need done, mention it when you call and we will tell you honestly what it takes."
        />

        <div className="mt-14 space-y-14 md:space-y-16">
          {projects.map((project, projectIndex) => {
            const hasOverflow = project.photos.length > MAX_TILES;
            const visible = hasOverflow ? project.photos.slice(0, MAX_TILES - 1) : project.photos;
            const remaining = project.photos.length - visible.length;

            return (
              <article key={project.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-4">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="label text-copper">Project {project.index}</h3>
                    {project.title ? (
                      <p className="display-sm text-xl text-ink">{project.title}</p>
                    ) : null}
                  </div>
                  <p className="label text-ink-3">
                    {project.photos.length} {project.photos.length === 1 ? 'photo' : 'photos'}
                  </p>
                </div>

                <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {visible.map((photo, photoIndex) => (
                    <li key={photo}>
                      <button
                        type="button"
                        onClick={() => openAt(projectIndex, photoIndex)}
                        className="zoom-frame group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-plate border border-rule bg-surface-2"
                      >
                        <Image
                          src={photo}
                          alt={photoAlt(project, photoIndex)}
                          fill
                          sizes={TILE_SIZES}
                          className="object-cover"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25"
                        >
                          <PlusIcon className="h-6 w-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </span>
                      </button>
                    </li>
                  ))}

                  {hasOverflow ? (
                    <li>
                      <button
                        type="button"
                        onClick={() => openAt(projectIndex, visible.length)}
                        className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-plate border border-rule bg-surface-2 transition-colors hover:border-rule-strong"
                      >
                        <span className="display text-2xl text-ink">+{remaining}</span>
                        <span className="label text-ink-3">More photos</span>
                      </button>
                    </li>
                  ) : null}
                </ul>
              </article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && activeProject ? (
          <Lightbox
            project={activeProject}
            index={open.photoIndex}
            onIndexChange={(photoIndex) => setOpen({ projectIndex: open.projectIndex, photoIndex })}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
