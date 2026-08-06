const { chromium } = require("playwright-core");

(async () => {
  const url = process.argv[2] || "http://localhost:3000";
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

  // jump to the family section
  const box = await page.locator(".hsv-family").boundingBox();
  console.log("family box:", JSON.stringify(box));

  // screenshot each of the three panels + the switch area
  for (let i = 0; i < 3; i++) {
    const panel = page.locator(`.hsv-panel--p${i + 1}`);
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `family-p${i + 1}.png` });
    const pb = await panel.boundingBox();
    console.log(`panel ${i + 1}:`, JSON.stringify(pb));
  }

  // also a shot with the switch visible mid-section
  await page.evaluate(() => {
    const el = document.querySelector(".hsv-family");
    if (el) window.scrollTo(0, el.offsetTop + window.innerHeight * 1.5);
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "family-mid.png" });

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
