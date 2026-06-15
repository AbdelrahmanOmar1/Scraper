const axios = require("axios");
const chalk = require("chalk");

function parsePrice(priceText) {
  if (!priceText) return null;
  const cleaned = String(priceText).replace(/[^\d]/g, "").trim();
  return cleaned ? Number(cleaned) : null;
}

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

function buildNoonImage(p) {
  // Option 1: image_keys array (most common)
  if (p?.image_keys?.length > 0) {
    return `https://f.nooncdn.com/p/${p.image_keys[0]}.jpg`; // ✅ no z suffix
  }
  // Option 2: image_key string
  if (p?.image_key) {
    return `https://f.nooncdn.com/p/${p.image_key}.jpg`; // ✅ no z suffix
  }
  // Option 3: image_url direct from API
  if (p?.image_url) return p.image_url;
  // Option 4: thumbnail direct URL
  if (p?.thumbnail) return p.thumbnail;
  // Option 5: image direct URL
  if (p?.image) return p.image;
  // Option 6: media array
  if (p?.media?.length > 0) return p.media[0];

  return null;
}

async function scrapeNoon(query, minPrice, maxPrice) {
  return await withRetry(async () => {
    console.log(chalk.cyan("Start Scrape from Noon..."));

    const endpoints = [
      {
        url: "https://www.noon.com/_svc/catalog/api/v3/search",
        params: { q: query, lang: "en", limit: 50, page: 1 },
      },
      {
        url: "https://www.noon.com/_svc/catalog/api/v2/search",
        params: { q: query, lang: "en", limit: 50 },
      },
      {
        url: "https://www.noon.com/_svc/catalog/api/v1/search",
        params: { q: query, lang: "en", limit: 50 },
      },
    ];

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.noon.com/egypt-en/",
      "x-platform": "web",
      "x-locale": "en-eg",
      "x-country": "EG",
      Origin: "https://www.noon.com",
    };

    let hits = [];

    for (const endpoint of endpoints) {
      try {
        console.log(chalk.gray(`→ Trying: ${endpoint.url}`));
        const response = await axios.get(endpoint.url, {
          params: endpoint.params,
          headers,
          timeout: 20000,
        });

        const data = response.data;
        hits =
          data?.hits ||
          data?.products ||
          data?.data?.hits ||
          data?.data?.products ||
          data?.result?.hits ||
          [];

        if (hits.length > 0) {
          console.log(
            chalk.gray("→ First hit sample keys:"),
            Object.keys(hits[0]?.product || hits[0] || {})
          );
          console.log(chalk.gray(`→ Got ${hits.length} hits`));
          break;
        }
      } catch (err) {
        console.log(chalk.yellow(`→ Endpoint failed: ${err.message}`));
        continue;
      }
    }

    console.log(chalk.gray(`→ Raw Noon hits: ${hits.length}`));

    const products = hits
      .map((item) => {
        const p = item?.product || item;
        const image = buildNoonImage(p);

        if (hits.indexOf(item) === 0) {
          console.log(chalk.gray("→ Sample image_keys:"), p?.image_keys);
          console.log(chalk.gray("→ Built image URL:"), image);
        }

        return {
          title: p?.name || p?.title || null,
          price: p?.price?.value || p?.sale_price || p?.price || null,
          link: p?.url
            ? `https://www.noon.com${p.url}`
            : `https://www.noon.com/egypt-en/search/?q=${encodeURIComponent(query)}`,
          image,
          source: "noon",
        };
      })
      .filter((p) => p.title && p.link);

    const filtered = products.filter((p) => {
      const price = parsePrice(p.price);
      if (!price) return false;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;
      return true;
    });

    console.log(chalk.green(`Noon scraped ${filtered.length} products successfully`));
    console.log(chalk.cyan("End Scrape from Noon..."));

    return filtered;
  });
}

module.exports = scrapeNoon;
