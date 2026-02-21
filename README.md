# WC26 Ticket Tracker

Personal dashboard for tracking FIFA World Cup 2026 ticket resale prices across multiple platforms.

## Features
- Multi-platform price tracking (FIFA Collect auto + StubHub/SeatGeek/Viagogo manual)
- Keep/Sell toggle per pair with live profit recalculation
- Per-platform fee analysis and net payout comparison
- Match-specific direct links to all resale platforms
- Price trend charts over time

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Click Deploy — no configuration needed
4. Share the URL with your partner

## Daily Usage

1. FIFA Collect prices auto-update (when cron is configured)
2. Check StubHub/SeatGeek for your matches using the built-in links
3. Click "+ Add Prices" → select platform → enter median Cat 1 pair prices
4. Review trends and fee comparisons to decide when to sell

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
