const { chromium } = require("playwright");
const chalk = require("chalk");

function cleanPrice(priceText) {
  if (!priceText) return null;
  const match = priceText.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

async function withRetry(fn, retries = 1) {
  try {
    return await fn();
  } catch (err) {
    console.log(chalk.yellow(`Amazon failed: ${err.message}`));
    if (retries <= 0) return [];
    console.log(chalk.yellow(`Retrying Amazon... (${retries})`));
    return await withRetry(fn, retries - 1);
  }
}

async function scrapeAmazon(query) {
  return await withRetry(async () => {
    console.log(chalk.cyan("Start Scrape from AMAZON..."));

    const browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const context = await browser.newContext({
      locale: "en-US",
      timezoneId: "Africa/Cairo",
      geolocation: { latitude: 30.0444, longitude: 31.2357 },
      permissions: ["geolocation"],
      viewport: { width: 1280, height: 800 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    }); // ✅ closing }); was missing

    const page = await context.newPage();

    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });

    const url = `https://www.amazon.eg/s?k=${encodeURIComponent(query)}`;

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
    } catch (err) {
      await browser.close();
      return [];
    }

    console.log("page title:", await page.title());

    const html = await page.content();
    if (html.includes("captcha")) {
      console.log("❌ CAPTCHA detected");
      await browser.close();
      return [];
    }

    await page.waitForTimeout(3000);

    let rawCount = 0;
    try {
      rawCount = await page.$$eval("div.s-result-item", (els) => els.length);
    } catch (e) {
      rawCount = 0;
    }
    console.log("Raw Amazon cards found:", rawCount);

    const products = await page.evaluate(() => {
      const items = [];
      const cards = document.querySelectorAll("div.s-result-item");
      cards.forEach((card) => {
        try {
          const title =
            card.querySelector("h2 span")?.innerText?.trim() ||
            card.querySelector("h2")?.innerText?.trim() ||
            null;
          const link =
            card.querySelector("h2 a")?.href ||
            card.querySelector("a.a-link-normal")?.href ||
            null;
          const price =
            card.querySelector(".a-price .a-offscreen")?.innerText || null;
          const image = card.querySelector("img.s-image")?.src || null;

          if (title && link && title.length > 3) {
            items.push({ title, price, link, image, source: "amazon" });
          }
        } catch (e) {}
      });
      return items.slice(0, 40);
    });

    await browser.close();

    console.log(
      chalk.green(`Amazon scraped ${products.length} products successfully`)
    );
    console.log(chalk.cyan("End Scrape from AMAZON..."));

    return products;
  });
}

module.exports = scrapeAmazon;
