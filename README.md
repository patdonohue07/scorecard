# Scorecard

Pairs trading signal dashboard tracking three verified equity pairs — BAC/JPM, V/MA, and PEP/KO.

Uses beta-adjusted overnight gap shocks ranked against historical distributions to generate intraday trade signals. Entry at open, exit at close, dollar neutral.

## Strategy

Each morning the script calculates the overnight gap for each ticker (open / prev close - 1), computes a beta-adjusted spread, and ranks it against a historical shock distribution. A trade fires when the percentile hits the threshold.

## Pairs

| Pair | Beta | Threshold | Win Rate | 3yr P&L |
|------|------|-----------|----------|---------|
| BAC / JPM | 0.799 | 75 / 25 | 55.3% | +$556 |
| V / MA | 0.648 | 75 / 25 | 63.4% | +$1,036 |
| PEP / KO | 0.536 | 85 / 15 | 59.3% | +$279 |

Backtest: 2023–2026, Yahoo Finance data, $1,000 per leg, open to close.
Combined 3-year P&L: +$1,871

## Files

- `scorecard_v6.html` — signal dashboard, run in browser each morning
- `scorecard_deploy_v6.py` — automated deployment via Alpaca paper trading

## Stack

- Python / alpaca-py
- Yahoo Finance for backtesting
- Alpaca for paper trade execution
- Signal logic verified against HTML dashboard

## Status

Paper trading — live deployment coming.
