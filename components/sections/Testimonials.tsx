import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AlertIcon } from '@/components/ui/icons';
import { testimonials } from '@/lib/site';

/**
 * Feedback wall. Entries flagged as placeholders are labelled in the UI so
 * sample copy can never be published as a real customer review. Replace the
 * quotes in lib/site.ts and clear the flag when real reviews are available.
 */
export function Testimonials() {
  const hasPlaceholders = testimonials.some((item) => item.isPlaceholder);

  return (
    <Section className="border-t border-rule py-20 md:py-28">
      <div className="shell">
        <SectionHeading index="06" eyebrow="Feedback" title="What customers say" />

        {hasPlaceholders ? (
          <p className="mt-8 inline-flex items-start gap-2.5 border border-rule px-4 py-3 text-sm text-ink-3">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
            These quotes are placeholder copy. Replace them with real, permission-granted customer
            reviews before launch.
          </p>
        ) : null}

        <ul className="mt-10 grid gap-px border border-rule bg-rule md:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.quote} className="flex flex-col bg-canvas p-7 md:p-8">
              <blockquote className="text-[1.0625rem] leading-relaxed text-ink">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer className="mt-auto pt-7">
                <p className="label text-ink-3">{item.context}</p>
                <p className="mt-2 text-sm text-ink-2">{item.author}</p>
                {item.isPlaceholder ? (
                  <p className="label mt-3 text-copper">Placeholder</p>
                ) : null}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
