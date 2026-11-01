// Renders the Gaita Instagram launch set: 3 carousels, singles, stories, reel
// covers. HTML/CSS -> headless Chrome element screenshots. Fonts inlined,
// screenshots + photos embedded as data URIs. Output -> gaita-site/ig/
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "ig");
mkdirSync(OUT, { recursive: true });

const b64 = (p) => readFileSync(resolve(ROOT, p)).toString("base64");
const font = (p) => `data:font/woff2;base64,${b64(p)}`;
const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const img = (p) => `data:${MIME[p.split(".").pop()]};base64,${b64(p)}`;

const archivo = font("src/fonts/Archivo-Variable.woff2");
const sw400 = font("src/fonts/Switzer-400.woff2");
const sw600 = font("src/fonts/Switzer-600.woff2");

const APP = {
  analyze: img("public/app/analyze.png"),
  metrics: img("public/app/metrics.png"),
  coach: img("public/app/coach.png"),
};
const PH = {
  side: img("public/photos/gait-sideview.webp"),   // clean side-profile stride
  motion: img("public/photos/33995240.jpg"),       // b&w motion-blur crossing
  away: img("public/photos/13636369.jpg"),         // runner going away, dramatic
  hill: img("public/photos/28448694.jpg"),         // runners on a hill, moody
};

// ---- components -----------------------------------------------------------
const wm = (cls) => `<span class="wm ${cls}">GAITA</span>`;
const count = (n, total) => `<span class="count">${String(n).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>`;
const photoBg = (src, grade = 0.9) =>
  `<img class="bg" src="${src}"/><div class="scrim" style="--g:${grade}"></div>`;

// Photo cover slide (opens a carousel)
const cover = ({ w, h, photo, kicker, headline, sub, swipe = true }) => `
  <div class="ad" style="width:${w}px;height:${h}px;background:#0d0d0c">
    ${photoBg(photo)}
    <div class="pad" style="justify-content:space-between">
      <div class="row-top">${wm("light")}${kicker ? `<span class="meta light-dim">${kicker}</span>` : ""}</div>
      <div>
        <h1 class="disp light" style="font-size:${w > 1080 ? 128 : 96}px">${headline}</h1>
        ${sub ? `<p class="sub dim" style="margin-top:14px;max-width:820px">${sub}</p>` : ""}
        ${swipe ? `<div class="swipe">Swipe <span>&rarr;</span></div>` : ""}
      </div>
    </div>
  </div>`;

// Numbered teaching slide (type only)
const point = ({ dark, num, total, label, body }) => `
  <div class="ad ${dark ? "black" : "bone"}" style="width:1080px;height:1350px">
    ${dark ? '<div class="glow"></div>' : ""}
    <div class="pad col">
      <div class="row-top">${wm(dark ? "cyan" : "ink")}${count(num, total)}</div>
      <div class="mid">
        <div class="bignum ${dark ? "cyan" : "ink-soft"}">${String(num).padStart(2, "0")}</div>
        <h2 class="disp ${dark ? "light" : "ink"}" style="font-size:78px">${label}</h2>
        <p class="body ${dark ? "dim" : ""}">${body}</p>
      </div>
    </div>
  </div>`;

// Product slide with a device mockup
const deviceSlide = ({ dark, label, body, src }) => `
  <div class="ad ${dark ? "black" : "bone"}" style="width:1080px;height:1350px">
    ${dark ? '<div class="glow"></div>' : ""}
    <div class="pad col">
      <div class="row-top">${wm(dark ? "cyan" : "ink")}</div>
      <h2 class="disp ${dark ? "light" : "ink"}" style="font-size:60px;margin-top:6px">${label}</h2>
      <p class="body ${dark ? "dim" : ""}" style="margin-top:6px">${body}</p>
      <div class="stage"><div class="device"><img src="${src}"/></div></div>
    </div>
  </div>`;

// Closing CTA slide
const cta = ({ dark, headline, sub, save = true }) => `
  <div class="ad ${dark ? "black" : "bone"}" style="width:1080px;height:1350px">
    ${dark ? '<div class="glow"></div>' : ""}
    <div class="pad" style="justify-content:center;align-items:flex-start">
      <div class="row-top" style="position:absolute;top:70px;left:70px;right:70px">${wm(dark ? "cyan" : "ink")}</div>
      <h1 class="disp ${dark ? "light" : "ink"}" style="font-size:98px">${headline}</h1>
      <p class="sub ${dark ? "dim" : ""}" style="margin-top:20px;max-width:820px">${sub}</p>
      <div class="foot" style="margin-top:40px"><span class="pill">Get it free</span><span class="url ${dark ? "cyan" : "ink-soft"}">App Store</span></div>
      ${save ? `<p class="savehint ${dark ? "dim" : ""}">Save this for your next run.</p>` : ""}
    </div>
  </div>`;

// ---- content --------------------------------------------------------------
const C1 = 7, C2 = 5, C3 = 5;
const items = [
  // Carousel 1 — 5 form mistakes (dark, photo cover)
  { name: "c1-1", html: cover({ w: 1080, h: 1350, photo: PH.side, kicker: "Form fixes",
      headline: "5 form mistakes<br/>stealing your pace" }) },
  { name: "c1-2", html: point({ dark: true, num: 1, total: C1, label: "Overstriding",
      body: "Your foot lands ahead of your body and brakes you on every single step." }) },
  { name: "c1-3", html: point({ dark: true, num: 2, total: C1, label: "Heel braking",
      body: "You slam the heel down first. Each landing is a tiny stop sign." }) },
  { name: "c1-4", html: point({ dark: true, num: 3, total: C1, label: "Crossing arms",
      body: "Arms swinging across your chest twist your torso and leak power sideways." }) },
  { name: "c1-5", html: point({ dark: true, num: 4, total: C1, label: "Low cadence",
      body: "Under 170 steps a minute means long, heavy strides that pound your knees." }) },
  { name: "c1-6", html: point({ dark: true, num: 5, total: C1, label: "Head down",
      body: "Staring at your feet drops your chest and collapses your whole posture." }) },
  { name: "c1-7", html: cta({ dark: true, headline: "Gaita grades all five.",
      sub: "From one phone video. On device, and free." }) },

  // Carousel 2 — watch vs coach (bone)
  { name: "c2-1", html: `
    <div class="ad bone" style="width:1080px;height:1350px">
      <div class="pad col"><div class="row-top">${wm("ink")}<span class="meta">Why a camera</span></div>
        <div class="mid"><h1 class="disp ink" style="font-size:90px">Your watch tracks.<br/>Gaita coaches.</h1>
        <p class="body">Swipe to see what a camera catches that your watch never will.</p>
        <div class="swipe ink-swipe">Swipe <span>&rarr;</span></div></div></div>
    </div>` },
  { name: "c2-2", html: point({ dark: false, num: 1, total: C2, label: "The watch",
      body: "It counts your steps and your heart rate. It never once sees how you actually move." }) },
  { name: "c2-3", html: point({ dark: false, num: 2, total: C2, label: "The camera",
      body: "It sees your knee drive, foot strike, posture and bounce. The things that make you faster." }) },
  { name: "c2-4", html: point({ dark: false, num: 3, total: C2, label: "Gaita",
      body: "It turns one phone video into 8 form scores and the one drill to fix first." }) },
  { name: "c2-5", html: cta({ dark: false, headline: "No straps. No sensors.",
      sub: "Just your phone camera. On device, and free." }) },

  // Carousel 3 — filmed one run, product demo (dark, device shots)
  { name: "c3-1", html: cover({ w: 1080, h: 1350, photo: PH.motion, kicker: "How it works",
      headline: "I filmed one run.<br/>Here's the report." }) },
  { name: "c3-2", html: deviceSlide({ dark: true, label: "One clip in. A grade for every part of your stride.",
      body: "Drive, impact, smoothness. Graded like a coach would.", src: APP.analyze }) },
  { name: "c3-3", html: deviceSlide({ dark: true, label: "Cadence, strike, ground contact, bounce.",
      body: "The full read a lab would give you, from your phone.", src: APP.metrics }) },
  { name: "c3-4", html: deviceSlide({ dark: true, label: "Then a coach tells you what to fix next.",
      body: "It knows your run and your gait. Ask it anything.", src: APP.coach }) },
  { name: "c3-5", html: cta({ dark: true, headline: "Your whole coaching staff.",
      sub: "In one app. On device, and free." }) },

  // Singles (4:5)
  { name: "single-launch", html: `
    <div class="ad bone" style="width:1080px;height:1350px">
      <div class="pad col"><div class="row-top">${wm("ink")}<span class="meta">Out now</span></div>
        <div class="mid"><h1 class="disp ink" style="font-size:112px">Now on the<br/>App Store.<br/>Free.</h1>
        <p class="sub">Film one run. See your form the way a coach does.</p></div>
        <div class="foot"><span class="pill">Get it free</span><span class="url ink-soft">App Store</span></div></div>
    </div>` },
  { name: "single-overstride", html: `
    <div class="ad" style="width:1080px;height:1350px;background:#0d0d0c">
      ${photoBg(PH.side, 0.9)}
      <div class="pad col"><div class="row-top">${wm("light")}<span class="meta light-dim">Form 101</span></div>
        <div class="mid"><h1 class="disp light" style="font-size:96px">Overstriding is the silent pace killer.</h1>
        <p class="sub dim" style="margin-top:16px">Landing your foot ahead of your body brakes every stride. Gaita catches it in one run.</p></div>
        <div class="foot"><span class="pill">Get it free</span><span class="url cyan">App Store</span></div></div>
    </div>` },

  // Stories / Reel covers (9:16)
  { name: "story-poll", html: `
    <div class="ad" style="width:1080px;height:1920px;background:#0d0d0c">
      ${photoBg(PH.away, 0.86)}
      <div class="pad" style="justify-content:space-between">
        <div class="row-top">${wm("light")}</div>
        <div><h1 class="disp light" style="font-size:130px">Do you know your cadence?</h1>
        <p class="sub dim" style="margin-top:18px">Most runners have no idea. Gaita reads it in one clip.</p>
        <p class="note">add a poll sticker here: "yes / no idea"</p></div>
      </div>
    </div>` },
  { name: "story-link", html: `
    <div class="ad bone" style="width:1080px;height:1920px">
      <div class="pad" style="justify-content:center;align-items:flex-start">
        <div class="row-top" style="position:absolute;top:80px;left:70px;right:70px">${wm("ink")}<span class="meta">Free</span></div>
        <h1 class="disp ink" style="font-size:150px">Get Gaita free.</h1>
        <p class="sub" style="margin-top:20px">Running form analysis, all on your phone.</p>
        <p class="note ink-note">tap the link sticker above &uarr;</p>
      </div>
    </div>` },
  { name: "reel-blind", html: `
    <div class="ad" style="width:1080px;height:1920px;background:#0d0d0c">
      ${photoBg(PH.motion, 0.82)}
      <div class="pad" style="justify-content:flex-end">
        <div class="row-top" style="position:absolute;top:80px;left:70px;right:70px">${wm("light")}</div>
        <h1 class="disp light" style="font-size:180px">Stop training blind.</h1>
        <p class="sub dim" style="margin-top:18px;max-width:820px">Every run, zero feedback on your form. Until now.</p>
      </div>
    </div>` },
  { name: "reel-coach", html: `
    <div class="ad" style="width:1080px;height:1920px;background:#0d0d0c">
      ${photoBg(PH.hill, 0.84)}
      <div class="pad" style="justify-content:flex-end">
        <div class="row-top" style="position:absolute;top:80px;left:70px;right:70px">${wm("light")}</div>
        <h1 class="disp light" style="font-size:172px">Your coach. In your pocket.</h1>
        <p class="sub dim" style="margin-top:18px;max-width:820px">It knows your last run and your gait. Ask it anything.</p>
      </div>
    </div>` },
];

const css = `
  @font-face{font-family:'Archivo';src:url(${archivo}) format('woff2');font-weight:100 900;font-stretch:62% 125%;}
  @font-face{font-family:'Switzer';src:url(${sw400}) format('woff2');font-weight:400;}
  @font-face{font-family:'Switzer';src:url(${sw600}) format('woff2');font-weight:600;}
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#333}
  .ad{position:relative;overflow:hidden}
  .bone{background:#f1f1ef}.black{background:#0d0d0c}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.05)}
  .scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,8,7,var(--g)) 4%,rgba(8,8,7,.35) 46%,rgba(8,8,7,.08))}
  .glow{position:absolute;left:52%;top:24%;width:1200px;height:1200px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(0,206,209,.18),rgba(0,206,209,0) 62%)}
  .pad{position:absolute;inset:0;padding:70px;display:flex;flex-direction:column}
  .pad.col{gap:14px;justify-content:flex-start}
  .mid{flex:1;display:flex;flex-direction:column;justify-content:center;gap:20px}
  .row-top{display:flex;align-items:baseline;justify-content:space-between}
  .wm{font-family:'Archivo';font-weight:800;font-stretch:93%;text-transform:uppercase;letter-spacing:-.01em;font-size:40px}
  .count{font-family:'Archivo';font-weight:600;letter-spacing:.14em;font-size:24px;color:#8f8f8a}
  .disp{font-family:'Archivo';font-weight:660;font-stretch:88%;text-transform:uppercase;letter-spacing:-.025em;line-height:.9;text-wrap:balance}
  .bignum{font-family:'Archivo';font-weight:700;font-stretch:80%;font-size:150px;line-height:.8;letter-spacing:-.03em}
  .meta{font-family:'Archivo';font-weight:500;text-transform:uppercase;letter-spacing:.14em;font-size:24px;color:#6d6d68}
  .light-dim{color:#c9c9c4}
  .sub{font-family:'Switzer';font-weight:400;font-size:34px;line-height:1.3;color:#565651;max-width:760px}
  .body{font-family:'Switzer';font-weight:400;font-size:40px;line-height:1.34;color:#565651;max-width:820px}
  .sub.dim,.body.dim{color:#b4b4af}
  .url{font-family:'Archivo';font-weight:600;text-transform:uppercase;letter-spacing:.13em;font-size:24px}
  .ink{color:#141412}.light{color:#f5f5f3}.cyan{color:#00CED1}.ink-soft{color:#6d6d68}
  .dim{color:#b4b4af}
  .pill{display:inline-block;background:#00CED1;color:#05343a;font-family:'Archivo';font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:26px;padding:20px 42px;border-radius:999px}
  .foot{display:flex;align-items:center;gap:26px;flex-wrap:wrap;margin-top:8px}
  .savehint{position:absolute;bottom:70px;left:70px;font-family:'Switzer';font-weight:400;font-size:26px;color:#6d6d68}
  .stage{flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:18px 0 4px}
  .device{height:100%;padding:11px;background:#141412;border-radius:46px;box-shadow:0 40px 90px rgba(0,0,0,.34)}
  .device img{display:block;height:100%;width:auto;border-radius:36px}
  .swipe{margin-top:34px;font-family:'Archivo';font-weight:600;text-transform:uppercase;letter-spacing:.16em;font-size:26px;color:#00CED1;display:flex;align-items:center;gap:12px}
  .swipe span{font-size:34px}
  .swipe.ink-swipe{color:#141412}
  .note{margin-top:30px;font-family:'Switzer';font-weight:400;font-size:26px;color:#00CED1;border:1px dashed rgba(0,206,209,.5);padding:14px 20px;border-radius:14px;display:inline-block}
  .note.ink-note{color:#0a7d80;border-color:rgba(10,125,128,.5)}
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  ${items.map(a => `<div class="frame">${a.html}</div>`).join("\n")}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "load", timeout: 120000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

const nodes = await page.$$(".frame > .ad");
for (let i = 0; i < nodes.length; i++) {
  await nodes[i].screenshot({ path: resolve(OUT, `${items[i].name}.png`) });
  console.log("wrote", items[i].name + ".png");
}
await browser.close();
console.log("done ->", OUT);
