import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  // Launch browser (Chromium is bundled with puppeteer)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Navigate to site
  await page.goto("https://rugs.fun/", { waitUntil: 'networkidle2' });

  // Selector to monitor
  const selector = "#root > div > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(8) > div > div";

  await page.waitForSelector(selector);

  let lastMultiplier = null;

  // Repeatedly check every 3 seconds
  setInterval(async () => {
    try {
      const multiplier = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? el.innerText.trim() : null;
      }, selector);

      if (multiplier && multiplier !== lastMultiplier) {
        lastMultiplier = multiplier;
        console.log("New multiplier:", multiplier);

        // Save to file
        fs.appendFileSync('multipliers.txt', multiplier + '\n');
      }
    } catch (err) {
      console.error("Error checking multiplier:", err.message);
    }
  }, 3000);

  // Prevent Node from exiting
})();
