// v2 QA: animated desktop pass (Lenis + GSAP live, wheel-driven),
// plus a mobile pass. Usage: node scripts/qa-v2.mjs [outdir]
import { chromium } from "playwright";

const OUT = process.argv[2] || "./qa-v2";
const BASE = "http://localhost:3000";

const browser = await chromium.launch();

// --- Desktop, full motion ---
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3200); // preloader + hero entrance

const shot = async (tag) => {
  await page.screenshot({ path: `${OUT}/desk-${tag}.png` });
  console.log("shot", tag);
};

await shot("hero-load");

// wheel through the pinned hero scrub
const wheel = async (ticks, dy = 400, settle = 700) => {
  for (let i = 0; i < ticks; i++) {
    await page.mouse.wheel(0, dy);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(settle);
};

await wheel(2); // ~800px into the pin
await shot("hero-scan-mid");
await wheel(3);
await shot("hero-scan-done");
await wheel(2);
await shot("marquee");
await wheel(3);
await shot("problem");
await wheel(4);
await shot("how-beat1");
await wheel(4);
await shot("how-beat2");
await wheel(4);
await shot("how-beat3");
await wheel(4);
await shot("how-beat4");
await wheel(4);
await shot("stride-start");
await wheel(4);
await shot("stride-mid");
await wheel(5);
await shot("stride-end");
await wheel(4);
await shot("dimensions");
await wheel(4);
await shot("pricing");
await wheel(4);
await shot("cta");
await wheel(4);
await shot("footer");
await page.close();

// --- Mobile pass ---
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(BASE, { waitUntil: "networkidle" });
await mob.waitForTimeout(3200);
await mob.screenshot({ path: `${OUT}/mob-hero.png` });
const H = await mob.evaluate(() => document.documentElement.scrollHeight);
for (const [tag, frac] of [
  ["problem", 0.14],
  ["how", 0.3],
  ["stride", 0.55],
  ["dimensions", 0.72],
  ["cta", 0.92],
]) {
  await mob.evaluate((y) => window.scrollTo(0, y), Math.round(H * frac));
  await mob.waitForTimeout(1300);
  await mob.screenshot({ path: `${OUT}/mob-${tag}.png` });
  console.log("shot mob", tag);
}
await mob.close();
await browser.close();
console.log("done");
