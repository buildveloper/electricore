import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyCta } from '@/components/layout/StickyCta';
import { site } from '@/lib/site';

/**
 * Archivo carries the headlines and body, with its width axis used for the
 * condensed display settings. JetBrains Mono is the wire-label voice used for
 * every eyebrow, badge and spec line.
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  axes: ['wdth'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/**
 * Applies the saved theme before first paint so the page never flashes the
 * wrong palette. Dark is the brand default; a visitor whose system asks for
 * light gets light until they choose otherwise.
 */
const themeScript = `
(function () {
  try {
    var key = 'electricore-theme';
    var stored = window.localStorage.getItem(key);
    var theme = (stored === 'light' || stored === 'dark')
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#131927' : '#f1f5f9');
  } catch (error) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'ElectriCore LLC | Licensed Electrician in Dunn, NC',
    template: `%s | ${site.legalName}`,
  },
  description:
    'Licensed and insured electrical contractor in Dunn, NC and surrounding areas. Panel upgrades, new construction wiring, rewiring, custom lighting, repairs and inspections. 20+ years of experience. Free estimates.',
  applicationName: site.legalName,
  keywords: [
    'electrician Dunn NC',
    'electrical contractor Dunn NC',
    'panel upgrade Dunn NC',
    'electrical repair Dunn NC',
    'new construction wiring North Carolina',
    'licensed electrician Harnett County',
  ],
  authors: [{ name: site.legalName }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.legalName,
    title: 'ElectriCore LLC | Licensed Electrician in Dunn, NC',
    description:
      'Power you can trust, wired right the first time. Licensed and insured electrical contractor serving Dunn, NC and surrounding areas.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElectriCore LLC | Licensed Electrician in Dunn, NC',
    description:
      'Licensed and insured electrical contractor serving Dunn, NC and surrounding areas. Free estimates.',
  },
  robots: { index: true, follow: true },
  category: 'Electrical contractor',
};

export const viewport: Viewport = {
  themeColor: '#131927',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the pre-paint script sets data-theme on <html>.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-control focus:border focus:border-rule-strong focus:bg-surface focus:px-4 focus:py-3 focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCta />
      </body>
    </html>
  );
}
