const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let lastMultiplier = null;

app.get('/', (req, res) => {
  res.send('Puppeteer multiplier tracker is running.');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Start Puppeteer task
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://rugs.fun/", { waitUntil: 'networkidle2' });

  const selector = "#root > div > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(8) > div > div";
  await page.waitForSelector(selector);

  console.log("Tracking started...");

  setInterval(async () => {
    try {
      const multiplier = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? el.innerText.trim() : null;
      }, selector);

      if (multiplier && multiplier !== lastMultiplier) {
        lastMultiplier = multiplier;
        console.log("New multiplier:", multiplier);
        fs.appendFileSync('multipliers.txt', multiplier + '\n');
      }
    } catch (err) {
      console.error("Error while checking multiplier:", err);
    }
  }, 3000);
});
