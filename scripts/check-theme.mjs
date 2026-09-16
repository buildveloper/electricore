import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:3111';
const CHROME =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 1500));

const read = () =>
  page.evaluate(() => {
    const lum = (id) => {
      const el = document.getElementById(id);
      const [r, g, b] = getComputedStyle(el)
        .backgroundColor.match(/\d+(\.\d+)?/g)
        .map(Number);
      return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    };
    const sw = document.querySelector('button[role="switch"]');
    return {
      theme: document.documentElement.dataset.theme,
      switchAria: sw?.getAttribute('aria-checked'),
      galleryBand: lum('work'),
      servicesBand: lum('services'),
      themeColorMeta: document.querySelector('meta[name="theme-color"]')?.content,
    };
  });

console.log('initial  ', JSON.stringify(await read()));

await page.evaluate(() => document.querySelector('button[role="switch"]').click());
await new Promise((r) => setTimeout(r, 900));
console.log('toggled  ', JSON.stringify(await read()));

await page.reload({ waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 1300));
console.log('persisted', JSON.stringify(await read()));

await page.evaluate(() => document.querySelector('button[role="switch"]').click());
await new Promise((r) => setTimeout(r, 900));
console.log('back     ', JSON.stringify(await read()));

await browser.close();
