const { chromium } = require("playwright-core");

(async () => {
  const url = process.argv[2] || "http://localhost:3000";
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  console.log("status:", resp && resp.status());
  await page.waitForTimeout(5000);
  console.log("title:", await page.title());
  console.log("hsv-family count:", await page.locator(".hsv-family").count());
  console.log("body classes:", await page.evaluate(() => document.body.className));
  console.log("sections:", await page.evaluate(() => [...document.querySelectorAll("section")].map(s => s.className).join(" | ")));
  console.log("console errors:", errors.slice(0, 10));
  await page.screenshot({ path: "/Users/hridaygoswami/Desktop/Everything/himspring/.browser-tools/probe.png" });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
