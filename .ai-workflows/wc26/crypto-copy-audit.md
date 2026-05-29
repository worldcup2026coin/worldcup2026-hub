# WC26 Crypto Copy Audit Workflow

You are auditing all crypto-related copy in the WorldCup2026Coin / worldcup2026-hub project.

Project identity:
- Project name: WorldCup2026Coin
- Ticker: $WC26
- Website: https://www.worldcup2026coin.com
- X/Twitter: https://x.com/WC26_Hub
- Telegram chat: https://t.me/WC26HubChat
- Telegram announcements: https://t.me/WC26Hub
- Launch: pump.fun
- Presale: none
- Fundraising: none
- Premium offering: none
- Official FIFA relationship: none

Hard rules:
- Do not claim or imply this is official FIFA, FIFA-backed, World Cup-backed, tournament-authorized, or sponsor-approved.
- Do not use profit claims such as guaranteed profit, 100x, moonshot, passive income, safe investment, risk-free, or buy before it pumps.
- Do not imply presale, private sale, investor allocation, fundraising round, premium holder access, token-gated rewards, or financial returns.
- Do not create fake urgency around price.
- Do not make financial advice claims.
- Do not show a contract address or pump.fun link unless the live environment variables are set.
- The project should be described as fan-made, unofficial, football-first, community-driven, and meme/community-layer where relevant.

Audit these likely files and routes:
- src/app/page.tsx
- src/app/launch/page.tsx
- src/app/wc26/page.tsx
- src/app/how-to-buy/page.tsx
- src/app/community/page.tsx
- src/app/community/memes/page.tsx
- src/app/community/chat/page.tsx
- src/app/community/quiz/page.tsx
- src/app/predictions/page.tsx
- src/app/prediction-leaderboard/page.tsx
- src/app/predictions/bracket-challenge/page.tsx
- src/components/wc26/*
- src/lib/wc26.ts
- Footer, header, mobile sticky CTA, hero CTA, launch blocks, disclaimer blocks, metadata.

Required checks:
1. Find risky crypto wording.
2. Find official-sounding wording.
3. Find overpromising community/reward/investment copy.
4. Find missing unofficial/fan-made disclaimers.
5. Find places where launch status, contract address, or pump.fun URL might show too early.
6. Find inconsistent ticker/name usage.
7. Find copy that may confuse football hub features with token benefits.
8. Find pages that need clearer safety language.

Required output:
- Overall verdict: PASS / PASS WITH FIXES / BLOCKED
- Critical blockers
- High priority copy fixes
- Medium priority copy improvements
- Low priority polish
- Exact file paths and page routes
- Before/after wording suggestions
- Do not edit files unless user explicitly approves
