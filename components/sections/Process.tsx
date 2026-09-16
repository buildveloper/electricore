import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { steps } from '@/lib/site';

/** Three steps drawn as one continuous run with a tap at each stage. */
export function Process() {
  return (
    <Section id="process" className="border-b border-rule py-20 md:py-28">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="How It Works"
          title="Three steps, no runaround"
          lede="From the first phone call to the final inspection, here is exactly what working with us looks like."
        />

        <ol className="mt-16 grid md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative border-t border-rule pb-9 pt-10 last:pb-0 md:pb-0 md:pr-12"
            >
              <span
                aria-hidden="true"
                className="absolute -top-2.5 left-0 flex h-5 w-5 items-center justify-center rounded-plate border border-rule-strong bg-canvas"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-copper" />
              </span>

              <p className="label text-copper">Step {index + 1}</p>
              <h3 className="display-sm mt-4 text-xl text-ink">{step.title}</h3>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-2">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
