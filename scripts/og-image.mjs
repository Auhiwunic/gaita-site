// Renders the OG card HTML to src/app/opengraph-image.png (1200x630).
// Usage: node scripts/og-image.mjs <path-to-og-card.html>
import { chromium } from "playwright";
import path from "node:path";

const htmlPath = process.argv[2];
if (!htmlPath) throw new Error("pass the og-card.html path");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto("file://" + path.resolve(htmlPath), {
  waitUntil: "networkidle",
});
await page.waitForTimeout(400);
await page.screenshot({ path: "src/app/opengraph-image.png" });
await browser.close();
console.log("wrote src/app/opengraph-image.png");
