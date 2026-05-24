# Phase 9B UX, Lighthouse and Domain Launch Checklist

## UX QA

### Homepage
- [ ] Hero clearly explains the site
- [ ] Featured match is visible
- [ ] Next matches are visible
- [ ] Latest predictions are visible
- [ ] Latest articles are visible
- [ ] Trending teams are visible
- [ ] Poll is easy to vote on
- [ ] Email signup is clear
- [ ] No Phase 1 placeholder language remains above the fold

### Navigation
- [ ] Mobile menu opens
- [ ] Mobile menu closes
- [ ] All mobile links work
- [ ] Desktop nav links work
- [ ] Footer links work

### Football pages
- [ ] Fixtures page loads
- [ ] Fixture filters work
- [ ] Live page shows live or upcoming fallback
- [ ] Groups page loads
- [ ] Teams page loads
- [ ] Team detail page loads
- [ ] Match detail page loads
- [ ] Missing events/stats/lineups show good empty states

### Content
- [ ] Predictions page loads
- [ ] Prediction detail page loads
- [ ] Blog/news hub loads
- [ ] Blog post loads
- [ ] Category page loads
- [ ] Privacy page loads
- [ ] Terms page loads

### Community
- [ ] Poll vote works
- [ ] Duplicate vote protection works
- [ ] Email signup works with consent
- [ ] Email signup rejects missing consent
- [ ] Share on X opens
- [ ] Copy link works
- [ ] No token/presale/fundraising language
- [ ] No gambling affiliate links

## Lighthouse QA

Run Chrome DevTools Lighthouse on:
- [ ] /
- [ ] /fixtures
- [ ] /matches/2026-06-11-mexico-vs-south-africa-1489369
- [ ] /teams/mexico-16
- [ ] /news
- [ ] /community

Targets:
- [ ] Performance 80+
- [ ] Accessibility 90+
- [ ] Best Practices 90+
- [ ] SEO 90+

## SEO QA

- [ ] /robots.txt uses production domain
- [ ] /sitemap.xml uses production domain
- [ ] Sitemap includes match pages
- [ ] Sitemap includes team pages
- [ ] Sitemap includes news pages
- [ ] Sitemap includes prediction pages
- [ ] Match page has SportsEvent schema
- [ ] Team page has SportsTeam schema
- [ ] Blog post has Article schema
- [ ] Canonicals use production domain
- [ ] OG metadata appears
- [ ] Twitter/X metadata appears

## Domain QA

- [ ] Domain added in Vercel
- [ ] www domain added in Vercel
- [ ] Namecheap DNS records added
- [ ] Existing MX/SPF/DKIM/DMARC email records preserved
- [ ] HTTPS works
- [ ] www redirects cleanly
- [ ] non-www redirects cleanly
- [ ] NEXT_PUBLIC_SITE_URL updated to final canonical domain
- [ ] Vercel redeployed after NEXT_PUBLIC_SITE_URL update
- [ ] /robots.txt uses final domain
- [ ] /sitemap.xml uses final domain

## Search and analytics

- [ ] Vercel Analytics enabled
- [ ] Google Search Console property added
- [ ] Google verification env var added if using HTML tag
- [ ] Bing Webmaster Tools property added
- [ ] Bing verification env var added if using HTML tag
- [ ] Sitemap submitted to Google
- [ ] Sitemap submitted to Bing

## Launch safety

- [ ] .env.local ignored by Git
- [ ] No real secrets in src files
- [ ] Launch audit route returns ok with secret
- [ ] Launch audit route rejects without secret
- [ ] Admin sync routes protected
- [ ] Betting disclaimer visible
- [ ] Privacy page exists
- [ ] Terms page exists
