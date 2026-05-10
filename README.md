# Vintage Decor Finder

A static vintage decor discovery site with curated style, room, and keyword landing pages.

## Local Files

- `index.html` - homepage
- `styles.css` - shared site styles
- `app.js` - homepage interactions
- `generate-pages.js` - generates SEO landing pages, `sitemap.xml`, and `robots.txt`
- `styles/`, `rooms/`, `keywords/` - generated landing pages
- `about.html`, `contact.html`, `privacy.html`, `terms.html`, `affiliate-disclosure.html` - trust and policy pages

## Regenerate Pages

```powershell
node generate-pages.js
```

Then verify:

```powershell
node --check app.js
node --check generate-pages.js
```

## Cloudflare Pages Deployment

Use the GitHub repository as the source.

Recommended Cloudflare Pages settings:

- Framework preset: `None`
- Production branch: `master`
- Build command: leave blank
- Build output directory: `/`
- Root directory: leave empty

After the first deployment, Cloudflare will provide a temporary Cloudflare URL. Use that URL to verify the site before buying or connecting a custom domain.

## Before Custom Domain Launch

When a final domain is chosen:

1. Update the canonical domain inside `generate-pages.js`.
2. Run `node generate-pages.js`.
3. Commit and push the regenerated `sitemap.xml`, `robots.txt`, and landing pages.
4. Connect the custom domain in Cloudflare Pages.

## Email Collection

The homepage email form is ready for a Formspree endpoint.

To connect it:

1. Create a Formspree account and verify your email.
2. Create a new form in the Formspree dashboard.
3. Copy the form endpoint, which looks like `https://formspree.io/f/FORM_ID`.
4. Replace the empty `action=""` on `#email-form` in `index.html` with that endpoint.
5. Commit and push the change.

Until the endpoint is added, the form will show a setup message instead of pretending to collect emails.
