// Visual QA harness for the Gaita site. Scroll-accurate section captures.
// Usage: node qa-shots.mjs [outdir]
import { chromium } from "playwright";

const OUT = process.argv[2] || "./qa";
const BASE = "http://localhost:3000";

const browser = await chromium.launch();

async function capture(name, { width, height, steps }) {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: "reduce", // disables Lenis; native scroll = deterministic
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  for (const s of steps) {
    if (s.sel) {
      await page
        .locator(s.sel)
        .first()
        .scrollIntoViewIfNeeded()
        .catch(() => {});
      if (s.nudge)
        await page.evaluate((n) => window.scrollBy(0, n), s.nudge);
    } else if (s.yFrac !== undefined) {
      await page.evaluate((f) => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.round(h * f));
      }, s.yFrac);
    } else if (s.yAbs !== undefined) {
      await page.evaluate((y) => window.scrollTo(0, y), s.yAbs);
    }
    await page.waitForTimeout(s.wait ?? 1100); // let reveals finish
    await page.screenshot({ path: `${OUT}/${name}-${s.tag}.png` });
    console.log(`shot ${name}-${s.tag}`);
  }
  await page.close();
}

// Desktop pass: every section, plus the 3 pinned states of #how
await capture("desk", {
  width: 1280,
  height: 800,
  steps: [
    { tag: "hero", yAbs: 0 },
    { tag: "how-1", sel: "#how", wait: 1400 },
    {
      tag: "how-2",
      yAbs: await (async () => 0)(), // placeholder, replaced below by yFrac steps
      yFrac: undefined,
      sel: "#how",
      nudge: 900,
      wait: 1400,
    },
    { tag: "how-3", sel: "#how", nudge: 1750, wait: 1400 },
    { tag: "receipts", sel: "#features", nudge: -700, wait: 1400 },
    { tag: "feat-metrics", sel: "#features", nudge: 200, wait: 1400 },
    { tag: "feat-coach", sel: "#features", nudge: 1100, wait: 1400 },
    { tag: "feat-run", sel: "#features", nudge: 2000, wait: 1400 },
    { tag: "pricing", sel: "#pricing", wait: 1400 },
    { tag: "access", sel: "#access", wait: 1400 },
    { tag: "footer", sel: "footer", wait: 1200 },
  ],
});

// Mobile pass
await capture("mob", {
  width: 390,
  height: 844,
  steps: [
    { tag: "hero", yAbs: 0 },
    { tag: "how", sel: "#how", wait: 1400 },
    { tag: "receipts", sel: "#features", nudge: -900, wait: 1400 },
    { tag: "features", sel: "#features", wait: 1400 },
    { tag: "pricing", sel: "#pricing", wait: 1400 },
    { tag: "access", sel: "#access", wait: 1400 },
  ],
});

await browser.close();
console.log("done");
