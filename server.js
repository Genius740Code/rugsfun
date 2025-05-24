const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the website
  await page.goto("https://rugs.fun/", { waitUntil: 'networkidle2' });

  // Wait for the element to appear
  const selector = "#root > div > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(8) > div > div";
  await page.waitForSelector(selector);

  let lastMultiplier = null;

  // Poll every 3 seconds for changes
  setInterval(async () => {
    const multiplier = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? el.innerText.trim() : null;
    }, selector);

    if (multiplier && multiplier !== lastMultiplier) {
      lastMultiplier = multiplier;
      console.log("New multiplier:", multiplier);

      // Append multiplier to file
      fs.appendFileSync('multipliers.txt', multiplier + '\n');
    }
  }, 3000);

  // Keep the process alive
})();
