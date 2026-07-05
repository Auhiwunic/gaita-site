// Quick capture of the subpages.
import { chromium } from "playwright";

const OUT = process.argv[2] || "./qa";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce",
});
for (const p of ["privacy", "terms", "contact", "partnerships"]) {
  await page.goto(`http://localhost:3000/${p}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/page-${p}.png` });
  console.log(`shot ${p}`);
}
await browser.close();
