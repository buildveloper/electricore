# ElectriCore design system

Source of truth for the visual language, motion and conversion decisions on the
ElectriCore site. If a change conflicts with this document, either the change or
this document is wrong; decide which, then update both.

---

## 1. What this is

A single-page marketing site for a one-van electrical contractor. Its job is to
convert a local visitor into a phone call or a quote request. It is not a
portfolio and not a brand exercise.

Three audiences, in order of value:

1. **Someone with a problem right now.** Breaker tripping, dead outlets, a failed
   inspection. They need a phone number in under two seconds.
2. **Someone planning work.** Panel upgrade, addition, rewiring. They need proof
   of competence and a way to get a price.
3. **Someone checking whether this contractor is legitimate.** They need
   licensed/insured, 20+ years, and evidence of real finished work.

Every section exists to answer one of those. Nothing was added for decoration.

---

## 2. Art direction

**"Technical competence you can trust."** The visual language is borrowed from
the things an electrician actually reads all day: panel schedules, wire labels,
blueprint grids, spec sheets.

That produces three rules:

1. **Labels are monospaced and uppercase.** Section eyebrows, badges, counts and
   spec lines all use the wire-label voice (`JetBrains Mono`, wide tracking).
   This is the strongest single signal that the site was made by people who know
   the trade.
2. **Structure is drawn, not floated.** Hairline rules, a bordered grid for
   services, square nameplate badges. Radii stay at 3 to 8px. No floating cards
   with 24px corners.
3. **One inversion.** The page is dark, with exactly one band flipped to the
   opposite theme for the project gallery, so real job photos sit on a light
   ground. That contrast is the rhythm of the page. Do not add a second one.

### Explicitly rejected

Purple/blue AI gradients, glassmorphism, drop-shadow stacks, glowing borders,
pill-shaped badges, giant text on every section, cards inside cards, animated
everything.

---

## 3. Colour, sampled from the artwork

Values are **not invented**. They are read out of the supplied logo by
`scripts/build-brand-assets.mjs`:

| Role | Value | Provenance |
| --- | --- | --- |
| Ground / canvas | `#131927` | the artwork's own background, averaged at its corners |
| Electric | `#05c9e3` | most saturated cool ink, hue 187, saturation 98% |
| Copper | `#fb8627` | most saturated warm ink, hue 27, saturation 84% |

The canvas **is** the artwork's ground. That is deliberate: the logo has an
opaque navy background, so making the page canvas the same value lets it sit
flush in the header, hero and footer with no plate, no border and no visible
edge.

Surfaces, rules and muted text are stepped lightness on the same blue-grey
family, so every value on the page traces back to the artwork.

### Role of each accent

- **Electric `#05c9e3`** is structural and interactive: links, focus rings,
  hairlines, circuit traces, icon fills, the pulse motion.
- **Copper `#fb8627`** is the action colour: primary buttons, section index
  numbers, the "Step 1/2/3" markers, the proof-point rule. It is reserved for
  things you click or that mark progress, which is why it stays scarce.

Both were contrast-checked against the canvas: electric 8.7:1, copper 7.1:1.

---

## 4. Light and dark

The site ships both themes. Dark is the brand default.

- `data-theme` is set on `<html>` by a **blocking inline script** before first
  paint (no flash). It reads `localStorage`, falling back to
  `prefers-color-scheme`.
- The toggle in the header is `role="switch"` with `aria-checked`, and it also
  updates the `theme-color` meta.
- Tokens are defined once per palette in `globals.css` and mapped by context:
  `:root` (dark), `[data-theme='light']`, `[data-theme='dark'] [data-band='invert']`,
  `[data-theme='light'] [data-band='invert']`.
- `Section band="invert"` flips to the **opposite of the active theme**, so the
  gallery is light on the dark theme and dark on the light theme. The page keeps
  its rhythm either way. Never hardcode light or dark into a component.

The logo is the one asset that cannot follow the theme automatically: the
artwork is light-ink-on-navy. On dark it sits flush with the canvas; on light
`.logo-plate` restores its navy ground.

---

## 5. Typography

- **Display and body: Archivo.** Variable, with the width axis used at 93-95%
  for a slightly condensed, engineered feel on headings.
- **Labels and specs: JetBrains Mono**, uppercase, 0.16em tracking, 11px.

Scale is `clamp()`-based so headings breathe on desktop without a jump on
mobile. Body text never drops below 15px. `.label` and `.display` are the two
shared type classes; use them rather than re-specifying sizes.

---

## 6. Motion

The governing rule: **one orchestrated entrance, then interaction-triggered
motion only.** There is no fade-and-slide-up applied to every section.

| Moment | Treatment |
| --- | --- |
| Hero entrance | Circuit traces draw on (`pathLength`), pads land on a spring, the copper signal runs into the core. Copy rises in a coordinated stagger. Once, on load. |
| Services grid | Cells arrive in a 55ms stagger, 400ms, no bounce, on first scroll into view. |
| Credential badges | One-shot scale + electric-blue glow pulse as the bar enters view, staggered 130ms. |
| Section backdrops | Tiled circuit texture translates -3.5% to 3.5% and fades 0.05 to 0.13 across the section's scroll range. |
| Gallery | Hover zoom to 1.045 over 700ms, plus a scrim and a plus affordance. Nothing animates on entry. |
| Buttons | `btn-electric`: a radial sheen that opens out plus a one-shot ring pulse, in the electric blue. |
| Sticky CTA | Slides up after the hero, steps aside 480px from the end. |

Everything above is disabled or pinned to its end state under
`prefers-reduced-motion: reduce`, including animation *delays* so no content is
ever left hidden.

---

## 7. Conversion decisions

- **Phone number is reachable from everywhere**: header (desktop), sticky bottom
  bar (mobile), hero, contact section and footer.
- **Primary CTA is always the same words**: "Get a Free Estimate" / "Get a Quote".
- **The form asks for four things** and nothing else. Name, phone, work type,
  description. Every extra field costs leads.
- **Failure never loses a lead**: if the API cannot deliver, the form says so and
  hands over the phone number and email rather than a false confirmation.
- **Proof sits next to the claim**: the "passes rough-in and final inspection"
  point is called out in its own panel rather than buried in a list.

---

## 8. Accessibility

- Every text/background pair meets WCAG AA. Muted text (`--ink-3`) is 6.7:1 on
  dark and 5.6:1 on light.
- Visible `:focus-visible` ring on everything, in the electric blue.
- Skip link is the first tab stop.
- The lightbox is a real dialog: `role="dialog"`, `aria-modal`, Escape to close,
  arrow keys to move, focus returned to the tile that opened it, body scroll
  locked.
- The mobile menu traps focus, locks scroll, closes on Escape and returns focus.
- Form errors are announced and wired with `aria-invalid` / `aria-describedby`.
- Decorative artwork is `aria-hidden`; the logo image is decorative where the
  typeset wordmark already names the company.

---

## 9. Performance

- Four fonts weights avoided entirely; only two families, self-hosted by
  `next/font`, `display: swap`.
- Job photos are served through `next/image` with correct `sizes`, all lazy.
- The logo mark is WebP at 384px (40kB); the full-resolution supplied PNG is kept
  for reference and social only.
- Motion animates only `transform` and `opacity`.
- No icon library; icons are inline SVG on a 24px grid.

---

## 10. Brand assets

`scripts/build-brand-assets.mjs` regenerates everything from the supplied file
and prints the sampled palette:

```
npm run brand:assets
```

It writes `public/logo/electricore-logo.png` (the supplied file, unmodified) and
`public/logo/electricore-mark.webp` (sized for the interface).

**The header, hero and footer show the real emblem.** Next to it, the name is
typeset in the site's display face at small sizes, because the emblem's internal
lettering is not legible below roughly 96px. That is a legibility decision, not
a substitution: the artwork itself is always the supplied file.

---

## 11. Verification

```
npm run typecheck
npm run build
npm run test:smoke     # needs a dev or start server running
npm run test:theme
```

`scripts/smoke.mjs` drives a real Chrome and asserts the things that are easy to
break silently: route status codes, lightbox keyboard behaviour, form validation
and submission, header/footer behaviour, no horizontal overflow from 320px to
1920px, theme switching and band inversion, and that motion degrades under
reduced motion. It fails the run on any console error.

---

## 12. Content that must not ship as-is

1. **Testimonials are placeholders.** `lib/site.ts` marks them
   `isPlaceholder: true`, and the UI labels them while that flag is set so
   fabricated reviews cannot be published by accident. Replace the quotes, set
   the flag to false, and only then consider review markup.
2. **Gallery captions are unset.** `lib/gallery.ts` holds `title`, `scope` and
   `location` fields that render only when filled in. Confirm the scope of each
   job before filling them.
3. **No social links** until accounts are confirmed.
4. **No aggregate rating** in the structured data, deliberately.
