const { chromium } = require("playwright");
const chalk = require("chalk");

function parsePrice(text) {
  if (!text) return null;

  const match = text.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

async function withRetry(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    console.log(chalk.yellow(`Retrying Alibaba... (${retries})`));
    return await withRetry(fn, retries - 1);
  }
}

async function scrapeAlibaba(query) {
  return await withRetry(async () => {
    console.log(chalk.cyan("Start Scrape from ALIBABA..."));

    const browser = await chromium.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });

    const url = `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(
      query,
    )}`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForTimeout(5000);

    await page.waitForSelector(".organic-offer-wrapper", {
      timeout: 20000,
    });

    const products = await page.evaluate(() => {
      const items = [];

      const cards = document.querySelectorAll(".organic-offer-wrapper");

      cards.forEach((card) => {
        try {
          const title =
            card.querySelector(".elements-title-normal__outter")?.innerText ||
            card.querySelector("h2")?.innerText ||
            null;

          const priceText =
            card.querySelector(".elements-offer-price-normal__price")
              ?.innerText ||
            card.innerText.match(/US\s?\$?\s?\d[\d,.]*/)?.[0] ||
            null;

          const link = card.querySelector("a")?.href || null;

          const image = card.querySelector("img")?.src || null;

          if (title && link && title.length > 5) {
            items.push({
              title: title.trim(),
              price: priceText,
              link,
              image,
              source: "alibaba",
            });
          }
        } catch (e) {}
      });

      return items.slice(0, 30);
    });

    await browser.close();

    console.log(
      chalk.green(`Alibaba scraped ${products.length} products successfully`),
    );

    console.log(chalk.cyan("End Scrape from ALIBABA..."));

    return products;
  });
}

module.exports = scrapeAlibaba;
