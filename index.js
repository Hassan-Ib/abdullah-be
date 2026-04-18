import express from "express";

const app = express();

// cors middleware
app.use((req, res, next) => {
  // accepts request from 5500 and 5173 (frontend dev servers)
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

const yfApis = {
  bars: ({ symbol, interval, range }) =>
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&includePrePost=false`,

  quickPrices: (
    batch,
    fields = "fields=regularMarketPrice,regularMarketPreviousClose,regularMarketChangePercent",
  ) =>
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(batch)}&fields=${fields}`,
};
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});
app.get("v1/api/stock", async (req, res) => {
  const symbol = req.query.symbol || "AAPL";
  const interval = req.query.interval || "1m";
  const range = req.query.range || "2d";
  const response = await fetch(yfApis.bars({ symbol, interval, range }));
  const data = await response.json();
  console.log(data);
  res.json(data);
});

app.get("v2/api/quick", async (req, res) => {
  const batch = req.query.batch || "AAPL,MSFT,GOOGL";
  const fields =
    req.query.fields ||
    "regularMarketPrice,regularMarketPreviousClose,regularMarketChangePercent";
  const response = await fetch(yfApis.quickPrices(batch, fields));
  const data = await response.json();
  console.log(data);
  res.json(data);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
