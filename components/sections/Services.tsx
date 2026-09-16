'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CircuitBackdrop } from '@/components/motion/CircuitBackdrop';
import { CheckIcon } from '@/components/ui/icons';
import { services } from '@/lib/site';

/**
 * Services rendered as a panel schedule rather than a stack of floating cards:
 * one bordered grid, hairline cells, no radius soup. Cells arrive in a quick
 * stagger so the grid assembles instead of appearing all at once.
 */

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const cell: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function Services() {
  const reduceMotion = useReducedMotion();
  // Empty variants leave the cells in their natural, fully visible state.
  const containerVariants = reduceMotion ? undefined : grid;
  const cellVariants = reduceMotion ? undefined : cell;

  return (
    <Section id="services" className="border-b border-rule py-20 md:py-28">
      <CircuitBackdrop id="services-circuit" variant={1} opacity={[0.04, 0.11, 0.04]} />

      <div className="shell relative">
        <SectionHeading
          index="01"
          eyebrow="Services"
          title="Electrical work, from the panel out"
          lede="Residential and light commercial jobs across Dunn and the surrounding areas. Every one of them scoped honestly, priced up front, and finished to code."
        />

        <motion.div
          className="mt-14 grid grid-cols-1 border-l border-t border-rule sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
        >
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              variants={cellVariants}
              className="group relative border-b border-r border-rule p-6 transition-colors duration-300 hover:bg-surface md:p-7"
            >
              <span className="label text-copper">{String(index + 1).padStart(2, '0')}</span>

              <h3 className="display-sm mt-5 text-xl text-ink">{service.title}</h3>

              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                {service.summary}
              </p>

              <ul className="mt-5 space-y-2.5">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-ink-3">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
