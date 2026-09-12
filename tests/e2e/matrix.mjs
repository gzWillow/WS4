/**
 * Template browser acceptance matrix (see info.md).
 * Runs against a served build (dev server or `vite preview`).
 *
 *   BASE_URL=http://localhost:4173 npm run test:e2e
 *
 * Best-effort: skips cleanly (exit 0) when playwright-core or a chromium
 * executable is unavailable in the current environment.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

function findChromium() {
  const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright')
  const candidates = []
  try {
    for (const dir of fs.readdirSync(cache)) {
      for (const rel of [
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
        'chrome-linux/chrome',
        'chrome-win/chrome.exe',
      ]) {
        const p = path.join(cache, dir, rel)
        if (fs.existsSync(p)) candidates.push(p)
      }
    }
  } catch {
    return null
  }
  return candidates.sort().pop() ?? null
}

const EXE = findChromium()
if (!EXE) {
  console.log('SKIP  no chromium executable found in ~/Library/Caches/ms-playwright — e2e matrix skipped')
  process.exit(0)
}
const { chromium } = await import('playwright-core').catch(() => {
  console.log('SKIP  playwright-core not installed — e2e matrix skipped')
  process.exit(0)
})

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });

  /* ---------- desktop sample flow ---------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const consoleErrors = [];
    page.on('pageerror', (e) => consoleErrors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    check('desktop: hero renders with title', await page.isVisible('.hero__title'));
    check('desktop: hero ambience canvas renders', await page.isVisible('.hero__fx'));
    const cols = await page.evaluate(() => {
      const grid = document.querySelector('.product-grid');
      return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
    });
    check('desktop: product grid is 4 columns', cols === 4, `cols=${cols}`);

    // quick add -> drawer opens, badge = 1
    await page.hover('.product-card');
    await page.click('.product-card .product-card__quick button:last-child');
    await page.waitForTimeout(600);
    check('desktop: quick add opens cart drawer', await page.isVisible('.drawer--right.is-open'));
    check('desktop: cart badge = 1', (await page.textContent('.cart-count')) === '1');

    // qty + then persistence after reload
    await page.click('.cart-item [aria-label="Increase quantity"]');
    await page.waitForTimeout(400);
    const subtotal1 = await page.textContent('.drawer__foot .totals span:last-child');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    check('persistence: badge survives reload', (await page.textContent('.cart-count')) === '2');
    await page.click('.site-header__icons button[aria-label="Open cart"]');
    await page.waitForTimeout(500);
    const subtotal2 = await page.textContent('.drawer__foot .totals span:last-child');
    check('persistence: subtotal survives reload', subtotal1 === subtotal2, `${subtotal1} vs ${subtotal2}`);

    // corrupt localStorage recovery
    await page.evaluate(() => localStorage.setItem('fashion-storefront-cart-v1', '{broken json'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const recovered = await page.evaluate(() => !document.querySelector('.config-error'));
    check('corrupt persistence: app recovers without crash', recovered);
    await page.evaluate(() => localStorage.removeItem('fashion-storefront-cart-v1'));

    // countdown non-negative
    const cd = await page.textContent('.announcement__countdown');
    check('countdown: renders non-negative', !cd.includes('-'), cd.slice(0, 40));

    // keyboard: focus cart button, open with Enter, Escape closes, focus returns
    await page.focus('.site-header__icons button[aria-label="Open cart"]');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    const drawerOpen = await page.isVisible('.drawer--right.is-open');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const drawerClosed = !(await page.isVisible('.drawer--right.is-open'));
    const focusBack = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    check('keyboard: Enter opens, Escape closes, focus returned', drawerOpen && drawerClosed && focusBack === 'Open cart', `focus=${focusBack}`);

    // broken media fallback
    await page.evaluate(() => {
      const img = document.querySelector('.product-card__media img');
      img.removeAttribute('srcset');
      img.src = '/media/definitely-missing.jpg';
    });
    await page.waitForTimeout(700);
    check('broken media: fallback rendered', await page.isVisible('.product-card__media .img-fallback'));

    check('desktop: no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
    await page.close();
  }

  /* ---------- collection + PDP ---------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + '/collection', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const total = await page.$$eval('.product-card', (els) => els.length);
    await page.click('.chip:has-text("Accessories")');
    await page.waitForTimeout(400);
    const acc = await page.$$eval('.product-card', (els) => els.length);
    check('collection: chip filter narrows grid', acc < total && acc === 3, `${total} -> ${acc}`);
    await page.selectOption('.sort-box select', 'price-asc');
    await page.waitForTimeout(400);
    const first = await page.textContent('.product-card .product-card__price');
    check('collection: sort price-asc', first.trim().startsWith('$270.00'), first.trim());
    await page.click('.chip:has-text("All")');
    await page.waitForTimeout(400);
    check('collection: reset to all', (await page.$$eval('.product-card', (els) => els.length)) === total);

    // sale filter via URL
    await page.goto(BASE + '/collection?sale=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const saleCount = await page.$$eval('.product-card', (els) => els.length);
    check('collection: ?sale=1 filters compare-at products', saleCount === 2, `count=${saleCount}`);

    // PDP: variant flow
    await page.goto(BASE + '/product/dune-coat', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.click('.color-dots .swatch[aria-label="Black"]');
    await page.click('.size-row button:has-text("L")');
    await page.click('.qty-box button[aria-label="+"]');
    await page.click('.buy-row .btn');
    await page.waitForTimeout(600);
    check('pdp: add 2x variant -> badge 2', (await page.textContent('.cart-count')) === '2');
    await page.keyboard.press('Escape');

    // PDP: soldout disabled
    await page.goto(BASE + '/product/shadow-coat', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const disabled = await page.isDisabled('.buy-row .btn');
    check('pdp: soldout product disables add-to-cart', disabled);

    // PDP: accordion toggles
    await page.click('.accordion__item:nth-child(2) .accordion__head');
    await page.waitForTimeout(300);
    check('pdp: accordion opens', await page.isVisible('.accordion__item:nth-child(2) .accordion__body'));

    // unknown product + unknown route
    await page.goto(BASE + '/product/ghost-item', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    check('missing product: message shown', await page.isVisible('text=no longer available'));
    await page.goto(BASE + '/no-such-page', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    check('unknown route: not-found page', await page.isVisible('text=Page not found'));
    await page.close();
  }

  /* ---------- mobile ---------- */
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check('mobile: no horizontal overflow', overflow <= 0, `overflow=${overflow}px`);
    const cols = await page.evaluate(() => {
      const grid = document.querySelector('.product-grid');
      return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
    });
    check('mobile: product grid is 2 columns', cols === 2, `cols=${cols}`);
    await page.click('.burger');
    await page.waitForTimeout(500);
    check('mobile: menu drawer opens', await page.isVisible('.drawer--left.is-open'));
    await page.keyboard.press('Escape');
    await page.close();
  }

  /* ---------- reduced motion ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.marquee__track')).animationName);
    check('reduced motion: marquee animation disabled', anim === 'none', `animation=${anim}`);
    const fxStatic = await page.evaluate(() => document.querySelector('.hero__fx')?.getAttribute('data-static') === 'true');
    check('reduced motion: hero ambience is a static frame', fxStatic);
    await ctx.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n== matrix: ${results.length - failed}/${results.length} passed ==`);
  process.exit(failed ? 1 : 0);
})();
