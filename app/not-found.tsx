import { Button } from '@/components/ui/Button';
import { PhoneIcon } from '@/components/ui/icons';
import { navigation, site } from '@/lib/site';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-20">
      <p className="label flex items-center gap-3 text-copper">
        <span aria-hidden="true" className="h-1.5 w-1.5 bg-copper" />
        Error 404
      </p>
      <h1 className="display mt-6 text-[clamp(2rem,6vw,3.25rem)] text-ink">
        That circuit does not go anywhere
      </h1>
      <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-2">
        The page you were looking for is not here. Head back to the home page, or call the office
        and we will point you in the right direction.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button href="/" size="lg">
          Back to home
        </Button>
        <Button href={site.phone.href} variant="secondary" size="lg">
          <PhoneIcon className="h-4.5 w-4.5" />
          Call {site.phone.display}
        </Button>
      </div>

      <nav aria-label="Site" className="mt-12 border-t border-rule pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {navigation.map((item) => (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                className="text-sm text-ink-2 transition-colors hover:text-blue"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
