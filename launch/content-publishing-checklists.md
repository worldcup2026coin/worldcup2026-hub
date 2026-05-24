# Content Publishing Checklists

## Blog post publishing

1. Choose category:
   - match_previews
   - team_guides
   - group_previews
   - stadium_host_city_guides
   - what_to_watch_today
   - fan_culture
   - crypto_native_football_culture
   - community_roundups

2. Check title:
   - Football-first
   - Clear search intent
   - No token/presale/fundraising language

3. Check slug:
   - lowercase
   - hyphenated
   - unique

4. Check excerpt:
   - 1-2 sentences
   - Useful on cards and social previews

5. Check body:
   - Has headings
   - Has internal links to fixtures/teams/groups/matches/news
   - No unsupported claims
   - No copyrighted copied content

6. Check SEO:
   - seo_title filled
   - seo_description filled
   - featured_image_url optional but safe

7. Publish:
   - status = published
   - published_at = now()

## Prediction publishing

1. Link to the correct fixture_id.
2. Choose type:
   - fan_preview
   - fantasy_tip
   - betting_style

3. Use safe wording:
   - model lean
   - prediction
   - fan insight
   - risk level

4. Avoid banned wording:
   - banker
   - lock
   - sure thing
   - guaranteed

5. Fill risk_level:
   - low
   - medium
   - high
   - no_lean

6. Add key_factors JSON.
7. Add players_to_watch JSON only if useful.
8. Add disclaimer for betting-style content.
9. Publish:
   - status = published
   - published_at = now()

## Poll publishing

1. Choose context_type:
   - homepage
   - fixture
   - team
   - community
   - general

2. Use clear football question.
3. Add options JSON:
   [
     { "id": "option_one", "label": "Option One" },
     { "id": "option_two", "label": "Option Two" }
   ]

4. Use status = published.
5. Test vote on local or preview.
