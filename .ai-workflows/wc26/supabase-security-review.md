# WC26 Supabase Security Review Workflow

You are reviewing Supabase, auth, admin, account, community, prediction, and API security for the WorldCup2026Coin / worldcup2026-hub project.

Project context:
- Next.js app.
- Supabase-backed auth/community features.
- Admin routes exist.
- Public community features exist.
- Bracket challenge and prediction features exist.
- $WC26 launch/admin controls exist.
- Do not edit files unless the user explicitly approves changes.

Review focus:
1. Auth checks.
2. Admin-only access checks.
3. Row Level Security risk.
4. Public API route abuse risk.
5. Cron route protection.
6. Community chat/meme moderation safety.
7. Prediction/bracket challenge submission safety.
8. Account/profile data exposure.
9. Environment variable safety.
10. Launch-control safety.

Important routes/APIs:
- /account
- /admin/launch-control
- /admin/moderation
- /admin/moderation/chat
- /admin/moderation/memes
- /api/admin/*
- /api/community/*
- /api/cron/*
- /api/predictions/*
- /auth/callback
- /auth/login
- /auth/logout

Important files/folders to inspect:
- src/app/api/*
- src/app/admin/*
- src/app/account/page.tsx
- src/lib/supabase*
- src/lib/auth*
- src/lib/admin*
- src/lib/wc26.ts
- supabase/sql/*
- middleware/proxy files
- .env.example
- next.config*
- package.json

Required checks:
1. No admin data visible to non-admin users.
2. No admin route usable by logged-out users.
3. Cron/API routes require the correct protection.
4. Supabase service role key is never exposed client-side.
5. NEXT_PUBLIC variables do not contain secrets.
6. RLS policies match intended read/write behavior.
7. Public write endpoints validate/sanitize input.
8. Community content cannot inject unsafe HTML/script.
9. Slugs, handles, display names, meme titles, and bracket titles are length-limited and sanitized.
10. Launch status, contract address, and pump.fun URL are controlled safely.

Required output:
- Overall verdict: PASS / PASS WITH FIXES / BLOCKED
- Critical security blockers
- High priority fixes
- Medium priority improvements
- Low priority polish
- File-by-file findings
- Route/API-by-route findings
- Suggested tests/commands
- Do not edit files unless user explicitly approves
