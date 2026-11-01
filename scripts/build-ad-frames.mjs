// Renders branded 9:16 (1080x1920) Instagram ad start-frames to PNG.
// Uses the real app screenshots + site photos + the MediaPipe skeleton.
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "ad-frames");
mkdirSync(OUT, { recursive: true });

const b64 = (p) => readFileSync(resolve(ROOT, p)).toString("base64");
const font = (p) => `data:font/woff2;base64,${b64(p)}`;
const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const img = (p) => `data:${MIME[p.split(".").pop()]};base64,${b64(p)}`;

const archivo = font("src/fonts/Archivo-Variable.woff2");
const sw400 = font("src/fonts/Switzer-400.woff2");
const sw600 = font("src/fonts/Switzer-600.woff2");

// --- MediaPipe skeleton (same landmarks as HeroSkeleton.tsx) ---
const W = 1800, H = 1100;
const P = {
  0: [0.448, 0.233], 7: [0.468, 0.221], 11: [0.475, 0.297], 12: [0.508, 0.306],
  13: [0.478, 0.373], 15: [0.445, 0.385], 23: [0.489, 0.537], 24: [0.485, 0.546],
  25: [0.56, 0.706], 26: [0.409, 0.681], 27: [0.667, 0.764], 28: [0.393, 0.867],
  31: [0.684, 0.851], 32: [0.341, 0.884],
};
const BONES = [[7,11],[11,12],[11,13],[13,15],[11,23],[12,24],[23,24],[23,25],[25,27],[27,31],[24,26],[26,28],[28,32]];
const JOINTS = [11,12,13,15,23,24,25,26,27,28];
const px = (i) => [P[i][0] * W, P[i][1] * H];
const skeleton = () => `
  <svg class="skel" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
    <g style="filter:drop-shadow(0 2px 8px rgba(20,20,18,0.65))">
      ${BONES.map(([a,b]) => { const [x1,y1]=px(a),[x2,y2]=px(b);
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f5f5f3" stroke-width="6" stroke-linecap="round"/>`; }).join("")}
      ${JOINTS.map((i) => { const [x,y]=px(i);
        return `<g><circle cx="${x}" cy="${y}" r="11" fill="#f5f5f3"/><circle cx="${x}" cy="${y}" r="4.5" fill="#141412"/></g>`; }).join("")}
    </g>
  </svg>`;

// --- Frame builders ---
const photoHook = () => `
<div class="frame">
  <img class="bg gs" src="${img("public/photos/gait-sideview.webp")}"/>
  ${skeleton()}
  <div class="scrim-b"></div>
  <div class="pad">
    <div class="topbar"><span class="wm light">Gaita</span></div>
    <div class="bottom">
      <h1 class="disp ink" style="font-size:150px">Super AI<br/>coach</h1>
      <p class="url ink-soft">gaita-site.vercel.app</p>
    </div>
  </div>
</div>`;

const productWhite = (src, kicker, headline, sub) => `
<div class="frame bone">
  <div class="pad col">
    <div class="topbar">
      <span class="wm ink">Gaita</span>
      <span class="meta">${kicker}</span>
    </div>
    <div class="stage">
      <div class="device light-dev"><img src="${img(src)}"/></div>
    </div>
    <div class="bottom">
      <h1 class="disp ink" style="font-size:104px">${headline}</h1>
      <p class="sub">${sub}</p>
      <p class="url ink-soft">gaita-site.vercel.app</p>
    </div>
  </div>
</div>`;

const productBlack = (src, kicker, headline, sub) => `
<div class="frame black">
  <div class="glow"></div>
  <div class="pad col">
    <div class="topbar">
      <span class="wm cyan">Gaita</span>
      <span class="meta dim">${kicker}</span>
    </div>
    <div class="stage">
      <div class="device dark-dev"><img src="${img(src)}"/></div>
    </div>
    <div class="bottom">
      <h1 class="disp light" style="font-size:98px">${headline}</h1>
      <p class="sub dim">${sub}</p>
      <p class="url cyan-soft">gaita-site.vercel.app</p>
    </div>
  </div>
</div>`;

const photoMotion = () => `
<div class="frame">
  <img class="bg gs" src="${img("public/photos/33995240.jpg")}"/>
  <div class="scrim-b"></div>
  <div class="pad">
    <div class="topbar"><span class="wm ink">Gaita</span></div>
    <div class="bottom">
      <h1 class="disp ink" style="font-size:132px">Film one<br/>run</h1>
      <p class="sub">Your whole coaching staff, in your pocket.</p>
    </div>
  </div>
</div>`;

const ctaCard = () => `
<div class="frame">
  <img class="bg" src="${img("public/photos/332835.jpg")}"/>
  <div class="scrim-full"></div>
  <div class="pad center">
    <span class="wm light" style="font-size:56px;letter-spacing:.02em">Gaita</span>
    <h1 class="disp light" style="font-size:168px;margin-top:24px">Super AI<br/>coach</h1>
    <div class="pill">Get early access</div>
    <p class="url light" style="margin-top:36px">gaita-site.vercel.app</p>
  </div>
</div>`;

// Pure typographic statement frame (bone or black).
const textStatement = (bg, headline, sub, size = 150) => {
  const dark = bg === "black";
  return `
<div class="frame ${dark ? "black" : "bone"}">
  <div class="pad col">
    <div class="topbar"><span class="wm ${dark ? "cyan" : "ink"}">Gaita</span></div>
    <div class="stage" style="justify-content:flex-start;align-items:flex-start;flex-direction:column;gap:34px;padding-top:120px">
      <h1 class="disp ${dark ? "light" : "ink"}" style="font-size:${size}px">${headline}</h1>
      ${sub ? `<p class="sub ${dark ? "dim" : ""}" style="font-size:44px;max-width:840px">${sub}</p>` : ""}
    </div>
    <p class="url ${dark ? "cyan-soft" : "ink-soft"}">gaita-site.vercel.app</p>
  </div>
</div>`;
};

// Full-bleed photo statement, DARK treatment: overlay + dark scrim, white type.
const photoDark = (assetPath, headline, sub, size = 132) => `
<div class="frame">
  <img class="bg gs" src="${img(assetPath)}"/>
  <div class="overlay-dark"></div>
  <div class="scrim-b-dark"></div>
  <div class="pad">
    <div class="topbar"><span class="wm cyan">Gaita</span></div>
    <div class="bottom">
      <h1 class="disp light" style="font-size:${size}px">${headline}</h1>
      ${sub ? `<p class="sub dim">${sub}</p>` : ""}
    </div>
  </div>
</div>`;

// Full-bleed photo statement (any photo), bottom scrim + headline.
const photoStatement = (assetPath, headline, sub, size = 132, wm = "ink") => `
<div class="frame">
  <img class="bg gs" src="${img(assetPath)}"/>
  <div class="scrim-b"></div>
  <div class="pad">
    <div class="topbar"><span class="wm ${wm}">Gaita</span></div>
    <div class="bottom">
      <h1 class="disp ink" style="font-size:${size}px">${headline}</h1>
      ${sub ? `<p class="sub">${sub}</p>` : ""}
    </div>
  </div>
</div>`;

// Giant single-stat frame (bone or black), big value + label.
const statBig = (bg, kicker, value, label, sub) => {
  const dark = bg === "black";
  return `
<div class="frame ${dark ? "black" : "bone"}">
  ${dark ? '<div class="glow"></div>' : ""}
  <div class="pad col">
    <div class="topbar">
      <span class="wm ${dark ? "cyan" : "ink"}">Gaita</span>
      <span class="meta ${dark ? "dim" : ""}">${kicker}</span>
    </div>
    <div class="stage" style="flex-direction:column;gap:10px">
      <span class="disp cyan" style="font-size:520px;line-height:.8">${value}</span>
      <span class="meta ${dark ? "dim" : ""}" style="font-size:34px">${label}</span>
    </div>
    <div class="bottom">
      <h1 class="disp ${dark ? "light" : "ink"}" style="font-size:84px">${sub}</h1>
      <p class="url ${dark ? "cyan-soft" : "ink-soft"}">gaita-site.vercel.app</p>
    </div>
  </div>
</div>`;
};

const frames = [
  ["frame-1-hook", photoHook()],
  ["frame-2-analysis-white", productWhite("public/app/analyze.png", "01 / Form analysis", "See your stride", "Every angle a coach looks for, graded.")],
  ["frame-3-metrics-black", productBlack("public/app/metrics.png", "02 / Full metrics", "Eight angles.<br/>One video.", "The full read from a single clip.")],
  ["frame-4-coach-white", productWhite("public/app/coach.png", "03 / Coach chat", "A coach<br/>in your ear", "Ask anything. It knows your gait.")],
  ["frame-5-motion", photoMotion()],
  ["frame-6-cta", ctaCard()],
  // v2 additions — problem/offer beats for the 13.6s reel storyboard
  ["frame-7-blind", photoDark("public/photos/13636369.jpg", "You train<br/>blind", "Every run, zero feedback on your form.", 130)],
  ["frame-8-injuries", photoStatement("public/photos/33995240.jpg", "Guessing at<br/>injuries", "You feel the pain and hope it goes away.", 116)],
  ["frame-9-free-forever", textStatement("bone", "Free<br/>forever", "On device form analysis. No paywall, not a trial.", 168)],
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:'Archivo';src:url(${archivo}) format('woff2');font-weight:100 900;font-stretch:62% 125%;}
  @font-face{font-family:'Switzer';src:url(${sw400}) format('woff2');font-weight:400;}
  @font-face{font-family:'Switzer';src:url(${sw600}) format('woff2');font-weight:600;}
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#333}
  .frame{position:relative;width:1080px;height:1920px;overflow:hidden;background:#f1f1ef}
  .bone{background:#f1f1ef}.black{background:#0d0d0c}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%}
  .gs{filter:grayscale(1) contrast(1.03)}
  .skel{position:absolute;inset:0;width:100%;height:100%}
  .scrim-b{position:absolute;inset:0;background:linear-gradient(to top,#f1f1ef 12%,rgba(241,241,239,.72) 34%,rgba(241,241,239,0) 60%)}
  .overlay-dark{position:absolute;inset:0;background:rgba(10,10,9,.44)}
  .scrim-b-dark{position:absolute;inset:0;background:linear-gradient(to top,#0d0d0c 10%,rgba(13,13,12,.62) 32%,rgba(13,13,12,0) 60%)}
  .scrim-full{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,20,24,.35),rgba(8,20,24,.15) 40%,rgba(8,20,24,.55))}
  .glow{position:absolute;left:50%;top:44%;width:1200px;height:1200px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(0,206,209,.20),rgba(0,206,209,0) 62%)}
  .pad{position:absolute;inset:0;padding:70px 70px 84px;display:flex;flex-direction:column;justify-content:space-between}
  .pad.col{justify-content:flex-start}
  .pad.center{align-items:center;justify-content:center;text-align:center}
  .topbar{display:flex;align-items:baseline;justify-content:space-between}
  .stage{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:40px 0}
  .bottom{display:flex;flex-direction:column;gap:22px}
  .wm{font-family:'Archivo';font-weight:700;font-stretch:93%;text-transform:uppercase;letter-spacing:-.01em;font-size:44px}
  .disp{font-family:'Archivo';font-weight:650;font-stretch:90%;text-transform:uppercase;letter-spacing:-.02em;line-height:.9}
  .meta{font-family:'Archivo';font-weight:500;text-transform:uppercase;letter-spacing:.14em;font-size:26px;color:#6d6d68}
  .meta.dim{color:#8a8a86}
  .sub{font-family:'Switzer';font-weight:400;font-size:38px;line-height:1.35;color:#6d6d68;max-width:760px}
  .sub.dim{color:#a7a7a2}
  .url{font-family:'Archivo';font-weight:500;text-transform:uppercase;letter-spacing:.14em;font-size:26px}
  .ink{color:#141412}.light{color:#f5f5f3}.cyan{color:#00CED1}
  .ink-soft{color:#6d6d68}.cyan-soft{color:#00CED1}
  .device{border-radius:56px;padding:12px;background:#141412;box-shadow:0 40px 90px rgba(0,0,0,.28)}
  .device img{display:block;height:1220px;width:auto;border-radius:44px}
  .dark-dev{background:#26262a;box-shadow:0 40px 120px rgba(0,206,209,.18),0 20px 60px rgba(0,0,0,.6)}
  .pill{margin-top:52px;display:inline-block;background:#00CED1;color:#05343a;font-family:'Archivo';font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:30px;padding:26px 52px;border-radius:999px}
</style></head><body>
  ${frames.map(([, h]) => h).join("\n")}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2,
});
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const nodes = await page.$$(".frame");
for (let i = 0; i < nodes.length; i++) {
  const name = frames[i][0];
  await nodes[i].screenshot({ path: resolve(OUT, `${name}.png`) });
  console.log("wrote", name + ".png");
}
await browser.close();
console.log("done ->", OUT);
