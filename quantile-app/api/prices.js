const TICKERS = ["V", "MA", "PG", "CL", "LOW", "HD", "MS", "GS", "BAC", "JPM"];
const BASE_URL = "https://data.alpaca.markets/v2";

function isMarketOpen() {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  const mins = et.getHours() * 60 + et.getMinutes();
  return day >= 1 && day <= 5 && mins >= 570 && mins < 960;
}

function getETDateString(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" })).toISOString().slice(0, 10);
}

function subtractDays(dateStr, days) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function fetchDailyBars(ticker, apiKey, secretKey, startDate, endDate) {
  const url = `${BASE_URL}/stocks/${ticker}/bars?timeframe=1Day&start=${startDate}&end=${endDate}&adjustment=raw&feed=iex`;
  const res = await fetch(url, {
    headers: { "APCA-API-KEY-ID": apiKey, "APCA-API-SECRET-KEY": secretKey },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Alpaca error for ${ticker}: ${res.status} ${text}`);
  }
  const data = await res.json();
  const bars = data.bars;
  if (!bars || bars.length < 1) throw new Error(`No bars returned for ${ticker}`);
  return bars;
}

async function getPricesForTicker(ticker, apiKey, secretKey, todayET) {
  const startDate = subtractDays(todayET, 10);
  const endDate = subtractDays(todayET, -1);
  const bars = await fetchDailyBars(ticker, apiKey, secretKey, startDate, endDate);
  const todayBar = bars.find(b => b.t.slice(0, 10) === todayET);
  const prevBars = bars.filter(b => b.t.slice(0, 10) < todayET);
  if (prevBars.length === 0) throw new Error(`No previous trading day bar for ${ticker}`);
  const yesterdayBar = prevBars[prevBars.length - 1];
  return { prev_close: yesterdayBar.c, open: todayBar ? todayBar.o : null };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  const apiKey = process.env.ALPACA_API_KEY;
  const secretKey = process.env.ALPACA_SECRET_KEY;
  if (!apiKey || !secretKey) return res.status(500).json({ error: "Alpaca API keys not configured" });
  const now = new Date();
  const etNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const todayET = getETDateString(now);
  try {
    const results = await Promise.all(
      TICKERS.map(async (ticker) => {
        const prices = await getPricesForTicker(ticker, apiKey, secretKey, todayET);
        return { ticker, ...prices };
      })
    );
    const tickers = {};
    for (const { ticker, prev_close, open } of results) {
      tickers[ticker] = { prev_close, open };
    }
    return res.status(200).json({
      date: todayET,
      time: `${String(etNow.getHours()).padStart(2, "0")}:${String(etNow.getMinutes()).padStart(2, "0")}`,
      market: isMarketOpen() ? "open" : "closed",
      tickers,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
