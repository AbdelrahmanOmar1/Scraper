const { chromium } = require("playwright");
const chalk = require("chalk");

function parsePrice(priceText) {
  if (!priceText) return null;

  const cleaned = priceText.replace(/[^\d]/g, "").trim();
  return cleaned ? Number(cleaned) : null;
}

// SAFE retry (never crash API)
async function withRetry(fn, retries = 1) {
  try {
    return await fn();
  } catch (err) {
    console.log(chalk.yellow(`Noon failed: ${err.message}`));

    if (retries <= 0) return [];

    console.log(chalk.yellow(`Retrying Noon... (${retries})`));
    return await withRetry(fn, retries - 1);
  }
}

async function scrapeNoon(query, minPrice, maxPrice) {
  return await withRetry(async () => {
    console.log(chalk.cyan("Start Scrape from Noon..."));

 const browser = await chromium.launch({
  headless: true,  
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--window-size=1280,800",
    "--disable-http2",
    "--disable-quic",
  ],
})

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });

    const url = `https://www.noon.com/egypt-en/search/?q=${encodeURIComponent(
      query
    )}`;

    // SAFE NAVIGATION
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
    } catch (err) {
      await browser.close();
      return [];
    }

    await page.waitForTimeout(3000);

    // ⚠️ DO NOT hard fail if selector changes
    let cardsExist = true;
    try {
      cardsExist = await page
        .locator("div")
        .first()
        .isVisible({ timeout: 5000 });
    } catch {
      cardsExist = false;
    }

    if (!cardsExist) {
      await browser.close();
      return [];
    }

    const products = await page.evaluate(() => {
      const items = [];

      const cards = document.querySelectorAll("a[href*='/product/']");

      cards.forEach((card) => {
        try {
          const title =
            card.querySelector("h2")?.innerText ||
            card.querySelector("span")?.innerText ||
            null;

          const price =
            card.innerText.match(/\d[\d,]*\s*EGP|\d[\d,]*/)?.[0] || null;

          const link = card.href || null;

          const image =
            card.querySelector("img")?.src ||
            card.querySelector("img")?.getAttribute("data-src") ||
            null;

          if (title && link && title.length > 3) {
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

      return items.slice(0, 40);
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
      chalk.green(`Noon scraped ${filtered.length} products successfully`)
    );

    return filtered;
  });
}

module.exports = scrapeNoon;
