import { HeroCircuit } from '@/components/motion/HeroCircuit';
import { Logo } from '@/components/brand/Logo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, BoltIcon, PhoneIcon, ShieldIcon } from '@/components/ui/icons';
import { site } from '@/lib/site';

/**
 * Hero. Copy lands in a single staggered sequence coordinated with the circuit
 * draw-on: label, headline, paragraph, actions, credentials. The supplied
 * artwork sits over the traces like a nameplate mounted on the panel.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-canvas">
      <div
        aria-hidden="true"
        className="blueprint blueprint-fade pointer-events-none absolute inset-0"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-35 sm:opacity-45 lg:w-[66%] lg:opacity-75"
      >
        <HeroCircuit className="h-full w-full" />
      </div>

      {/* Scrims keep the headline at full contrast over the artwork. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, var(--canvas) 16%, color-mix(in oklab, var(--canvas) 72%, transparent) 52%, transparent 82%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, var(--canvas), transparent)' }}
      />

      <div className="shell relative pb-16 pt-14 md:pb-24 md:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="max-w-[46rem] lg:col-span-7">
            <p
              className="label rise flex items-center gap-3 text-copper"
              style={{ animationDelay: '0.1s' }}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-copper" />
              {site.tagline}
            </p>

            <h1
              className="display rise mt-6 text-[clamp(2.35rem,7.2vw,4.4rem)] text-ink"
              style={{ animationDelay: '0.22s' }}
            >
              Power you can trust.
              <br />
              Wired right <span className="text-copper">the first time</span>.
            </h1>

            <p
              className="rise mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-ink-2 md:text-lg"
              style={{ animationDelay: '0.36s' }}
            >
              {site.legalName} is a licensed and insured electrical contractor serving{' '}
              {site.serviceArea.full}. More than {site.experience.years} years of residential and
              light commercial work: new construction wiring, rewiring, panel upgrades, and custom
              lighting. Done to code, and built to pass inspection.
            </p>

            <div
              className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '0.48s' }}
            >
              <Button href="#quote" size="lg">
                Get a Free Estimate
                <ArrowRightIcon className="h-4.5 w-4.5" />
              </Button>
              <Button href={site.phone.href} variant="secondary" size="lg">
                <PhoneIcon className="h-4.5 w-4.5" />
                Call {site.phone.display}
              </Button>
            </div>

            <ul className="rise mt-10 flex flex-wrap gap-2.5" style={{ animationDelay: '0.6s' }}>
              <li>
                <Badge icon={<ShieldIcon className="h-4 w-4" />}>{site.credentials.headline}</Badge>
              </li>
              <li>
                <Badge icon={<BoltIcon className="h-4 w-4" />}>
                  {site.experience.label} in the trade
                </Badge>
              </li>
            </ul>
          </div>

          {/* Hidden on small screens: the header already carries the brand there. */}
          <div className="hidden lg:col-span-5 lg:flex lg:justify-end lg:pt-2">
            <Logo variant="mark" size="lg" priority />
          </div>
        </div>
      </div>
    </section>
  );
}
