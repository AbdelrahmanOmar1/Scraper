const { chromium } = require("playwright");
const chalk = require("chalk");

function parsePrice(priceText) {
  if (!priceText) return null;

  const cleaned = priceText.replace(/[^\d]/g, "").trim();
  return cleaned ? Number(cleaned) : null;
}

async function withRetry(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    console.log(chalk.yellow(`Retrying Noon... (${retries})`));
    return await withRetry(fn, retries - 1);
  }
}

async function scrapeNoon(query, minPrice, maxPrice) {
  return await withRetry(async () => {
    console.log(chalk.cyan("Start Scrape from Noon..."));

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

    const url = `https://www.noon.com/egypt-en/search/?q=${encodeURIComponent(
      query,
    )}`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForTimeout(4000);

    await page.waitForSelector(
      ".PBoxLinkHandler-module-scss-module__WvRpgq__linkWrapper",
      { timeout: 20000 },
    );

    const products = await page.evaluate(() => {
      const items = [];

      const cards = document.querySelectorAll(
        ".PBoxLinkHandler-module-scss-module__WvRpgq__linkWrapper",
      );

      cards.forEach((card) => {
        try {
          const title =
            card.querySelector(
              ".ProductDetailsSection-module-scss-module__Y6u1Qq__title",
            )?.innerText ||
            card.querySelector("h2")?.innerText ||
            null;

          const price =
            card.querySelector(".Price-module-scss-module__q-4KEG__amount")
              ?.innerText ||
            card.innerText.match(/\d[\d,]*/)?.[0] ||
            null;

          const link = card.querySelector("a")?.href || null;

          const image = card.querySelector("img")?.src || null;

          if (title && link) {
            items.push({
              title,
              price,
              link,
              image,
              source: "noon",
            });
          }
        } catch (e) {}
      });

      return items;
    });

    await browser.close();

    const filtered = products.filter((p) => {
      const price = parsePrice(p.price);

      if (!price) return false;

      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      return true;
    });

    console.log(
      chalk.green(`Noon scraped ${filtered.length} products successfully`),
    );

    console.log(chalk.cyan("End Scrape from Noon..."));

    return filtered;
  });
}

module.exports = scrapeNoon;
