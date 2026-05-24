# Phase 9 Launch QA Checklist

## Public routes

- [ ] /
- [ ] /fixtures
- [ ] /live
- [ ] /groups
- [ ] /teams
- [ ] /teams/mexico-16
- [ ] /matches/2026-06-11-mexico-vs-south-africa-1489369
- [ ] /predictions
- [ ] /predictions/2026-06-11-mexico-vs-south-africa-1489369
- [ ] /news
- [ ] /news/mexico-world-cup-2026-team-guide
- [ ] /news/category/team-guides
- [ ] /stadiums
- [ ] /community
- [ ] /privacy
- [ ] /terms
- [ ] /not-a-real-page

## Mobile and desktop

- [ ] Mobile nav opens
- [ ] Mobile nav links work
- [ ] Desktop nav links work
- [ ] Footer links work
- [ ] Cards are readable on mobile
- [ ] Forms are usable on mobile

## Data and empty states

- [ ] Fixtures render
- [ ] Live page shows live or fallback upcoming fixtures
- [ ] Groups render
- [ ] Team pages render
- [ ] Match pages render
- [ ] Missing stats/events/lineups show safe empty states
- [ ] Blog empty states do not crash
- [ ] Prediction empty states do not crash

## Community

- [ ] Poll voting works
- [ ] Duplicate vote protection works
- [ ] Email signup works with consent
- [ ] Email signup rejects missing consent
- [ ] Share on X opens
- [ ] Copy link works
- [ ] Community page contains no token/presale language

## SEO

- [ ] /sitemap.xml loads
- [ ] /robots.txt loads
- [ ] Canonical URLs use production domain
- [ ] Match page has SportsEvent schema
- [ ] Team page has SportsTeam schema
- [ ] Blog post has Article schema
- [ ] Privacy and terms pages exist
- [ ] No admin/test/debug pages indexed

## Launch safety

- [ ] .env.local ignored by Git
- [ ] No real keys in src files
- [ ] SYNC_SECRET protects admin routes
- [ ] API-Football key is server-only
- [ ] Supabase service key is server-only
- [ ] No gambling affiliate links
- [ ] Betting-style disclaimer visible
- [ ] No guarantee wording
- [ ] No token launch content

## Production

- [ ] Vercel deployment passes
- [ ] Domain works
- [ ] HTTPS works
- [ ] Search Console submitted
- [ ] Analytics enabled
- [ ] Launch audit route returns ok/warning with no hard failures
