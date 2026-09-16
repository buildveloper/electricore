'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CircuitBackdrop } from '@/components/motion/CircuitBackdrop';
import { Button } from '@/components/ui/Button';
import { AlertIcon, CheckIcon, MailIcon, PhoneIcon } from '@/components/ui/icons';
import { parseLead } from '@/lib/lead-schema';
import { serviceOptions, site } from '@/lib/site';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputClasses =
  'w-full rounded-control border border-rule bg-canvas px-3.5 py-3 text-[0.9375rem] text-ink ' +
  'placeholder:text-ink-3/70 transition-colors focus:border-blue focus:outline-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ' +
  'aria-[invalid=true]:border-copper';

const labelClasses = 'label block text-ink-3';

export function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const data = new FormData(event.currentTarget);
    const candidate = {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      service: String(data.get('service') ?? ''),
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''),
      startedAt: startedAt.current,
    };

    const clientCheck = parseLead(candidate);
    if (!clientCheck.ok) {
      setErrors(clientCheck.errors);
      setStatus('error');
      const first = Object.keys(clientCheck.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus('submitting');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !payload.ok) {
        setErrors(payload.errors ?? {});
        setFormError(payload.message ?? 'We could not send that. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFormError(
        'We could not reach the server. Please call or email us and we will get straight back to you.',
      );
      setStatus('error');
    }
  }

  return (
    <Section id="quote" className="py-20 md:py-28">
      <CircuitBackdrop id="quote-circuit" variant={1} opacity={[0.03, 0.1, 0.03]} />

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            index="05"
            eyebrow="Free Estimate"
            title="Tell us what you need done"
            lede="Send the details and we will get back to you with a straight answer and a clear price. No obligation, no pressure."
          />

          <ul className="mt-10 space-y-5">
            {[
              'We call you back to talk through the job.',
              'We come out, look at it in person, and quote on site.',
              'You get one clear price before any work starts.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3.5 text-[0.9375rem] text-ink-2">
                <CheckIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-copper" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-rule pt-8">
            <p className="label text-ink-3">Prefer to talk?</p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={site.phone.href}
                className="inline-flex items-center gap-3 font-mono text-lg text-ink transition-colors hover:text-blue"
              >
                <PhoneIcon className="h-5 w-5 text-copper" />
                {site.phone.display}
              </a>
              <a
                href={site.email.href}
                className="inline-flex items-center gap-3 break-all text-[0.9375rem] text-ink-2 transition-colors hover:text-blue"
              >
                <MailIcon className="h-5 w-5 shrink-0 text-copper" />
                {site.email.display}
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {status === 'success' ? (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              className="flex h-full flex-col justify-center border border-rule bg-surface p-8 md:p-10"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-plate border border-blue/40 text-blue">
                <CheckIcon className="h-5 w-5" />
              </span>
              <h3 className="display-sm mt-6 text-2xl text-ink">Request received</h3>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-2">
                Thanks. {site.owner} will call you back on the number you left, usually the same
                day. If it is urgent, call the office directly at{' '}
                <a href={site.phone.href} className="text-blue underline underline-offset-4">
                  {site.phone.display}
                </a>
                .
              </p>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="relative border border-rule bg-surface p-6 md:p-8"
            >
              {formError ? (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 border-l-2 border-copper bg-canvas p-4"
                >
                  <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-copper" />
                  <div className="text-sm text-ink">
                    <p>{formError}</p>
                    <p className="mt-2 text-ink-2">
                      You can also reach us at{' '}
                      <a href={site.phone.href} className="text-blue underline underline-offset-4">
                        {site.phone.display}
                      </a>{' '}
                      or{' '}
                      <a href={site.email.href} className="text-blue underline underline-offset-4">
                        {site.email.display}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClasses} htmlFor="name">
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={cn(inputClasses, 'mt-2.5')}
                    placeholder="First and last name"
                  />
                  {errors.name ? (
                    <p id="name-error" className="mt-2 text-sm text-copper">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClasses} htmlFor="phone">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={errors.phone ? 'true' : undefined}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={cn(inputClasses, 'mt-2.5')}
                    placeholder="(910) 555-0123"
                  />
                  {errors.phone ? (
                    <p id="phone-error" className="mt-2 text-sm text-copper">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5">
                <label className={labelClasses} htmlFor="service">
                  What do you need?
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  defaultValue=""
                  aria-invalid={errors.service ? 'true' : undefined}
                  aria-describedby={errors.service ? 'service-error' : undefined}
                  className={cn(inputClasses, 'mt-2.5 appearance-none bg-canvas')}
                >
                  <option value="" disabled>
                    Choose the type of work
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.service ? (
                  <p id="service-error" className="mt-2 text-sm text-copper">
                    {errors.service}
                  </p>
                ) : null}
              </div>

              <div className="mt-5">
                <label className={labelClasses} htmlFor="message">
                  Describe the job
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={cn(inputClasses, 'mt-2.5 resize-y')}
                  placeholder="What is happening, and where is the property? For example: panel is full and breakers keep tripping in a 1970s ranch house on Elm Street."
                />
                {errors.message ? (
                  <p id="message-error" className="mt-2 text-sm text-copper">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" size="lg" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Send My Request'}
                </Button>
                <p className="text-sm text-ink-3">
                  We only use your details to answer this request.
                </p>
              </div>

              <p aria-live="polite" className="sr-only">
                {status === 'submitting' ? 'Sending your request' : ''}
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
