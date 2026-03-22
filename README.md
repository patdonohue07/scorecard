# Scorecard
Pairs trading signal dashboard tracking four equity pairs — BAC/JPM, V/MA, PEP/KO, and SLV/GLD.
Uses beta-adjusted overnight gap shocks ranked against historical distributions to generate intraday trade signals. Entry at open, exit at close, dollar neutral.
Built in Python with Alpaca paper trading integration. Signal logic verified against a custom HTML dashboard.
## Pairs
- BAC / JPM — beta 0.799, fires both directions
- V / MA — beta 0.648, fires both directions
- PEP / KO — beta 0.536, fires both directions
- SLV / GLD — beta 1.491, fires both directions with TOW, same-side, and volume filters
## Stack
- Python / alpaca-py
- Polygon for market data (coming)
- Alpaca for paper trade execution (coming)
