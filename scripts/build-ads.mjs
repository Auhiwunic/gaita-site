// Renders a set of high-quality Gaita ad creatives (1:1, 4:5, 9:16) to PNG.
// HTML/CSS -> headless Chrome element screenshots. Fonts inlined, screenshots
// embedded as data URIs.
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "ads");
mkdirSync(OUT, { recursive: true });

const b64 = (p) => readFileSync(resolve(ROOT, p)).toString("base64");
const font = (p) => `data:font/woff2;base64,${b64(p)}`;
const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const img = (p) => `data:${MIME[p.split(".").pop()]};base64,${b64(p)}`;

const archivo = font("src/fonts/Archivo-Variable.woff2");
const sw400 = font("src/fonts/Switzer-400.woff2");
const sw600 = font("src/fonts/Switzer-600.woff2");

const SHOTS = {
  analyze: img("public/app/analyze.png"),
  metrics: img("public/app/metrics.png"),
  coach: img("public/app/coach.png"),
  run: img("public/app/run.png"),
};
const PHOTO_MOTION = img("public/photos/33995240.jpg");

const wm = (cls) => `<span class="wm ${cls}">GAITA</span>`;
const stage = (src) => `<div class="stage"><div class="device"><img src="${src}"/></div></div>`;

// Stacked device ad: wordmark + headline + sub on top, whole phone contained below.
const deviceAd = ({ name, w, h, dark, kicker, headline, headSize, sub, showCta, src }) => ({
  name, w, h, html: `
  <div class="ad ${dark ? "black" : "bone"}" style="width:${w}px;height:${h}px">
    ${dark ? '<div class="glow"></div>' : ""}
    <div class="pad col">
      <div class="row-top">${wm(dark ? "cyan" : "ink")}${kicker ? `<span class="meta ${dark ? "dim" : ""}">${kicker}</span>` : ""}</div>
      <h1 class="disp ${dark ? "light" : "ink"}" style="font-size:${headSize}px">${headline}</h1>
      <p class="sub ${dark ? "dim" : ""}">${sub}</p>
      ${stage(src)}
      ${showCta ? `<div class="foot"><span class="pill">Get early access</span><span class="url ${dark ? "cyan" : "ink-soft"}">gaita-site.vercel.app</span></div>` : `<div class="foot"><span class="url ${dark ? "cyan" : "ink-soft"}">gaita-site.vercel.app</span></div>`}
    </div>
  </div>` });

const ads = [
  deviceAd({ name: "sq-1-stride", w: 1080, h: 1080, dark: false, kicker: "Running form coach",
    headline: "See your stride.", headSize: 66,
    sub: "Every angle a coach looks for, graded on your phone.", src: SHOTS.analyze }),
  deviceAd({ name: "sq-2-angles", w: 1080, h: 1080, dark: true, kicker: "02 / Full metrics",
    headline: "Eight angles. One video.", headSize: 62,
    sub: "The full read from a single clip.", src: SHOTS.metrics }),
  deviceAd({ name: "portrait-3-blind", w: 1080, h: 1350, dark: true, kicker: "Form · gait · power",
    headline: "Stop training<br/>blind.", headSize: 104,
    sub: "Every run, zero feedback on your form. Until now.", showCta: true, src: SHOTS.analyze }),
  deviceAd({ name: "portrait-4-coach", w: 1080, h: 1350, dark: false, kicker: "03 / Coach",
    headline: "A coach in<br/>your ear.", headSize: 100,
    sub: "Ask anything. It knows your last run and your gait.", showCta: true, src: SHOTS.coach }),

  // 9:16 — Film one run (photo)
  { name: "story-5-filmone", w: 1080, h: 1920, html: `
    <div class="ad" style="width:1080px;height:1920px;position:relative;overflow:hidden;background:#0d0d0c">
      <img class="bg" src="${PHOTO_MOTION}"/>
      <div class="scrim"></div>
      <div class="pad" style="justify-content:space-between">
        <div class="row-top">${wm("light")}</div>
        <div>
          <h1 class="disp light" style="font-size:150px">Film<br/>one run.</h1>
          <p class="sub dim" style="max-width:760px;margin-top:14px">Your whole coaching staff, in your pocket. Free, on device.</p>
          <div class="foot" style="margin-top:40px"><span class="pill">Get early access</span><span class="url cyan">gaita-site.vercel.app</span></div>
        </div>
      </div>
    </div>` },

  // 1:1 — Free forever (type-led)
  { name: "sq-6-free", w: 1080, h: 1080, html: `
    <div class="ad bone" style="width:1080px;height:1080px">
      <div class="pad" style="justify-content:center">
        <div class="row-top" style="position:absolute;top:70px;left:70px;right:70px">${wm("ink")}<span class="meta">100% on device</span></div>
        <h1 class="disp ink" style="font-size:184px">Free<br/>forever.</h1>
        <p class="sub" style="font-size:40px;margin-top:22px;max-width:820px">Running form analysis, all on your phone. No paywall, not a trial. Your video never leaves your device.</p>
        <span class="url ink-soft" style="position:absolute;bottom:70px;left:70px">gaita-site.vercel.app</span>
      </div>
    </div>` },
];

const css = `
  @font-face{font-family:'Archivo';src:url(${archivo}) format('woff2');font-weight:100 900;font-stretch:62% 125%;}
  @font-face{font-family:'Switzer';src:url(${sw400}) format('woff2');font-weight:400;}
  @font-face{font-family:'Switzer';src:url(${sw600}) format('woff2');font-weight:600;}
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#333}
  .ad{position:relative;overflow:hidden;background:#f1f1ef}
  .bone{background:#f1f1ef}.black{background:#0d0d0c}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.04)}
  .scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,8,7,.92) 6%,rgba(8,8,7,.4) 40%,rgba(8,8,7,.15))}
  .glow{position:absolute;left:50%;top:30%;width:1200px;height:1200px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(0,206,209,.20),rgba(0,206,209,0) 62%)}
  .pad{position:absolute;inset:0;padding:70px;display:flex;flex-direction:column;justify-content:flex-start}
  .pad.col{gap:14px}
  .row-top{display:flex;align-items:baseline;justify-content:space-between}
  .wm{font-family:'Archivo';font-weight:800;font-stretch:93%;text-transform:uppercase;letter-spacing:-.01em;font-size:40px}
  .disp{font-family:'Archivo';font-weight:660;font-stretch:88%;text-transform:uppercase;letter-spacing:-.025em;line-height:.9;text-wrap:balance}
  .meta{font-family:'Archivo';font-weight:500;text-transform:uppercase;letter-spacing:.14em;font-size:24px;color:#6d6d68}
  .meta.dim{color:#8f8f8a}
  .sub{font-family:'Switzer';font-weight:400;font-size:34px;line-height:1.3;color:#565651;max-width:760px}
  .sub.dim{color:#a9a9a4}
  .url{font-family:'Archivo';font-weight:600;text-transform:uppercase;letter-spacing:.13em;font-size:24px}
  .ink{color:#141412}.light{color:#f5f5f3}.cyan{color:#00CED1}.ink-soft{color:#6d6d68}
  .pill{display:inline-block;background:#00CED1;color:#05343a;font-family:'Archivo';font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:26px;padding:20px 42px;border-radius:999px}
  .foot{display:flex;align-items:center;gap:26px;flex-wrap:wrap}
  .stage{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:14px 0 4px}
  .device{height:100%;padding:11px;background:#141412;border-radius:46px;box-shadow:0 40px 90px rgba(0,0,0,.34)}
  .device img{display:block;height:100%;width:auto;border-radius:36px}
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  ${ads.map(a => `<div class="frame" data-name="${a.name}">${a.html}</div>`).join("\n")}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "load", timeout: 120000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const nodes = await page.$$(".frame > .ad");
for (let i = 0; i < nodes.length; i++) {
  await nodes[i].screenshot({ path: resolve(OUT, `${ads[i].name}.png`) });
  console.log("wrote", ads[i].name + ".png");
}
await browser.close();
console.log("done ->", OUT);
