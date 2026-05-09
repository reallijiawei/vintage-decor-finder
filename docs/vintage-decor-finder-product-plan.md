# Vintage Decor Finder Product Plan

## Context

Vintage Decor Finder is a lightweight SEO and tool website for overseas users, especially users in the United States. The goal is to discover a narrow, monetizable web opportunity that can be launched quickly, validated through search traffic, and later expanded into affiliate revenue, display ads, and paid digital products.

The chosen direction is low risk. Avoid finance, insurance, lending, medical, weight loss, adult, gambling, political, religious, or highly controversial topics.

## Product Positioning

Vintage Decor Finder helps users discover their vintage home decor style and turn vague inspiration into concrete shopping keywords, room ideas, and starter checklists.

Core promise:

> Find your vintage decor style, room ideas, and shopping keywords.

The site should not be a generic blog. Its main differentiation is converting a user's room, budget, colors, and preferred vibe into actionable shopping terms and decor combinations.

## Target Users

- US renters decorating apartments or small homes
- Homeowners adding vintage pieces without making a room look dated
- Etsy, eBay, Amazon, thrift, and Facebook Marketplace shoppers
- Pinterest users searching for aesthetic room ideas
- People who like vintage style but do not know what keywords to search

## Why This Opportunity

The opportunity is attractive because vintage decor has direct buying intent. Users do not only read inspiration articles; they often search Etsy, eBay, Amazon, and local marketplaces for pieces.

Trend signals discussed so far:

- 2026 home decor trends are moving from strict minimalism toward collected, expressive, nostalgic rooms.
- Vintage glassware, warm wood with patina, vintage lighting, oversized vintage artwork, small accessories, and 70s jewel tones are recurring trend themes.
- Pinterest-style visual discovery fits this domain well.
- A finder or quiz can generate more engagement than static articles.

## MVP Scope

The first version should be small enough to ship in 1-2 weeks.

Build these parts first:

1. Home page with the Vintage Decor Finder tool
2. Quiz/result flow that recommends a vintage style and shopping keywords
3. Eight style pages
4. Eight room pages
5. Twenty shopping keyword pages
6. Affiliate search link placeholders
7. Email capture for a downloadable shopping checklist

Avoid in v1:

- User accounts
- Paid subscriptions
- Complex image upload or image recognition
- Real-time product scraping
- Marketplace inventory database
- Checkout/payment system

## Finder Tool

The finder should ask 6-8 questions.

Suggested inputs:

- Room type: living room, bedroom, kitchen, dining room, bathroom, home office, reading nook, small apartment
- Budget: under $100, $100-$300, $300-$750, $750+
- Preferred vibe: cozy, romantic, dramatic, colorful, elegant, rustic, playful, minimalist vintage
- Existing colors: cream, warm wood, black, brass, burgundy, olive, blue, terracotta, jewel tones
- Vintage intensity: subtle accents, balanced mix, bold statement room
- Shopping focus: lighting, wall art, glassware, furniture, textiles, small accessories
- Home constraint: renter-friendly, small space, pet-friendly, kid-friendly, low maintenance

Suggested outputs:

- Vintage style name
- Short explanation of why the style fits
- 10 shopping keywords
- 8 starter items
- 3 color palette suggestions
- Room-specific styling tips
- Search links for Etsy, eBay, and Amazon
- Email CTA: "Send me my vintage shopping checklist"

## Initial Style Taxonomy

Start with these eight style categories:

1. Warm 70s Revival
2. Vintage Modern Mix
3. Grandmillennial Cozy
4. Neo Deco Apartment
5. Cottage Vintage
6. Art Deco Inspired
7. Moody Library Vintage
8. Soft Romantic Vintage

Each style should include:

- Description
- Best rooms
- Color palette
- Materials and textures
- Starter item list
- Shopping keywords
- Mistakes to avoid
- Internal links to relevant room and keyword pages

## Initial Pages

### Style Pages

- `/styles/70s-vintage-decor`
- `/styles/grandmillennial-decor`
- `/styles/neo-deco-decor`
- `/styles/vintage-modern-mix`
- `/styles/cottage-vintage-decor`
- `/styles/art-deco-inspired-decor`
- `/styles/vintage-lighting`
- `/styles/vintage-gallery-wall`

### Room Pages

- `/rooms/vintage-living-room`
- `/rooms/vintage-bedroom`
- `/rooms/vintage-small-apartment`
- `/rooms/vintage-kitchen`
- `/rooms/vintage-bathroom`
- `/rooms/vintage-reading-nook`
- `/rooms/vintage-home-office`
- `/rooms/vintage-dining-room`

### Shopping Keyword Pages

Start with these:

- vintage brass lamp
- murano glass lamp
- vintage wall art
- vintage candlestick holders
- vintage glassware
- warm wood vintage furniture
- 70s jewel tone decor
- vintage patterned wallpaper
- vintage landscape print
- scalloped edge tray
- amber glass vase
- burgundy velvet throw pillow
- vintage ceramic vase
- art deco mirror
- vintage picture frame
- rattan vintage chair
- vintage table lamp
- brass wall sconce
- floral vintage rug
- vintage nesting tables

## SEO Strategy

The site should target both inspiration and shopping-intent searches.

Primary keyword patterns:

- vintage decor finder
- vintage decor ideas
- vintage decor for small apartments
- how to mix vintage and modern furniture
- vintage living room ideas
- vintage bedroom ideas
- vintage decor shopping keywords
- vintage lighting ideas
- vintage gallery wall ideas
- 70s vintage decor ideas

Tool/search-intent keywords:

- vintage decor quiz
- find my vintage decor style
- vintage home style quiz
- vintage decor shopping list
- Etsy vintage decor keywords
- eBay vintage decor search terms

Content strategy:

- The tool page should be the main conversion page.
- Style and room pages should capture SEO traffic.
- Keyword pages should capture buying intent and push affiliate search links.
- Every page should link back into the finder tool.

## Monetization

Phase 1:

- Etsy affiliate links for wall art, vintage decor, printables, textiles, and accessories
- eBay Partner Network links for real vintage pieces
- Amazon affiliate links for vintage-inspired substitutes
- Display ads once traffic is meaningful
- Email capture for a free checklist

Phase 2:

- $5-$9 downloadable vintage decor moodboard PDF
- $9 room starter kit
- $19 small apartment vintage decor plan
- Sponsored placements after the site has traffic

## Data Model

The v1 can use static JSON rather than a database.

Suggested files:

- `styles.json`: style categories, palettes, keywords, starter items
- `rooms.json`: room types, constraints, recommended item types
- `keywords.json`: shopping keyword pages and affiliate query terms
- `quiz-rules.json`: mapping from answers to style scores

Suggested style object:

```json
{
  "id": "warm-70s-revival",
  "name": "Warm 70s Revival",
  "description": "A cozy vintage look built around warm wood, amber glass, brass, velvet, and earthy color.",
  "bestRooms": ["living-room", "bedroom", "reading-nook"],
  "palette": ["warm wood", "amber", "cream", "olive", "burgundy"],
  "starterItems": ["brass floor lamp", "amber glass vase", "velvet pillow", "vintage landscape print"],
  "shoppingKeywords": ["vintage brass floor lamp", "amber glass vase", "70s jewel tone decor"],
  "avoid": ["too many dark pieces in a small room", "matching every item from the same era"]
}
```

## Result Algorithm

Start simple:

1. Each quiz answer adds points to one or more styles.
2. Pick the highest scoring style.
3. Use room type and budget to filter starter items.
4. Generate shopping keywords from style + room + shopping focus.
5. Show affiliate search links using URL-encoded keywords.

Example:

User answers:

- Room: small apartment living room
- Vibe: cozy but not cluttered
- Budget: under $300
- Colors: warm wood, cream, burgundy

Output keywords:

- vintage brass floor lamp
- burgundy velvet throw pillow
- warm wood nesting tables
- framed vintage landscape print
- scalloped edge tray
- amber glass vase
- small apartment gallery wall set

## Technical Direction

Recommended v1 stack:

- Next.js or Astro for SEO-friendly pages
- Static JSON data
- No login
- No database in the first version unless needed
- Deploy on Vercel, Cloudflare Pages, or Netlify
- Use Google Search Console from day one
- Add analytics with Plausible, Umami, or Google Analytics

If speed matters most, Astro is a strong choice for static SEO pages. If the finder tool is likely to become more interactive, Next.js is also fine.

## Deployment Notes

For a US-facing site:

- Buy a `.com` domain if possible.
- Deploy on overseas infrastructure such as Vercel, Cloudflare Pages, or Netlify.
- If the site is not hosted on a mainland China server, China ICP filing is generally not needed.
- If later deploying to mainland China infrastructure, ICP filing would be required.

## Payments

Do not add paid checkout in v1. Start with affiliate links and email capture.

Later options:

- Stripe if an eligible supported-country entity/bank account is available
- Paddle or Lemon Squeezy for digital products and merchant-of-record style handling
- Gumroad, Ko-fi, or Buy Me a Coffee for early digital downloads
- PayPal-based payout platforms if no foreign bank account is available

## Two-Week MVP Plan

Days 1-2:

- Pick brand/domain candidates
- Finalize style taxonomy
- Define JSON data structure
- Write homepage and finder copy

Days 3-5:

- Build finder tool
- Build result page
- Create affiliate search link generator

Days 6-8:

- Create eight style pages
- Create eight room pages
- Add internal links

Days 9-10:

- Create twenty shopping keyword pages
- Add SEO metadata and schema where useful
- Add email capture CTA

Days 11-14:

- Deploy
- Add analytics and Search Console
- Publish initial Pinterest pins
- Submit sitemap
- Review first indexing and impression data

## Open Decisions

- Final domain/brand name
- Exact tech stack: Astro or Next.js
- Affiliate networks to apply for first
- Whether v1 should include generated moodboard images or only text/checklists
- Whether to use AI generation in v1 or keep results rule-based

## Current Recommendation

Build a rule-based, SEO-first MVP before adding AI or payment. The first site should prove that users search for and click into vintage decor style and shopping keyword pages. Once the site shows impressions or early traffic, add paid PDF moodboards and more automated recommendation features.
