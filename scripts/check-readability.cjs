/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS browser check. */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');

const routes = ['/', '/classes', '/services', '/products', '/work', '/company', '/contact', '/insights', '/privacy', '/terms', '/services/websites', '/products/bridgelabs'];
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
const motion = '.motion-reveal, .motion-rise, .reveal-word, .rise-word, .split-head, .rise-head';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  fs.mkdirSync('.next/readability', { recursive: true });
  try {
    for (const mode of [
      { width: 1440, height: 1000, theme: 'light' },
      { width: 390, height: 844, theme: 'dark' },
      { width: 390, height: 844, theme: 'light', reducedMotion: 'reduce' },
      { width: 1440, height: 1000, theme: 'light', javaScriptEnabled: false },
    ]) {
      const context = await browser.newContext({ viewport: mode, javaScriptEnabled: mode.javaScriptEnabled, reducedMotion: mode.reducedMotion });
      await context.addInitScript(theme => localStorage.setItem('codastra-theme', theme), mode.theme);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const route of routes) {
        const response = await page.goto(base + route);
        assert.equal(response.status(), 200, route);
        const escapedVeils = await page.locator('[aria-hidden="true"] > div[style*="color-mix"]').evaluateAll(nodes =>
          nodes.filter(node => getComputedStyle(node.parentElement).isolation !== 'isolate').length);
        assert.equal(escapedVeils, 0, `${route}: background veil can paint over content`);
        for (const fraction of [0, 0.35, 0.7, 1]) {
          await page.evaluate(f => window.scrollTo({ top: f * document.body.scrollHeight, behavior: 'instant' }), fraction);
          const failures = await page.locator(motion).evaluateAll(nodes => nodes.filter(node => {
            const css = getComputedStyle(node);
            return css.opacity !== '1' || css.filter !== 'none';
          }).map(node => node.className));
          assert.deepEqual(failures, [], `${route}: dimmed or blurred reveal`);
        }
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          headingSize: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
        }));
        assert.equal(layout.overflow, false, `${route}: horizontal overflow`);
        assert.ok(layout.headingSize >= 28, `${route}: heading lost its size (${layout.headingSize})`);
        if (route === '/classes') {
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.waitForTimeout(700);
          await page.screenshot({ path: `.next/readability/classes-${mode.width}-${mode.theme}-${mode.javaScriptEnabled === false ? 'nojs' : mode.reducedMotion || 'motion'}.png` });
        }
      }
      assert.deepEqual(errors, [], 'Browser errors');
      console.log(`PASS: ${routes.length} routes, ${mode.width}px ${mode.theme}, ${mode.javaScriptEnabled === false ? 'no JS' : mode.reducedMotion || 'normal motion'}`);
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
