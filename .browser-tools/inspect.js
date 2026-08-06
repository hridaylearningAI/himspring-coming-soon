const { chromium } = require("playwright-core");

(async () => {
  const url = process.argv[2] || "http://localhost:3100";
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

  // scroll to middle of family section (panel 2)
  await page.evaluate(() => {
    const el = document.querySelector(".hsv-family");
    window.scrollTo(0, el.offsetTop + el.offsetHeight * 0.5);
  });
  await page.waitForTimeout(800);

  const data = await page.evaluate(() => {
    const out = { scrollY: window.scrollY, innerH: window.innerHeight };
    out.panels = [...document.querySelectorAll(".hsv-panel")].map((p) => {
      const g = p.querySelector(".hsv-grounds");
      const img = p.querySelector(".hsv-ground.is-on") || p.querySelector(".hsv-ground");
      const inner = p.querySelector(".hsv-panel__inner");
      const cs = getComputedStyle(p);
      return {
        cls: p.className,
        rect: p.getBoundingClientRect().toJSON(),
        vars: {
          l: p.style.getPropertyValue("--l"),
          r: p.style.getPropertyValue("--r"),
          cx: p.style.getPropertyValue("--cx"),
          in: p.style.getPropertyValue("--in"),
          scale: p.style.getPropertyValue("--hsv-scale"),
          groundPos: p.style.getPropertyValue("--hsv-ground-pos"),
        },
        panelMinH: cs.minHeight,
        grounds: g ? { rect: g.getBoundingClientRect().toJSON(), pos: getComputedStyle(g).position, op: getComputedStyle(g).opacity } : null,
        img: img ? { rect: img.getBoundingClientRect().toJSON(), src: img.currentSrc.split("/").pop(), natural: `${img.naturalWidth}x${img.naturalHeight}`, op: getComputedStyle(img).opacity, objPos: getComputedStyle(img).objectPosition } : null,
        inner: inner ? { rect: inner.getBoundingClientRect().toJSON(), pos: getComputedStyle(inner).position } : null,
      };
    });
    const sw = document.querySelector(".hsv-family__switch");
    out.switch = sw ? { rect: sw.getBoundingClientRect().toJSON(), pos: getComputedStyle(sw).position, top: getComputedStyle(sw).top } : null;
    return out;
  });
  console.log(JSON.stringify(data, null, 1));
  await page.screenshot({ path: "/Users/hridaygoswami/Desktop/Everything/himspring/.browser-tools/inspect.png" });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
