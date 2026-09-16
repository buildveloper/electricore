# ElectriCore LLC — marketing site

Single-page marketing site for **ElectriCore LLC**, a licensed and insured
electrical contractor in Dunn, NC.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion.

- Design system and decisions: **[DESIGN.md](./DESIGN.md)**
- Environment variables: **[.env.example](./.env.example)**

---

## Run it locally

```bash
npm install
cp .env.example .env.local     # optional for local work
npm run dev                    # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run brand:assets # regenerate logo assets + print the sampled palette
```

---

## Editing the content

Almost everything a non-developer needs to change lives in two files.

| What | Where |
| --- | --- |
| Phone, email, service area, owner, tagline | `lib/site.ts` → `site` |
| Services grid copy | `lib/site.ts` → `services` |
| Why-us points | `lib/site.ts` → `differentiators` |
| Process steps | `lib/site.ts` → `steps` |
| Testimonials | `lib/site.ts` → `testimonials` |
| Quote form dropdown options | `lib/site.ts` → `serviceOptions` |
| Project gallery photos and captions | `lib/gallery.ts` |

### Adding job photos

1. Drop the files into `public/imagesOfWork/client1/`, `client2/` or `client3/`.
2. Add one line per photo to the matching `photos` array in `lib/gallery.ts`.

Tiles are locked to a 3:4 portrait frame and cropped with `object-cover`, so
straight-from-phone photos work without editing. A project shows up to 8 tiles,
then collapses to a "+N more" tile that opens the lightbox.

### Filling in project captions

`lib/gallery.ts` has `title`, `scope` and `location` fields on each project.
They are empty on purpose and the UI renders them only when set. Fill them in
once the scope of each job is confirmed and the gallery picks them up with no
code changes.

---

## Lead delivery

Submissions go to `POST /api/lead`, which validates, blocks spam, and then
delivers over whichever channels are configured. Each channel is independent,
and every lead is logged server-side regardless.

| Channel | Variables | Notes |
| --- | --- | --- |
| Email | `RESEND_API_KEY`, optional `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` | Recommended. |
| SMS | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, optional `LEAD_TO_SMS` | Texts the office. |
| Webhook | `LEAD_WEBHOOK_URL` | CRM, Zapier, Make, Slack. |

**Set at least one channel in production.** With none configured the endpoint
returns an error rather than a false confirmation, and the form shows the phone
number and email instead. It never tells a visitor their request was received
when nothing was sent.

Spam handling is a hidden honeypot field plus a submission-time check, and a
per-IP throttle of 6 requests per 10 minutes. The throttle keys on the platform's
forwarded IP header; if a host provides no such header it is skipped rather than
bucketing every visitor together.

---

## Deploying to Vercel

1. Import the repository in Vercel. Framework preset **Next.js** is detected
   automatically; leave the build command and output directory alone.
2. Add environment variables under **Settings → Environment Variables** for
   Production (and Preview if wanted):

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | the live domain, e.g. `https://electricorellc.com` |
   | `RESEND_API_KEY` | from https://resend.com/api-keys |
   | `LEAD_TO_EMAIL` | `electricore247@gmail.com` |
   | `LEAD_FROM_EMAIL` | `ElectriCore Website <onboarding@resend.dev>` until the domain is verified in Resend |

3. Deploy.
4. **After the first deploy, submit a real test lead and confirm it arrives.**
   The form returning "Request received" is not proof that delivery worked; the
   server log and the inbox are.
5. Once the domain is live, verify it in Resend and switch `LEAD_FROM_EMAIL` off
   the `onboarding@resend.dev` sandbox sender. That sandbox sender can only send
   to the address the Resend account was created with.

`NEXT_PUBLIC_SITE_URL` drives canonical URLs, `sitemap.xml`, `robots.txt` and
social previews. Set it before launch or those will point at the placeholder
domain.

---

## Before launch

- [ ] Replace the placeholder testimonials in `lib/site.ts` and clear
      `isPlaceholder`. The site labels them until you do.
- [ ] Confirm each project's scope in `lib/gallery.ts`.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain.
- [ ] Configure and test lead delivery (see above).
- [ ] Add social links to the footer once the accounts exist; the footer
      intentionally omits them.
- [ ] Point the domain at Vercel and confirm HTTPS.

---

## Project structure

```
app/
  layout.tsx              metadata, fonts, pre-paint theme script
  page.tsx                section order
  globals.css             design tokens, both themes, motion primitives
  api/lead/route.ts       lead endpoint
  icon.svg                favicon
  opengraph-image.tsx     social card
components/
  brand/Logo.tsx          the supplied emblem
  layout/                 header, footer, sticky mobile CTA
  motion/                 hero circuit, circuit backdrop, tiled pattern
  sections/               one file per page section
  ui/                     Button, Badge, Section, SectionHeading, icons
lib/
  site.ts                 all business content
  gallery.ts              project gallery data
  lead-schema.ts          shared validation (client and server)
  lead-delivery.ts        server-only email / SMS / webhook delivery
  structured-data.ts      LocalBusiness JSON-LD
scripts/
  build-brand-assets.mjs  logo assets + palette sampling
  smoke.mjs               browser verification suite
```
