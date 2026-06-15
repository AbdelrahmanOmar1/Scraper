# 🔍 Scraper – Smart Product Scraper & Search Engine

> **Node.js + Playwright** — A high-performance product scraping and search aggregation system that collects real-time data from multiple e-commerce platforms, stores it in MongoDB, and exposes a clean REST API for filtering, sorting, and searching products.

⚡ Built for speed, scalability, and real-world scraping reliability.

---

##LiveDemo : https://scraper-iota-rose.vercel.app/

## 🚀 Features

- 🔎 Multi-source product scraping (Amazon, Noon, extensible)
- ⚡ Parallel scraping orchestration system
- 🧠 Smart retry mechanism with failure recovery
- 💾 MongoDB storage with structured schema
- 🎯 Advanced filtering (price range, source filtering)
- 📊 Sorting (price ASC/DESC, newest)
- 🕵️ Playwright-based browser automation
- 🛡️ Anti-bot handling & stealth scraping techniques
- 🔁 Cache-ready architecture (DB-first search flow)
- 🌐 REST API ready for frontend integration
- 📦 Modular architecture (scalable for more sources)

---

## 🏗️ Project Structure

```
findlyBackend/
│
├── server.js                   # App entry point
├── app.js
│   
│
├── models/
│   └── dataModel.js            # Product schema
│
├── controllers/
│   └── productController.js    # API logic
│
├── services/
│   ├── searchService.js        # Orchestrates scrapers
│   └── browserManager.js       # (optional) browser handling
│
├── utils/
│   ├── amazonScraper.js        # Amazon scraper (Playwright)
│   ├── noonScraper.js          # Noon scraper (Playwright)
│   └── alibabaScraper.js       # Future source
│
├── routes/
│   └── productRoutes.js        # API endpoints
│
└── README.md
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API layer |
| Playwright | Browser automation & scraping |
| MongoDB + Mongoose | Database |
| Chalk | Logging & debugging |
| Nodemon | Development server |

---

## 📦 Installation

```bash
git clone https://github.com/your-username/findly.git
cd findlyBackend
npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/findly
```

```bash

cd findlyUi/findly
npm install
```

---

## ▶️ Run the Project

**Development**
```bash
npm run dev
```

**Production**
```bash
node server.js
```

---

## 🔍 API Endpoints

### 1. Scrape Products

Triggers scraping across selected sources.

```
GET /api/v1/findly?q=iphone&source=amazon,noon
```

| Param | Required | Description |
|---|---|---|
| `q` | ✅ | Search keyword |
| `source` | ✅ | Comma-separated sources (`amazon`, `noon`) |
| `min` | ❌ | Minimum price filter |
| `max` | ❌ | Maximum price filter |

**Response**
```json
{
  "source": "scraped",
  "query": "iphone",
  "sources": ["amazon", "noon"],
  "count": 120
}
```

---

### 2. Get Products from Database

Fetches and filters stored products.

```
GET /api/v1/products?q=iphone&min=100&max=1000&sort=price_asc
```

| Param | Description |
|---|---|
| `q` | Search keyword (returns all if empty) |
| `min` | Minimum price |
| `max` | Maximum price |
| `sort` | `price_asc`, `price_desc`, or `newest` |

**Response**
```json
{
  "source": "db",
  "count": 50,
  "results": []
}
```

---

## 🧠 System Architecture

```
Frontend
   ↓
API Layer (Express)
   ↓
Search Service (Orchestrator)
   ↓
Scrapers (Amazon / Noon / ...)
   ↓
MongoDB Storage
   ↓
API Response (Filters + Sorting)
```

---

## 🕵️ Scraping Strategy

**Amazon**
- Stealth mode enabled
- CAPTCHA detection handling
- Stable selectors

**Noon**
- Dynamic DOM scraping
- Retry mechanism with DOM fallback selectors
- Handles JS-rendered content

---

## 🔁 Retry System

Every scraper wraps its logic in a retry function to handle temporary blocks and failures:

```js
async function withRetry(fn, retries = 2)
```

---

## 📊 Filtering & Sorting

| Filter | Options |
|---|---|
| Price range | `min` / `max` |
| Source | `amazon`, `noon` |
| Sort order | `price_asc`, `price_desc`, `newest` |

---

## ⚡ Performance Notes

- Playwright runs in headless mode in production
- Parallel scraping via orchestrator reduces total wait time
- MongoDB caching avoids duplicate scraping for repeated queries
- DOM parsing optimized for minimal evaluation overhead



## 🧪 Example Flow

```
1. User searches: "iphone 16"

2. API triggers:
   GET /findly?q=iphone&source=amazon,noon

3. System:
   → Scrapes Amazon + Noon in parallel
   → Stores results in MongoDB
   → Returns summary response

4. Frontend fetches:
   GET /products?q=iphone&sort=price_asc
```

---

## 👨‍💻 Author

Built by **Abdelrahman Youssef**
