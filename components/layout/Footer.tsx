import { Logo } from '@/components/brand/Logo';
import { MailIcon, MapPinIcon, PhoneIcon, ShieldIcon } from '@/components/ui/icons';
import { navigation, services, site } from '@/lib/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-surface">
      <div className="shell grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-2">
            {site.tagline}. Residential and light commercial electrical work, done to code and
            built to pass inspection.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-plate border border-rule-strong px-3 py-2">
            <ShieldIcon className="h-4 w-4 text-blue" />
            <span className="label text-ink-2">{site.credentials.headline}</span>
          </p>
        </div>

        <nav aria-label="Services" className="md:col-span-3">
          <h2 className="label text-ink-3">Services</h2>
          <ul className="mt-5 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href="#services"
                  className="text-[0.9375rem] text-ink-2 transition-colors hover:text-blue"
                >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="label text-ink-3">Contact</h2>
          <ul className="mt-5 space-y-4 text-[0.9375rem]">
            <li>
              <a
                href={site.phone.href}
                className="inline-flex items-center gap-3 font-mono text-lg tracking-tight text-ink transition-colors hover:text-blue"
              >
                <PhoneIcon className="h-4.5 w-4.5 shrink-0 text-copper" />
                {site.phone.display}
              </a>
            </li>
            <li>
              <a
                href={site.email.href}
                className="inline-flex items-start gap-3 break-all text-ink-2 transition-colors hover:text-blue"
              >
                <MailIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-copper" />
                {site.email.display}
              </a>
            </li>
            <li className="flex items-start gap-3 text-ink-2">
              <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-copper" />
              {site.serviceArea.full}
            </li>
          </ul>

          <p className="label mt-7 text-ink-3">Pages</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-ink-2 transition-colors hover:text-blue"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Social links are intentionally omitted until the accounts are
              confirmed. Add an anchor list here with rel="noopener noreferrer". */}
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="shell flex flex-col gap-3 pb-28 pt-6 md:flex-row md:items-center md:justify-between md:pb-6">
          <p className="label text-ink-3">
            &copy; {year} {site.legalName}
          </p>
          <p className="label text-ink-3">
            {site.credentials.headline} &middot; {site.serviceArea.full}
          </p>
        </div>
      </div>
    </footer>
  );
}
