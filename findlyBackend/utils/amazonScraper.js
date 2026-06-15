const { chromium } = require("playwright");
const chalk = require("chalk");

function cleanPrice(priceText) {
  if (!priceText) return null;

  const match = priceText.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : null;
}


async function withRetry(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    console.log(chalk.yellow(`Retrying Amazon... (${retries})`));
    return await withRetry(fn, retries - 1);
  }
}

async function scrapeAmazon(query) {
  return await withRetry(async () => {
    console.log(chalk.cyan("Start Scrape from AMAZON..."));

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

    const url = `https://www.amazon.eg/s?k=${encodeURIComponent(query)}`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log("page title:", await page.title());

    const html = await page.content();
    console.log(
      html.includes("captcha") ? "❌ CAPTCHA detected" : "✅ No CAPTCHA",
    );

    await page.waitForTimeout(6000);

 
    const rawCount = await page.$$eval(
      "div.s-result-item",
      (els) => els.length,
    );

    console.log("Raw Amazon cards found:", rawCount);

    const products = await page.evaluate(() => {
      const items = [];

      const cards = document.querySelectorAll("div.s-result-item");

      cards.forEach((card) => {
        try {
        
          const title =
            card.querySelector("h2 span")?.innerText?.trim() ||
            card.querySelector("h2")?.innerText?.trim() ||
            card.querySelector(".a-size-base-plus")?.innerText?.trim() ||
            null;

       
          const link =
            card.querySelector("h2 a")?.href ||
            card.querySelector("a.a-link-normal")?.href ||
            null;

         
          const price =
            card.querySelector(".a-price .a-offscreen")?.innerText || null;

        
          const image =
            card.querySelector("img.s-image")?.getAttribute("src") ||
            card.querySelector("img")?.src ||
            null;

          
          if (title && link && title.length > 3) {
            items.push({
              title,
              price,
              link,
              image,
              source: "amazon",
            });
          }
        } catch (e) {
        
        }
      });

      return items.slice(0, 50);
    });

    await browser.close();

    console.log(
      chalk.green(`Amazon scraped ${products.length} products successfully`),
    );

    console.log(chalk.cyan("End Scrape from AMAZON..."));

    return products;
  });
}

module.exports = scrapeAmazon;
