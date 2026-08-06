const { chromium } = require("playwright-core");

(async () => {
  const url = process.argv[2] || "http://localhost:3100";
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);

  const top = await page.evaluate(() => {
    const el = document.querySelector(".hsv-family");
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  });
  const h = await page.evaluate(() => document.querySelector(".hsv-family").offsetHeight);
  console.log("family top", top, "height", h);

  // sweep through the section
  for (let i = 0; i <= 4; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), top + (h / 4.5) * i);
    await page.waitForTimeout(700);
    const widths = await page.evaluate(() =>
      [...document.querySelectorAll(".hsv-panel")].map((p) => {
        const g = p.querySelector(".hsv-grounds");
        return Math.round(g.getBoundingClientRect().width);
      }).join("/")
    );
    console.log(`step ${i}: grounds widths ${widths}`);
    await page.screenshot({ path: `/Users/hridaygoswami/Desktop/Everything/himspring/.browser-tools/v-step${i}.png` });
  }

  // switch to PET mid-section
  await page.evaluate((y) => window.scrollTo(0, y), top + h * 0.45);
  await page.waitForTimeout(500);
  await page.locator(".hsv-family__opt", { hasText: "PET" }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/Users/hridaygoswami/Desktop/Everything/himspring/.browser-tools/v-pet.png" });

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
