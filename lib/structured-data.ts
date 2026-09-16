import { services, site } from '@/lib/site';

/**
 * Local business structured data. Only verified facts are included.
 * There is deliberately no aggregateRating: the reviews on the site are
 * placeholders and must not be marked up as real ratings.
 */
export function structuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: site.legalName,
    slogan: site.tagline,
    description:
      'Licensed and insured electrical contractor serving Dunn, NC and the surrounding areas. Panel upgrades, new construction wiring, rewiring, custom lighting, troubleshooting and inspections.',
    url: site.url,
    telephone: site.phone.e164,
    email: site.email.display,
    founder: { '@type': 'Person', name: site.owner },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: site.locality,
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.locality,
        addressRegion: site.region,
        addressCountry: 'US',
      },
    },
    knowsAbout: services.map((service) => service.title),
  };
}
