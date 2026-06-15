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
        "--disable-gpu",
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
      extraHTTPHeaders: {
        "accept-language": "en-US,en;q=0.9",
        // ✅ Tell Amazon we want the Egyptian store in English
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    });

    // ✅ Set cookies to force Amazon Egypt + English language
    await context.addCookies([
      {
        name: "i18n-prefs",
        value: "EGP",
        domain: ".amazon.eg",
        path: "/",
      },
      {
        name: "lc-acbeg",
        value: "en_US",
        domain: ".amazon.eg",
        path: "/",
      },
      {
        name: "sp-cdn",
        value: "L5Z9:EG",
        domain: ".amazon.eg",
        path: "/",
      },
    ]);

    await context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
      window.chrome = { runtime: {} };
    });

    const page = await context.newPage();

    const url = `https://www.amazon.eg/s?k=${encodeURIComponent(query)}&language=en_US`;

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
    } catch (err) {
      console.log(chalk.yellow("Amazon navigation failed:", err.message));
      await browser.close();
      return [];
    }

    const title = await page.title();
    console.log("page title:", title);

    // ✅ If still getting Arabic sorry page, try with language param
    if (title.includes("عذرًا") || title.includes("Sorry")) {
      console.log(chalk.yellow("⚠️ Got blocked page, retrying with different URL..."));
      try {
        await page.goto(
          `https://www.amazon.eg/s?k=${encodeURIComponent(query)}&ref=nb_sb_noss&language=en_US`,
          { waitUntil: "domcontentloaded", timeout: 30000 }
        );
        console.log("page title (retry):", await page.title());
      } catch (e) {
        await browser.close();
        return [];
      }
    }

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

    console.log(chalk.green(`Amazon scraped ${products.length} products successfully`));
    console.log(chalk.cyan("End Scrape from AMAZON..."));

    return products;
  });
}

module.exports = scrapeAmazon;
