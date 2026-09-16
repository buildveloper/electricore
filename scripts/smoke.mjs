import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:3111';
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const results = [];
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 240000,
  args: ['--no-sandbox', '--hide-scrollbars', '--disable-dev-shm-usage'],
});

const problems = [];

async function newPage(width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  // Pin the preference so the theme under test is never whatever headless
  // Chrome happens to report.
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console: ${msg.text()}`);
    if (msg.type() === 'warning' && /hydrat|validateDOMNesting/i.test(msg.text())) {
      problems.push(`react warning: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) =>
    problems.push(`requestfailed: ${req.url()} ${req.failure()?.errorText ?? ''}`),
  );
  return page;
}

// ---------------------------------------------------------------- desktop ----
const page = await newPage(1440, 1000);
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
await sleep(1200);

const heroText = await page.$eval('h1', (el) => el.textContent?.replace(/\s+/g, ' ').trim());
record('h1 renders', heroText?.includes('Power you can trust') === true, heroText?.slice(0, 48));

const singleH1 = await page.$$eval('h1', (els) => els.length);
record('exactly one h1', singleH1 === 1, `count=${singleH1}`);

// Entrance animation must finish, leaving content opaque.
const heroOpacity = await page.$eval('h1', (el) => getComputedStyle(el).opacity);
record('hero entrance completes (opacity 1)', heroOpacity === '1', `opacity=${heroOpacity}`);

// Skip link is the first focusable element and becomes visible on focus.
await page.keyboard.press('Tab');
const skip = await page.evaluate(() => {
  const el = document.activeElement;
  return el ? { tag: el.tagName, text: el.textContent?.trim().slice(0, 20) } : null;
});
record('first tab stop is skip link', skip?.text === 'Skip to content', JSON.stringify(skip));

// Visibility must be judged by layout, not by the element's own display value:
// a child of a hidden wrapper still reports its own computed display.
const headerCta = () =>
  page.evaluate(() => {
    const link = [...document.querySelectorAll('header a')].find(
      (a) => a.textContent?.trim() === 'Get a Free Estimate',
    );
    if (!link) return { rendered: false };
    const r = link.getBoundingClientRect();
    return { rendered: r.width > 0 && r.height > 0, width: Math.round(r.width) };
  });

const ctaDesktop = await headerCta();
record('header CTA visible on desktop', ctaDesktop.rendered === true, JSON.stringify(ctaDesktop));

// ---------------------------------------------------------------- lightbox ---
await page.evaluate(() => document.getElementById('work')?.scrollIntoView());
await sleep(700);

const tileCount = await page.$$eval('#work button[class*="aspect-"]', (els) => els.length);
record('gallery renders every photo', tileCount === 16, `tiles=${tileCount} (4 + 8 + 4, no project exceeds the 8 tile cap)`);

const tileAlts = await page.$$eval('#work img', (els) => els.map((el) => el.getAttribute('alt') ?? ''));
record(
  'every gallery image has descriptive alt text',
  tileAlts.length === 16 && tileAlts.every((alt) => alt.length > 20),
  `first="${tileAlts[0]}"`,
);

await page.click('#work button[class*="aspect-"]');
await sleep(700);
const dialogOpen = await page.$('[role="dialog"][aria-modal="true"]');
record('lightbox opens on tile click', dialogOpen !== null);

const readCounter = (p) =>
  p.evaluate(() => {
    const match = [...document.querySelectorAll('[role="dialog"] p')].find((el) =>
      /^\d+\s*\/\s*\d+$/.test(el.textContent?.trim() ?? ''),
    );
    return match?.textContent?.trim() ?? null;
  });

const counter = await readCounter(page);
record('lightbox shows counter', counter === '1 / 4', `counter="${counter}"`);

await page.keyboard.press('ArrowRight');
await sleep(450);
const counter2 = await readCounter(page);
record('arrow key advances photo', counter2 === '2 / 4', `counter="${counter2}"`);

await page.keyboard.press('Escape');
await sleep(500);
const dialogClosed = await page.$('[role="dialog"][aria-modal="true"]');
record('escape closes lightbox', dialogClosed === null);

const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
record('body scroll restored after close', bodyOverflow !== 'hidden', `overflow=${bodyOverflow}`);

// ------------------------------------------------------------------- form ----
await page.evaluate(() => document.getElementById('quote')?.scrollIntoView());
await sleep(600);

// Submitting through the DOM keeps this deterministic: a synthetic click races
// the page's smooth-scroll animation and can miss the button.
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  document.getElementById('quote')?.scrollIntoView();
});
await page.type('#name', 'A');
await page.type('#phone', '123');
await page.type('#message', 'short');
await page.evaluate(() => document.querySelector('form')?.requestSubmit());
await sleep(900);
const inlineError = await page.$eval('#name-error', (el) => el.textContent?.trim()).catch(() => null);
record('client validation blocks bad input', Boolean(inlineError), `error="${inlineError}"`);

// Valid submission reaches the API and shows the confirmation.
await page.evaluate(() => {
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('message').value = '';
});
await page.type('#name', 'Wayne Matthews');
await page.type('#phone', '(910) 584-2513');
await page.select('#service', 'Panel upgrade or replacement');
await page.type('#message', 'Panel is full and breakers keep tripping in a 1970s ranch house.');
await Promise.all([
  page.waitForResponse((res) => res.url().includes('/api/lead'), { timeout: 15000 }),
  page.click('form button[type="submit"]'),
]);
await sleep(900);
const success = await page.$eval('#quote', (el) => el.textContent ?? '');
record('valid submission shows confirmation', success.includes('Request received'));
record('confirmation names the owner', success.includes('Wayne Matthews'));

// ------------------------------------------------- responsive overflow scan --
for (const width of [320, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await sleep(450);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  record(`no horizontal overflow at ${width}px`, overflow <= 1, `overflow=${overflow}px`);
}

// ----------------------------------------------------------- mobile menu -----
const mobile = await newPage(390, 844);
await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
await sleep(900);

const mobileCta = await mobile.evaluate(() => {
  const link = [...document.querySelectorAll('header a')].find(
    (a) => a.textContent?.trim() === 'Get a Free Estimate',
  );
  if (!link) return { rendered: false };
  const r = link.getBoundingClientRect();
  return { rendered: r.width > 0 && r.height > 0 };
});
record('header CTA hidden on small screens', mobileCta.rendered === false, JSON.stringify(mobileCta));

await mobile.click('button[aria-controls="mobile-menu"]');
await sleep(600);
const menuOpen = await mobile.$('[id="mobile-menu"]');
record('mobile menu opens', menuOpen !== null);

const menuLocked = await mobile.evaluate(() => getComputedStyle(document.body).overflow);
record('body scroll locks with menu open', menuLocked === 'hidden', `overflow=${menuLocked}`);

await mobile.keyboard.press('Escape');
await sleep(600);
const menuClosed = await mobile.$('[id="mobile-menu"]');
record('escape closes mobile menu', menuClosed === null);

const focusReturned = await mobile.evaluate(
  () => document.activeElement?.getAttribute('aria-controls') === 'mobile-menu',
);
record('focus returns to menu button', focusReturned === true);

// ---- sticky action bar, which only exists below the md breakpoint ----
const barState = () =>
  mobile.evaluate(() => {
    const link = [...document.querySelectorAll('a')].find(
      (a) => a.textContent?.trim() === 'Call Now',
    );
    if (!link) return { found: false, visible: false, top: 0 };
    const r = link.getBoundingClientRect();
    return {
      found: true,
      visible: r.top < window.innerHeight && r.bottom > 0,
      top: Math.round(r.top),
    };
  });

const barTop = await barState();
record('sticky CTA bar hidden at top of page', barTop.found === true && barTop.visible === false, JSON.stringify(barTop));

await mobile.evaluate(() => {
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 2400);
});
await sleep(900);
const barScrolled = await barState();
record('sticky CTA bar slides in after the hero', barScrolled.visible === true, JSON.stringify(barScrolled));

const barNearEnd = await mobile.evaluate(async () => {
  // Instant jump: smooth scrolling over a very tall page outruns the wait below.
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, document.documentElement.scrollHeight);
  await new Promise((r) => setTimeout(r, 1400));
  const link = [...document.querySelectorAll('a')].find((a) => a.textContent?.trim() === 'Call Now');
  const r = link.getBoundingClientRect();
  return { visible: r.top < window.innerHeight && r.bottom > 0 };
});
record('sticky CTA bar steps aside near the footer', barNearEnd.visible === false, JSON.stringify(barNearEnd));

// ---------------------------------------------------------------- api edge ---
// ------------------------------------------------- theme + motion system ---
const luminanceOf = (id) =>
  page.evaluate((elementId) => {
    const el = document.getElementById(elementId);
    const [r, g, b] = getComputedStyle(el)
      .backgroundColor.match(/\d+(\.\d+)?/g)
      .map(Number);
    return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  }, id);

const themeNow = () => page.evaluate(() => document.documentElement.dataset.theme);

// Clicks must not race the page's smooth scrolling.
const clickToggle = async () => {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  });
  await sleep(300);
  await page.click('button[role="switch"]');
  await sleep(700);
};

// Dark theme: the gallery band inverts to light, the rest stays dark.
const initialTheme = await themeNow();
record(
  'theme resolves to a concrete value',
  initialTheme === 'dark' || initialTheme === 'light',
  `theme=${initialTheme}`,
);
const darkBands = { work: await luminanceOf('work'), services: await luminanceOf('services') };
record(
  'gallery band inverts against the dark theme',
  darkBands.work > 180 && darkBands.services < 60,
  JSON.stringify(darkBands),
);

// Services cells must finish fully visible after the stagger.
await page.evaluate(() => document.getElementById('services')?.scrollIntoView());
await sleep(1400);
const cellOpacities = await page.$$eval('#services article', (els) =>
  els.map((el) => Number(getComputedStyle(el).opacity)),
);
record(
  'services cards settle fully visible',
  cellOpacities.length === 6 && cellOpacities.every((o) => o === 1),
  `cells=${cellOpacities.length} min=${Math.min(...cellOpacities)}`,
);

// Credential badges pulse once on entering view.
await page.evaluate(() =>
  document.querySelector('section[aria-label="Credentials"]')?.scrollIntoView(),
);
await sleep(500);
const pulsing = await page.$$eval('section[aria-label="Credentials"] .badge-pulse', (els) => els.length);
record('credential badges pulse on enter view', pulsing === 3, `pulsing=${pulsing}`);

// Parallax backdrop is a real transform, not a static layer.
const parallax = await page.evaluate(() => {
  const pattern = document.getElementById('services-circuit');
  const layer = pattern?.closest('div[style]');
  return layer ? getComputedStyle(layer).transform : 'missing';
});
record('circuit backdrop parallaxes on scroll', parallax.startsWith('matrix'), parallax.slice(0, 32));

// Toggle to light: the inversion must flip and the choice must persist.
await clickToggle();
const lightTheme = await themeNow();
const lightBands = { work: await luminanceOf('work'), services: await luminanceOf('services') };
record('toggle switches to light theme', lightTheme === 'light', `theme=${lightTheme}`);
record(
  'gallery band inverts against the light theme',
  lightBands.work < 60 && lightBands.services > 180,
  JSON.stringify(lightBands),
);

await page.reload({ waitUntil: 'networkidle2' });
await sleep(900);
const persisted = await themeNow();
record('theme choice persists across reload', persisted === 'light', `theme=${persisted}`);
await clickToggle();
const backToDark = await themeNow();
record('toggle returns to dark theme', backToDark === 'dark', `theme=${backToDark}`);

// --------------------------------------------------------- reduced motion ---
const calm = await newPage(1440, 1000);
await calm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await calm.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
await sleep(1200);

const calmHero = await calm.$eval('h1', (el) => getComputedStyle(el).opacity);
record('reduced motion: hero content still visible', calmHero === '1', `opacity=${calmHero}`);

await calm.evaluate(() =>
  document.querySelector('section[aria-label="Credentials"]')?.scrollIntoView(),
);
await sleep(700);
const calmPulse = await calm.$$eval('section[aria-label="Credentials"] .badge-pulse', (els) => els.length);
record('reduced motion: badge pulse suppressed', calmPulse === 0, `pulsing=${calmPulse}`);

const calmOpacity = await calm.$eval('#services article', (el) => getComputedStyle(el).opacity);
record('reduced motion: service cards visible without animation', calmOpacity === '1', `opacity=${calmOpacity}`);

const apiGet = await fetch(`${BASE}/api/lead`).then((r) => r.status);
record('GET /api/lead rejected', apiGet === 405, `status=${apiGet}`);

const apiBad = await fetch(`${BASE}/api/lead`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'x', phone: '1', service: '', message: 'y' }),
}).then((r) => r.status);
record('invalid payload rejected', apiBad === 422, `status=${apiBad}`);

const apiHoneypot = await fetch(`${BASE}/api/lead`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Spam Bot',
    phone: '9105550123',
    service: 'Something else',
    message: 'buy cheap widgets online now',
    company: 'bot-filled',
  }),
}).then((r) => r.json());
record('honeypot silently discarded', apiHoneypot.ok === true && !apiHoneypot.channels);

// An identified caller is throttled after a handful of rapid submissions.
const spoofed = { 'Content-Type': 'application/json', 'x-forwarded-for': '203.0.113.7' };
const body = JSON.stringify({
  name: 'Test Lead',
  phone: '9105550123',
  service: 'Something else',
  message: 'Rate limit probe with a long enough description.',
});
const statuses = [];
for (let i = 0; i < 8; i++) {
  statuses.push(await fetch(`${BASE}/api/lead`, { method: 'POST', headers: spoofed, body }).then((r) => r.status));
}
record(
  'rate limits an identified caller',
  statuses.includes(429) && statuses[0] === 200,
  `statuses=${statuses.join(',')}`,
);

await browser.close();

console.log('\n--- console/network problems ---');
console.log(problems.length ? problems.join('\n') : 'none');

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length || problems.length) process.exitCode = 1;
