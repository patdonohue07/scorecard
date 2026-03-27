# Quantile
Pairs trading signal dashboard for equity markets.

Built by a high school senior with two years of trading experience. Quantile generates intraday long/short signals using beta-adjusted overnight gap shocks, ranked against a historical distribution of 3 years of market data.

Live paper trading on Alpaca. Five pairs, dollar neutral, open-to-close.

---

## How It Works
At market open (9:30 AM ET), each stock in a pair has gapped up or down from the previous close. Quantile computes a shock — the lead stock's gap adjusted for how much the target stock moved, weighted by their beta relationship.

    shock = lead_gap − β × target_gap

That shock is ranked against every opening shock over the past 3 years. If it hits the threshold percentile, a signal fires — short the lead, long the target (or vice versa), betting on mean reversion by close.

---

## Pairs

| Pair | Beta | Threshold |
|------|------|-----------|
| V / MA | 0.648 | ≥75th / ≤25th |
| LOW / HD | 0.965 | ≥70th / ≤30th |
| PG / CL | 0.715 | ≥90th / ≤10th |
| MS / GS | 0.973 | ≥80th / ≤20th |
| BAC / JPM | 0.799 | ≥85th / ≤15th |

---

## Backtest Results
Jan 2023 – Mar 2026 · $100/leg · open-to-close · dollar neutral · slippage included

| Pair | Trades | Win Rate | Sharpe | Sortino | Max DD |
|------|--------|----------|--------|---------|--------|
| V/MA | 316 | 63.6% | 3.47 | 4.26 | $3.20 |
| LOW/HD | 457 | 59.7% | 2.44 | 2.86 | $6.54 |
| PG/CL | 156 | 62.8% | 1.97 | 1.50 | $4.42 |
| MS/GS | 308 | 59.1% | 1.74 | 1.52 | $8.17 |
| BAC/JPM | 177 | 54.2% | 1.16 | 1.03 | $11.89 |
| **Combined** | **865** | **59.7%** | **2.75** | **3.94** | **$30** |

Backtest logic verified against HTML scorecard dashboard. Sharpe calculated across all trading days including zero-return days. Slippage included at 0.02% per leg.

---

## App — Quantile UI
React dashboard with three tabs:
- **Signals** — enter opening prices, get a real-time signal with live percentile bar
- **Log** — persistent trade log with outcome tracking, P&L, and notes
- **Research** — full backtest stats and methodology

Files:
- `app/QuantX V1` — first React build
- `app/QuantX V2` — current version: pure black, electric blue, signal mark logo, trade log

---

## Backend
Files:
- `backend/Scorecard Deploy Code` — Alpaca paper trading deployment script. Run at 9:30 AM ET daily. Fetches prices, computes signals, places paper trades automatically.
- `backend/Backtest Code` — full backtesting engine using Yahoo Finance OHLCV data

Setup:

    pip install alpaca-py yfinance pandas numpy

    export ALPACA_API_KEY="your_key"
    export ALPACA_SECRET_KEY="your_secret"

    python "Scorecard Deploy Code"

Automate with a cron job at 9:30 AM ET on weekdays:

    30 9 * * 1-5 python /path/to/scorecard_deploy.py

---

## Dashboard
`dashboard/Scorecard V6` — original HTML scorecard. Open in any browser, no dependencies. Enter prices manually and get signals with percentile rankings. The logic in this file is the source of truth that the Python backtest and React app were both verified against.

---

## Repo Structure

    api/
      prices.js              ← Vercel serverless price fetcher
    app/
      QuantX V1              ← initial React build
      QuantX V2              ← current build
    backend/
      Scorecard Deploy Code  ← Alpaca deployment script
      Backtest Code          ← backtesting engine
    dashboard/
      Scorecard V6           ← original HTML dashboard
    index.html               ← landing page (quantile.online)
    setup.sh                 ← one-command setup
    vercel.json              ← Vercel routing config
    .env.example             ← API key template
    README.md

---

## Status
- ✅ Strategy research and pair selection (5 pairs)
- ✅ 3-year backtest with Sharpe/Sortino/max drawdown
- ✅ Correct Sharpe methodology (all trading days, slippage included)
- ✅ HTML scorecard dashboard
- ✅ React app with signal generation
- ✅ Alpaca paper trading deployment script
- ✅ Persistent trade log with P&L tracking
- ✅ Vercel serverless API layer (api/prices.js)
- ✅ One-command setup script (setup.sh)
- ✅ Landing page (quantile.online)
- ⬜ Vercel deployment (app.quantile.online)
- ⬜ Cron job automation
- ⬜ Live price auto-population via Alpaca API
- ⬜ Real-time P&L from paper account

---

*For research and educational purposes only. Not financial advice.*
