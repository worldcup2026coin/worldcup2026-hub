# WC26 Mobile UI Audit Workflow

You are auditing the mobile experience of the WorldCup2026Coin / worldcup2026-hub project.

Project context:
- The site is a football-first World Cup 2026 hub with a fan-made $WC26 community layer.
- Mobile users are likely coming from X/Twitter, Telegram, pump.fun, and shared prediction/bracket links.
- Mobile credibility matters more than desktop for launch traffic.
- Do not edit files unless the user explicitly approves changes.

Primary goal:
Find mobile layout, spacing, navigation, sticky CTA, overflow, readability, tap-target, and visual credibility issues before public launch.

Key mobile widths to check:
- 360px
- 375px
- 390px
- 414px
- 430px

Important routes:
- /
- /launch
- /wc26
- /how-to-buy
- /community
- /community/chat
- /community/memes
- /community/meme-generator
- /community/quiz
- /fan-polls
- /predictions
- /prediction-leaderboard
- /predictions/bracket-challenge
- /fixtures
- /groups
- /teams
- /host-cities
- /stadiums
- /news
- /account
- /admin/launch-control

Required checks:
1. No horizontal overflow.
2. No sticky CTA covering buttons, forms, chat, prediction controls, or footer links.
3. Header and footer readable on mobile.
4. Cards do not feel cramped or broken.
5. Forms and buttons have enough tap space.
6. Long names, team names, stadium names, and URLs wrap safely.
7. Prediction/bracket pages remain usable on mobile.
8. Community/chat/meme pages are not blocked by fixed elements.
9. Crypto safety messaging remains visible and not buried.
10. Visual hierarchy is clear: football hub first, $WC26 safety second.

Required commands to suggest:
- npm run lint
- npm run typecheck
- npm run build
- any existing mobile overflow QA scripts
- any existing Playwright/browser route checks

Required output:
- Overall verdict: PASS / PASS WITH FIXES / BLOCKED
- Critical blockers
- High priority mobile fixes
- Medium priority improvements
- Low priority polish
- Route-by-route notes
- Exact screenshots or routes that need manual visual review
- Do not edit files unless user explicitly approves
