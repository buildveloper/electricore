import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CircuitBackdrop } from '@/components/motion/CircuitBackdrop';
import { ClipboardIcon } from '@/components/ui/icons';
import { differentiators, site } from '@/lib/site';

export function WhyUs() {
  return (
    <Section id="why" className="border-b border-rule py-20 md:py-28">
      <CircuitBackdrop id="why-circuit" variant={2} opacity={[0.03, 0.09, 0.03]} />

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              index="03"
              eyebrow="Why ElectriCore"
              title="You are hiring a contractor, not a gamble"
              lede={`${site.owner} has spent more than ${site.experience.years} years on the tools in and around Dunn. That experience is the difference between a repair that holds and one you pay for twice.`}
            />

            <dl className="mt-10 grid grid-cols-2 gap-px border border-rule bg-rule">
              <div className="bg-canvas p-5">
                <dt className="label text-ink-3">Ownership</dt>
                <dd className="mt-3 text-[0.9375rem] text-ink">{site.owner}</dd>
              </div>
              <div className="bg-canvas p-5">
                <dt className="label text-ink-3">Experience</dt>
                <dd className="mt-3 text-[0.9375rem] text-ink">
                  {site.experience.label} in the trade
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {differentiators.map((item, index) => (
            <li
              key={item.title}
              className="flex gap-5 border-t border-rule py-7 last:border-b md:gap-8"
            >
              <span className="label pt-1 text-copper">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="display-sm text-xl text-ink">{item.title}</h3>
                <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-ink-2">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* The backing proof point, called out on its own. */}
      <div className="shell relative mt-14 md:mt-16">
        <div className="flex flex-col gap-5 border-l-2 border-copper bg-surface p-7 sm:flex-row sm:items-start sm:gap-7 md:p-9">
          <ClipboardIcon className="h-7 w-7 shrink-0 text-copper" />
          <div>
            <p className="display-sm max-w-3xl text-xl text-ink md:text-2xl">
              Every job passes rough-in and final inspection. No shortcuts.
            </p>
            <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-2">
              Pulled permits, correct materials, and work that holds up when the inspector walks
              through. If a previous contractor left you with a failed inspection, that is a job we
              take on regularly.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
