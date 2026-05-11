const fs = require("fs");
const path = require("path");
const { marketplaceNames, marketplaceUrl } = require("./marketplaces");

const siteUrl = (process.env.SITE_URL || "https://vintagedecorfinder.com").replace(/\/+$/, "");
const analyticsSnippet = `<!-- Cloudflare Web Analytics -->
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"b25547a7fdae42c883d5d9797b6a375b"}'></script>
    <!-- End Cloudflare Web Analytics -->`;
const lastmod = new Date().toISOString().slice(0, 10);

const stylePages = [
  ["70s-vintage-decor", "70s Vintage Decor", "Warm wood, amber glass, brass lamps, velvet, and earthy color for a modern 70s room."],
  ["grandmillennial-decor", "Grandmillennial Decor", "Florals, pleats, scallops, vintage textiles, and inherited-home charm without clutter."],
  ["neo-deco-decor", "Neo Deco Decor", "Art Deco geometry, brass, black accents, glossy shapes, and apartment-friendly drama."],
  ["vintage-modern-mix", "Vintage Modern Mix", "Clean modern rooms softened with vintage lighting, art, frames, and patina."],
  ["cottage-vintage-decor", "Cottage Vintage Decor", "Stoneware, botanical prints, linen, baskets, soft wood, and garden-inspired details."],
  ["art-deco-inspired-decor", "Art Deco Inspired Decor", "Mirrors, fluting, marble trays, brass details, and evening-room polish."],
  ["vintage-lighting", "Vintage Lighting", "Table lamps, sconces, library lamps, pleated shades, and warm vintage glow."],
  ["vintage-gallery-wall", "Vintage Gallery Wall", "Landscape prints, portraits, botanical art, carved frames, and collected wall layouts."],
];

const roomPages = [
  ["vintage-living-room", "Vintage Living Room Ideas", "Build the room around lighting, art, pillows, and one vintage anchor piece."],
  ["vintage-bedroom", "Vintage Bedroom Ideas", "Use soft light, layered textiles, vintage trays, framed art, and one warm wood surface."],
  ["vintage-small-apartment", "Vintage Small Apartment Ideas", "Choose compact pieces, reflective surfaces, wall art, and high-impact accessories."],
  ["vintage-kitchen", "Vintage Kitchen Decor", "Use useful vintage pieces: stoneware, glassware, hooks, trays, and framed small art."],
  ["vintage-bathroom", "Vintage Bathroom Decor", "Upgrade the room with a mirror, tray, towel palette, glass object, and small print."],
  ["vintage-reading-nook", "Vintage Reading Nook Ideas", "Start with a lamp, chair, small table, throw, and framed art at eye level."],
  ["vintage-home-office", "Vintage Home Office Ideas", "Add a brass task lamp, art, catchall, old wood surface, and quiet palette."],
  ["vintage-dining-room", "Vintage Dining Room Ideas", "Use a mirror, dining light, candle holders, glassware, and one dramatic textile."],
];

const keywordPages = [
  "vintage brass lamp",
  "murano glass lamp",
  "vintage wall art",
  "vintage candlestick holders",
  "vintage glassware",
  "warm wood vintage furniture",
  "70s jewel tone decor",
  "vintage patterned wallpaper",
  "vintage landscape print",
  "scalloped edge tray",
  "amber glass vase",
  "burgundy velvet throw pillow",
  "vintage ceramic vase",
  "art deco mirror",
  "vintage picture frame",
  "rattan vintage chair",
  "vintage table lamp",
  "brass wall sconce",
  "floral vintage rug",
  "vintage nesting tables",
];

const staticPages = [
  ["about", "0.4"],
  ["contact", "0.3"],
  ["privacy", "0.2"],
  ["terms", "0.2"],
  ["affiliate-disclosure", "0.2"],
];

const styleNotes = {
  "70s-vintage-decor": {
    rooms: ["vintage-living-room", "vintage-small-apartment", "vintage-reading-nook"],
    keywords: ["amber glass vase", "70s jewel tone decor", "vintage nesting tables"],
    materials: ["amber glass", "velvet", "warm walnut", "brass", "olive and burgundy accents"],
    mistake: "Do not stack every 70s signal at once. Keep one modern line or clean cream surface in the room.",
  },
  "grandmillennial-decor": {
    rooms: ["vintage-bedroom", "vintage-bathroom", "vintage-reading-nook"],
    keywords: ["floral vintage rug", "scalloped edge tray", "vintage ceramic vase"],
    materials: ["pleated shades", "floral textiles", "blue and white ceramics", "botanical prints", "needlepoint"],
    mistake: "Avoid patterns at the same scale. Pair one large floral with checks, solids, or narrow stripes.",
  },
  "neo-deco-decor": {
    rooms: ["vintage-dining-room", "vintage-bathroom", "vintage-small-apartment"],
    keywords: ["art deco mirror", "brass wall sconce", "vintage candlestick holders"],
    materials: ["black lacquer", "brass", "smoked glass", "velvet", "geometric rugs"],
    mistake: "Use brass as punctuation, not the whole sentence. Black, cream, and green keep it grounded.",
  },
  "vintage-modern-mix": {
    rooms: ["vintage-living-room", "vintage-home-office", "vintage-small-apartment"],
    keywords: ["vintage picture frame", "warm wood vintage furniture", "vintage table lamp"],
    materials: ["warm wood", "linen", "black metal", "aged frames", "ceramic catchalls"],
    mistake: "Do not make every item vintage. The room works when old pieces have visual space around them.",
  },
  "cottage-vintage-decor": {
    rooms: ["vintage-kitchen", "vintage-bedroom", "vintage-dining-room"],
    keywords: ["vintage glassware", "vintage ceramic vase", "rattan vintage chair"],
    materials: ["stoneware", "linen", "basketry", "botanical prints", "soft wood"],
    mistake: "Leave open shelf space. Cottage vintage looks better collected than packed.",
  },
  "art-deco-inspired-decor": {
    rooms: ["vintage-dining-room", "vintage-home-office", "vintage-bathroom"],
    keywords: ["art deco mirror", "brass wall sconce", "burgundy velvet throw pillow"],
    materials: ["fluted glass", "marble trays", "arched mirrors", "brass", "deep burgundy"],
    mistake: "Balance shine with velvet, matte black, or wood so the room still feels livable.",
  },
  "vintage-lighting": {
    rooms: ["vintage-living-room", "vintage-bedroom", "vintage-reading-nook"],
    keywords: ["vintage brass lamp", "murano glass lamp", "vintage table lamp"],
    materials: ["brass stems", "pleated shades", "milk glass", "ceramic bases", "library lamps"],
    mistake: "Check scale and shade condition before buying. A lamp can be beautiful and still too large.",
  },
  "vintage-gallery-wall": {
    rooms: ["vintage-living-room", "vintage-bedroom", "vintage-home-office"],
    keywords: ["vintage wall art", "vintage landscape print", "vintage picture frame"],
    materials: ["carved frames", "landscape prints", "portraits", "botanical art", "aged paper"],
    mistake: "Do not hang every frame at a different visual weight. Repeat one finish or mat tone.",
  },
};

const roomNotes = {
  "vintage-living-room": {
    focus: ["table lamp", "large framed art", "textured pillow", "small table", "tray or catchall"],
    skip: "Do not buy a full matching furniture set. One vintage anchor and smaller accents are easier to style.",
    keywords: ["vintage brass lamp", "vintage landscape print", "warm wood vintage furniture"],
  },
  "vintage-bedroom": {
    focus: ["soft lamp", "quilt or throw", "framed print", "vanity tray", "warm wood nightstand"],
    skip: "Avoid heavy dark pieces on both sides of the bed unless the room has strong natural light.",
    keywords: ["burgundy velvet throw pillow", "vintage ceramic vase", "vintage picture frame"],
  },
  "vintage-small-apartment": {
    focus: ["wall art", "reflective glass", "compact side table", "lamp", "one sculptural object"],
    skip: "Skip bulky storage pieces unless they solve a real layout problem.",
    keywords: ["vintage nesting tables", "murano glass lamp", "art deco mirror"],
  },
  "vintage-kitchen": {
    focus: ["stoneware", "glassware", "hooks", "tray", "small framed print"],
    skip: "Avoid fragile decor near prep zones. Useful vintage pieces hold up better.",
    keywords: ["vintage glassware", "vintage ceramic vase", "scalloped edge tray"],
  },
  "vintage-bathroom": {
    focus: ["mirror", "small tray", "towel color", "glass object", "tiny wall print"],
    skip: "Do not overcrowd the counter. Moisture and clutter make vintage pieces look accidental.",
    keywords: ["art deco mirror", "scalloped edge tray", "vintage glassware"],
  },
  "vintage-reading-nook": {
    focus: ["reading lamp", "small table", "throw", "framed art", "book stack"],
    skip: "Do not rely on overhead light. The lamp is the mood-setter.",
    keywords: ["vintage brass lamp", "vintage table lamp", "vintage wall art"],
  },
  "vintage-home-office": {
    focus: ["task lamp", "catchall", "framed art", "old wood surface", "quiet palette"],
    skip: "Avoid desk clutter. Vintage works best here as useful objects and one visual anchor.",
    keywords: ["vintage table lamp", "vintage picture frame", "brass wall sconce"],
  },
  "vintage-dining-room": {
    focus: ["mirror", "dining light", "candlesticks", "glassware", "one dramatic textile"],
    skip: "Do not make every piece formal. A relaxed textile or simple chair keeps the room usable.",
    keywords: ["vintage candlestick holders", "vintage glassware", "art deco mirror"],
  },
};

const keywordNotes = {
  "vintage brass lamp": ["Check wiring, shade size, base weight, and whether the patina reads warm instead of dirty.", "Use with library, 70s, deco, or vintage modern rooms."],
  "murano glass lamp": ["Compare color clarity, base condition, and whether the seller identifies it as Murano style or verified Murano.", "Works best as one sculptural statement, not one of many glass pieces."],
  "vintage wall art": ["Search by subject and frame material, not only by style name.", "Landscape, portrait, botanical, and architectural prints are easiest to mix."],
  "vintage candlestick holders": ["Check height in pairs and look for brass, silverplate, glass, or ceramic sets.", "Use them on dining tables, mantels, shelves, or bathroom trays."],
  "vintage glassware": ["Look for sets, chips, cloudiness, and dishwasher wear.", "Colored glass can add vintage character without buying furniture."],
  "warm wood vintage furniture": ["Prioritize measurements, veneer condition, and storage function.", "One warm wood piece can make a white room feel collected."],
  "70s jewel tone decor": ["Search amber, olive, burgundy, rust, and sapphire as separate color terms.", "Use jewel tones with cream and wood to avoid a heavy room."],
  "vintage patterned wallpaper": ["Order samples first and check scale against room size.", "Peel-and-stick can be safer for renters."],
  "vintage landscape print": ["Search by frame, size, and subject: mountain, lake, meadow, coastal, pastoral.", "Landscape prints are strong starter pieces for gallery walls."],
  "scalloped edge tray": ["Check material and size; many trays photograph larger than they are.", "Useful for vanities, coffee tables, nightstands, and entry consoles."],
  "amber glass vase": ["Look for shape, transparency, and whether the amber color works with your wood tone.", "Good low-cost entry point for 70s revival rooms."],
  "burgundy velvet throw pillow": ["Check insert size, zipper quality, and whether the velvet has enough depth.", "Burgundy works well with cream, brass, olive, and dark wood."],
  "vintage ceramic vase": ["Search by glaze, color, country, and silhouette.", "Matte or handmade ceramics can soften shiny brass and glass."],
  "art deco mirror": ["Check mounting hardware, weight, foxing, and edge wear.", "Arched and fan shapes create deco mood quickly."],
  "vintage picture frame": ["Search by size first, then material and finish.", "Frames are useful even when the original art is not."],
  "rattan vintage chair": ["Check cane breaks, seat height, and whether repairs are visible.", "Works in cottage, small apartment, and reading nook settings."],
  "vintage table lamp": ["Confirm working condition, shade fitting, cord condition, and total height.", "A table lamp is often the fastest vintage upgrade."],
  "brass wall sconce": ["Check hardwired vs plug-in, bulb type, and pair availability.", "Sconces help small rooms when surfaces are limited."],
  "floral vintage rug": ["Check material, pile, stains, and exact dimensions.", "Use one floral rug as the main pattern, then keep nearby textiles quieter."],
  "vintage nesting tables": ["Check wobble, water rings, and stacked footprint.", "Good for small apartments because they flex with guests and layouts."],
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function titleCase(text) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

function page(title, description, urlPath, body, structuredData = []) {
  const schemas = structuredData
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("\n    ");
  const absoluteUrl = `${siteUrl}/${urlPath}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} | Vintage Decor Finder</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${absoluteUrl}" />
    <meta property="og:site_name" content="Vintage Decor Finder" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title} | Vintage Decor Finder" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${absoluteUrl}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title} | Vintage Decor Finder" />
    <meta name="twitter:description" content="${description}" />
    <meta name="theme-color" content="#5f2a44" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Libre+Baskerville:wght@400;700&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../../styles.css" />
    ${schemas}
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="../../index.html#top"><span class="brand-mark">VDF</span><span>Vintage Decor Finder</span></a>
      <nav class="top-nav" aria-label="Main navigation">
        <a href="../../index.html#finder">Finder</a>
        <a href="../../index.html#styles">Styles</a>
        <a href="../../index.html#rooms">Rooms</a>
        <a href="../../index.html#keywords">Shopping Keywords</a>
      </nav>
    </header>
    <main class="band content-page">
      ${body}
    </main>
    <footer class="site-footer">
      <p>Use the finder to turn this idea into a shopping brief.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/affiliate-disclosure">Affiliate Disclosure</a>
      </nav>
    </footer>
    <script src="../../tracking.js?v=20260511-outbound-clicks"></script>
    ${analyticsSnippet}
  </body>
</html>
`;
}

function marketplaceLinks(query) {
  return `
    <div class="market-links">
      ${marketplaceNames().map((marketplace) => `<a class="button ghost" href="${marketplaceUrl(marketplace, query)}" target="_blank" rel="noreferrer" data-track-outbound data-marketplace="${marketplace}" data-query="${query}">Search ${marketplace}</a>`).join("\n      ")}
    </div>
    <p class="affiliate-note">Some marketplace links may become affiliate links. This does not affect your price.</p>
  `;
}

function linkList(title, links) {
  return `
    <section class="content-block">
      <h2>${title}</h2>
      <div class="internal-links">
        ${links.join("")}
      </div>
    </section>
  `;
}

function pageSchema(title, description, urlPath) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteUrl}/${urlPath}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Vintage Decor Finder",
      url: `${siteUrl}/`,
    },
  };
}

function breadcrumbSchema(title, urlPath, sectionName, sectionPath) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: sectionName, item: `${siteUrl}/${sectionPath}` },
      { "@type": "ListItem", position: 3, name: title, item: `${siteUrl}/${urlPath}` },
    ],
  };
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function sitemapUrl(urlPath, priority) {
  return `  <url>
    <loc>${siteUrl}/${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const sitemapEntries = [sitemapUrl("", "1.0")];
staticPages.forEach(([urlPath, priority]) => {
  sitemapEntries.push(sitemapUrl(urlPath, priority));
});

for (const [slug, title, description] of stylePages) {
  const urlPath = `styles/${slug}/`;
  const note = styleNotes[slug];
  sitemapEntries.push(sitemapUrl(urlPath, "0.8"));
  writeFile(path.join("styles", slug, "index.html"), page(title, description, urlPath, `
    <p class="eyebrow">Style guide</p>
    <h1>${title}</h1>
    <p class="hero-text">${description}</p>
    <section class="content-block">
      <h2>How this style works</h2>
      <p>${title} works best when the room has one clear anchor and a few repeated materials. Start with ${note.materials.slice(0, 3).join(", ")}, then add smaller accents only after the room direction is clear.</p>
      <div class="detail-grid">
        <div>
          <h3>Best materials</h3>
          <ul class="result-list">${note.materials.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>Common mistake</h3>
          <p>${note.mistake}</p>
        </div>
      </div>
    </section>
    <section class="finder-form">
      <h2>What to shop first</h2>
      <ul class="result-list">
        <li>One vintage lighting piece with visible character.</li>
        <li>One framed artwork or mirror to set the mood.</li>
        <li>Two small accessories that repeat the room palette.</li>
        <li>One texture piece: velvet, linen, wood, glass, brass, or ceramic.</li>
      </ul>
      ${marketplaceLinks(title)}
    </section>
    ${linkList("Related room guides", note.rooms.map((roomSlug) => `<a href="../../rooms/${roomSlug}/">${roomPages.find(([itemSlug]) => itemSlug === roomSlug)[1]}</a>`))}
    ${linkList("Shopping keywords to start with", note.keywords.map((keyword) => `<a href="../../keywords/${slugify(keyword)}/">${titleCase(keyword)}</a>`))}
  `, [pageSchema(title, description, urlPath), breadcrumbSchema(title, urlPath, "Styles", "index.html#styles")]));
}

for (const [slug, title, description] of roomPages) {
  const urlPath = `rooms/${slug}/`;
  const note = roomNotes[slug];
  sitemapEntries.push(sitemapUrl(urlPath, "0.8"));
  writeFile(path.join("rooms", slug, "index.html"), page(title, description, urlPath, `
    <p class="eyebrow">Room guide</p>
    <h1>${title}</h1>
    <p class="hero-text">${description}</p>
    <section class="content-block">
      <h2>Build the room in the right order</h2>
      <p>For a ${title.toLowerCase().replace(" ideas", "").replace(" decor", "")}, start with pieces that change the mood without forcing a full redesign. The safest first buys are practical, visible, and easy to move if the layout changes.</p>
      <div class="detail-grid">
        <div>
          <h3>Buy first</h3>
          <ul class="result-list">${note.focus.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>Skip for now</h3>
          <p>${note.skip}</p>
        </div>
      </div>
    </section>
    <section class="finder-form">
      <h2>Starter checklist</h2>
      <ul class="result-list">
        <li>Pick one vintage anchor instead of filling the whole room at once.</li>
        <li>Repeat one metal finish and one wood tone.</li>
        <li>Use lighting to make the room feel collected, not staged.</li>
        <li>Keep one modern element so the room does not feel dated.</li>
      </ul>
      ${marketplaceLinks(title)}
    </section>
    ${linkList("Search terms for this room", note.keywords.map((keyword) => `<a href="../../keywords/${slugify(keyword)}/">${titleCase(keyword)}</a>`))}
    ${linkList("Style directions that fit", stylePages.slice(0, 4).map(([styleSlug, styleTitle]) => `<a href="../../styles/${styleSlug}/">${styleTitle}</a>`))}
  `, [pageSchema(title, description, urlPath), breadcrumbSchema(title, urlPath, "Rooms", "index.html#rooms")]));
}

for (const keyword of keywordPages) {
  const title = titleCase(keyword);
  const slug = slugify(keyword);
  const urlPath = `keywords/${slug}/`;
  const notes = keywordNotes[keyword];
  sitemapEntries.push(sitemapUrl(urlPath, "0.7"));
  writeFile(path.join("keywords", slug, "index.html"), page(title, `Shopping keywords and marketplace links for ${keyword}.`, urlPath, `
    <p class="eyebrow">Shopping keyword</p>
    <h1>${title}</h1>
    <p class="hero-text">Use this term when searching marketplaces for vintage and vintage-inspired decor. Compare shape, material, measurements, and condition before buying.</p>
    <section class="content-block">
      <h2>How to use this search term</h2>
      <div class="detail-grid">
        <div>
          <h3>Buyer checks</h3>
          <p>${notes[0]}</p>
        </div>
        <div>
          <h3>Styling note</h3>
          <p>${notes[1]}</p>
        </div>
      </div>
    </section>
    <section class="finder-form">
      <h2>Search this keyword</h2>
      <p>Start broad, then add your room, color, or material. Example: "${keyword} small apartment" or "${keyword} brass".</p>
      ${marketplaceLinks(keyword)}
    </section>
    ${linkList("Useful room guides", roomPages.slice(0, 4).map(([roomSlug, roomTitle]) => `<a href="../../rooms/${roomSlug}/">${roomTitle}</a>`))}
  `, [pageSchema(title, `Shopping keywords and marketplace links for ${keyword}.`, urlPath), breadcrumbSchema(title, urlPath, "Shopping Keywords", "index.html#keywords")]));
}

writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join("\n")}
</urlset>
`);

writeFile("robots.txt", `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);

console.log("Generated style, room, and keyword pages.");
console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}.`);
