/**
 * Single source of truth for ElectriCore business information.
 * Everything the site claims about the company lives here so it can be
 * verified and edited in one place.
 */

/** Placeholder origin, used until NEXT_PUBLIC_SITE_URL points at the live domain. */
const PLACEHOLDER_SITE_URL = 'https://electricorellc.com';

/**
 * Resolves the canonical origin from the environment.
 *
 * `??` is not enough on its own: a hosting dashboard happily stores an
 * environment variable as an empty string (name added, value left blank, or
 * cleared later), and `??` only falls back for null and undefined. An empty
 * `site.url` is passed to `new URL()` in app/layout.tsx, which throws
 * ERR_INVALID_URL and fails the production build. A blank or malformed value
 * therefore falls back to the placeholder with a warning, and `origin` drops
 * any trailing slash that would double up when paths are appended.
 */
function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return PLACEHOLDER_SITE_URL;

  try {
    return new URL(value).origin;
  } catch {
    console.warn(
      `[site] NEXT_PUBLIC_SITE_URL is not a valid absolute URL (got ${JSON.stringify(value)}). ` +
        `Falling back to ${PLACEHOLDER_SITE_URL}.`,
    );
    return PLACEHOLDER_SITE_URL;
  }
}

export const site = {
  name: 'ElectriCore',
  legalName: 'ElectriCore LLC',
  tagline: 'Your Core Power Solution',
  owner: 'Wayne Matthews',

  phone: {
    display: '(910) 584-2513',
    /** E.164 for tel: links so mobile dialers work reliably. */
    href: 'tel:+19105842513',
    /** Same number in E.164, used by the SMS notification channel. */
    e164: '+19105842513',
  },

  email: {
    display: 'electricore247@gmail.com',
    href: 'mailto:electricore247@gmail.com',
  },

  serviceArea: {
    short: 'Dunn, NC',
    full: 'Dunn, NC and surrounding areas',
  },

  /** Address locality used for local business structured data. */
  locality: 'Dunn',
  region: 'NC',

  experience: {
    years: 20,
    /** Short form for badges and stats. */
    label: '20+ Years',
  },

  credentials: {
    headline: 'Licensed & Insured',
    detail: 'Licensed electrical contractor, fully insured.',
  },

  /**
   * Canonical origin. Set NEXT_PUBLIC_SITE_URL in the hosting environment
   * once the real domain is live. An empty or unusable value falls back to
   * the placeholder rather than breaking the build.
   */
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
} as const;

export const navigation = [
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#work' },
  { label: 'Why Us', href: '#why' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#quote' },
] as const;

export const trustBar = [
  { label: 'Licensed & Insured', detail: 'Fully covered on every job' },
  { label: '20+ Years Experience', detail: 'Residential and light commercial' },
  { label: 'Dunn, NC', detail: 'And surrounding areas' },
] as const;

export type Service = {
  id: string;
  title: string;
  summary: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: 'panel-upgrades',
    title: 'Panel Upgrades',
    summary:
      'Replace outdated fuse boxes and overloaded panels with modern, code-compliant service equipment.',
    points: [
      'Correct grounding and bonding',
      'Breaker sizing matched to real load',
      'Capacity for HVAC, EV chargers, and additions',
    ],
  },
  {
    id: 'new-construction',
    title: 'New Construction Wiring',
    summary:
      'Complete rough-in through final trim for new homes, additions, shops, and outbuildings.',
    points: [
      'Layout and load calculations',
      'Permits and inspection scheduling',
      'Device, fixture, and trim-out install',
    ],
  },
  {
    id: 'rewiring',
    title: 'Old Construction & Rewiring',
    summary:
      'Knob-and-tube, cloth-wrapped, and aluminum branch circuits brought up to current standards.',
    points: [
      'Outlets and grounding brought up to code',
      'AFCI and GFCI protection added',
      'Wall disruption kept to a minimum',
    ],
  },
  {
    id: 'lighting',
    title: 'Custom Lighting Installation',
    summary:
      'Recessed, exterior, shop, and under-cabinet lighting laid out for how you actually use the space.',
    points: [
      'Dimmers and smart switches',
      'Interior and landscape lighting',
      'Even, glare-free light planning',
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting & Repairs',
    summary:
      'Tripping breakers, dead outlets, flickering lights, and partial outages traced to the root cause.',
    points: [
      'Diagnostics before replacement',
      'Burnt and loose connections corrected',
      'Repairs done properly, not patched over',
    ],
  },
  {
    id: 'inspections',
    title: 'Code Compliance & Inspections',
    summary:
      'Rough-in and final inspection support, plus corrections when another contractor left you a fail.',
    points: [
      'Correction of failed inspections',
      'Panel labeling and circuit schedules',
      'Permit closeout handled',
    ],
  },
];

export type Differentiator = { title: string; body: string };

export const differentiators: Differentiator[] = [
  {
    title: 'Licensed and insured',
    body: 'Fully licensed and insured electrical contractor. You are covered before a single tool comes out of the truck.',
  },
  {
    title: 'Two decades on the tools',
    body: 'Over 20 years wiring homes, additions, shops, and light commercial spaces in and around Dunn, NC.',
  },
  {
    title: 'Every job passes inspection',
    body: 'Every job passes rough-in and final inspection. No shortcuts, no creative interpretation of the code book.',
  },
  {
    title: 'Straightforward pricing',
    body: 'One clear price before work starts, explained in plain language. No surprise line items on the invoice.',
  },
];

export const steps = [
  {
    title: 'Call or request a quote',
    body: 'Call the office directly or send the quote form. Tell us what is going on and where you are located.',
  },
  {
    title: 'We diagnose and quote on site',
    body: 'We look at the job in person, explain what is actually needed, and give you a written price before any work begins.',
  },
  {
    title: 'Work completed and inspected',
    body: 'We do the work, clean up behind ourselves, and handle the inspection. Rough-in and final, done right the first time.',
  },
] as const;

/**
 * PLACEHOLDER CONTENT — NOT REAL REVIEWS.
 * Replace each entry with a verified customer quote and set isPlaceholder to
 * false only once the quote is real and you have permission to publish it.
 * While isPlaceholder is true the UI labels the quote as sample copy so it can
 * never be shipped as a fabricated review.
 */
export type Testimonial = {
  quote: string;
  author: string;
  context: string;
  isPlaceholder: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      'Wayne rewired our whole house after we found old cloth wiring in the attic. He explained every step before he started, and the inspection passed the first time.',
    author: 'Sample review',
    context: 'Full home rewiring',
    isPlaceholder: true,
  },
  {
    quote:
      'Our panel was dangerously overloaded and we could not add anything without tripping breakers. The new panel was labeled clearly and the price matched the quote exactly.',
    author: 'Sample review',
    context: '200 amp panel upgrade',
    isPlaceholder: true,
  },
  {
    quote:
      'He wired our new shop and ran the lighting exactly how we wanted it, including the exterior lights. Clean work, showed up when he said he would.',
    author: 'Sample review',
    context: 'Shop and exterior lighting',
    isPlaceholder: true,
  },
];

/** Service options for the quote form's dropdown. */
export const serviceOptions = [
  'Panel upgrade or replacement',
  'New construction wiring',
  'Old construction / rewiring',
  'Custom lighting installation',
  'Troubleshooting or repair',
  'Code compliance / failed inspection',
  'Something else',
] as const;
