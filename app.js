const options = {
  room: [
    ["living-room", "Living room"],
    ["bedroom", "Bedroom"],
    ["kitchen", "Kitchen"],
    ["dining-room", "Dining room"],
    ["bathroom", "Bathroom"],
    ["home-office", "Home office"],
    ["reading-nook", "Reading nook"],
    ["small-apartment", "Small apartment"],
  ],
  budget: [
    ["under-100", "Under $100"],
    ["100-300", "$100-$300"],
    ["300-750", "$300-$750"],
    ["750-plus", "$750+"],
  ],
  vibe: [
    ["cozy", "Cozy"],
    ["romantic", "Romantic"],
    ["dramatic", "Dramatic"],
    ["colorful", "Colorful"],
    ["elegant", "Elegant"],
    ["rustic", "Rustic"],
    ["playful", "Playful"],
    ["minimal", "Minimal vintage"],
  ],
  colors: [
    ["cream", "Cream"],
    ["warm-wood", "Warm wood"],
    ["black", "Black"],
    ["brass", "Brass"],
    ["burgundy", "Burgundy"],
    ["olive", "Olive"],
    ["blue", "Blue"],
    ["terracotta", "Terracotta"],
    ["jewel-tones", "Jewel tones"],
  ],
  intensity: [
    ["subtle", "Subtle accents"],
    ["balanced", "Balanced mix"],
    ["bold", "Bold statement room"],
  ],
  focus: [
    ["lighting", "Lighting"],
    ["wall-art", "Wall art"],
    ["glassware", "Glassware"],
    ["furniture", "Furniture"],
    ["textiles", "Textiles"],
    ["accessories", "Small accessories"],
  ],
};

const styles = [
  {
    id: "warm-70s-revival",
    name: "Warm 70s Revival",
    summary: "Amber glass, brass, velvet, warm wood, and earthy color without turning the room into a time capsule.",
    colors: ["#8b4f2d", "#c48943", "#f1d49a", "#6e2342", "#3f5b45"],
    tags: ["colorful", "cozy", "warm-wood", "brass", "jewel-tones", "bold", "lighting", "glassware"],
    bestRooms: ["living-room", "bedroom", "reading-nook", "small-apartment"],
    items: ["brass floor lamp", "amber glass vase", "burgundy velvet pillow", "warm wood nesting tables", "vintage landscape print", "olive throw blanket", "ceramic table lamp", "scalloped edge tray"],
    keywords: ["vintage brass floor lamp", "amber glass vase", "70s jewel tone decor", "warm wood nesting tables", "burgundy velvet throw pillow", "framed vintage landscape print", "scalloped edge tray", "olive vintage throw blanket", "ceramic mushroom lamp", "small apartment vintage living room"],
    avoid: "Too many heavy brown pieces in a small room. Mix in cream, brass, and one clean-lined modern item.",
  },
  {
    id: "vintage-modern-mix",
    name: "Vintage Modern Mix",
    summary: "Clean modern bones softened with patina, old frames, sculptural lamps, and one or two storied pieces.",
    colors: ["#f7efe1", "#a98255", "#2f2a26", "#547182", "#b78943"],
    tags: ["minimal", "balanced", "cream", "black", "blue", "furniture", "wall-art", "subtle"],
    bestRooms: ["living-room", "home-office", "small-apartment", "dining-room"],
    items: ["vintage picture frame", "black metal side table", "warm wood credenza", "linen pillow", "brass task lamp", "abstract vintage print", "ceramic catchall", "blue wool rug"],
    keywords: ["vintage modern living room", "warm wood credenza", "vintage picture frame set", "brass task lamp", "abstract vintage wall art", "modern vintage side table", "blue wool rug vintage", "linen pillow covers", "minimal vintage decor", "how to mix vintage and modern furniture"],
    avoid: "Buying every piece vintage. The look works because the old pieces have room to breathe.",
  },
  {
    id: "grandmillennial-cozy",
    name: "Grandmillennial Cozy",
    summary: "Pattern, pleats, florals, needlepoint, scallops, and inherited-home charm made apartment friendly.",
    colors: ["#f7d8cf", "#6d8b74", "#f9f0df", "#934e42", "#547182"],
    tags: ["cozy", "romantic", "cream", "blue", "subtle", "textiles", "wall-art", "accessories"],
    bestRooms: ["bedroom", "reading-nook", "bathroom", "living-room"],
    items: ["floral vintage rug", "pleated lampshade", "needlepoint pillow", "blue and white vase", "scalloped tray", "framed botanical print", "ruffled curtain panel", "vintage quilt"],
    keywords: ["grandmillennial decor", "pleated lampshade vintage", "needlepoint pillow", "blue and white vase", "floral vintage rug", "framed botanical print", "scalloped tray", "vintage quilt bedroom", "ruffled curtain panel", "cozy vintage bedroom ideas"],
    avoid: "Letting patterns compete at the same scale. Pair one large floral with smaller checks or solids.",
  },
  {
    id: "neo-deco-apartment",
    name: "Neo Deco Apartment",
    summary: "Art Deco geometry, glossy accents, brass, black, and sculptural shapes scaled for real apartments.",
    colors: ["#111111", "#d4a64d", "#efe2c2", "#31585a", "#6e2342"],
    tags: ["elegant", "dramatic", "black", "brass", "jewel-tones", "bold", "lighting", "furniture"],
    bestRooms: ["dining-room", "living-room", "bathroom", "home-office"],
    items: ["art deco mirror", "brass wall sconce", "black lacquer tray", "velvet dining chair", "geometric rug", "smoked glass vase", "fluted table lamp", "fan-shaped wall art"],
    keywords: ["neo deco decor", "art deco mirror", "brass wall sconce", "black lacquer tray", "velvet dining chair", "geometric vintage rug", "fluted table lamp", "smoked glass vase", "art deco bathroom decor", "small apartment art deco"],
    avoid: "Overusing gold. Keep brass as an accent and ground it with black, cream, or deep green.",
  },
  {
    id: "cottage-vintage",
    name: "Cottage Vintage",
    summary: "Soft wood, garden prints, stoneware, baskets, linen, and useful old objects with a gentle rural mood.",
    colors: ["#e8dcc2", "#9b8f69", "#6e7d52", "#c47c55", "#f9f4ea"],
    tags: ["rustic", "cozy", "cream", "olive", "terracotta", "balanced", "glassware", "textiles"],
    bestRooms: ["kitchen", "bedroom", "bathroom", "dining-room"],
    items: ["stoneware pitcher", "rattan chair", "linen cafe curtain", "vintage botanical print", "wicker basket", "terracotta crock", "wooden stool", "floral tablecloth"],
    keywords: ["cottage vintage decor", "stoneware pitcher vintage", "rattan vintage chair", "linen cafe curtain", "vintage botanical print", "wicker basket decor", "terracotta kitchen crock", "wooden stool vintage", "floral tablecloth", "vintage kitchen decor"],
    avoid: "Making every surface busy. Leave open shelves partly empty so the old pieces feel intentional.",
  },
  {
    id: "art-deco-inspired",
    name: "Art Deco Inspired",
    summary: "A polished, grown-up vintage direction with mirrors, symmetry, fluting, marble, and evening-room drama.",
    colors: ["#263b37", "#b78943", "#f7efe1", "#5f223b", "#1d1b1c"],
    tags: ["elegant", "dramatic", "brass", "black", "burgundy", "bold", "lighting", "accessories"],
    bestRooms: ["dining-room", "bathroom", "home-office", "living-room"],
    items: ["arched brass mirror", "marble tray", "fluted glass lamp", "burgundy velvet pillow", "smoked glass bowl", "deco candle holder", "black picture frame", "fan motif print"],
    keywords: ["art deco inspired decor", "arched brass mirror", "marble tray vintage", "fluted glass lamp", "burgundy velvet decor", "smoked glass bowl", "deco candle holder", "black vintage frame", "fan motif wall art", "art deco dining room ideas"],
    avoid: "Using only shiny surfaces. Add velvet, matte black, or wood to keep it livable.",
  },
  {
    id: "moody-library-vintage",
    name: "Moody Library Vintage",
    summary: "Dark shelves, framed art, old books, brass reading lamps, and layered textiles for a quiet study mood.",
    colors: ["#251c1b", "#2f4a3c", "#b78943", "#6e2342", "#d6c3a4"],
    tags: ["dramatic", "cozy", "black", "olive", "burgundy", "balanced", "wall-art", "lighting"],
    bestRooms: ["home-office", "reading-nook", "living-room", "bedroom"],
    items: ["brass library lamp", "framed portrait print", "dark wood side table", "wool plaid throw", "vintage book stack", "olive curtain panel", "leather catchall", "small Persian-style rug"],
    keywords: ["moody library decor", "brass library lamp", "framed vintage portrait", "dark wood side table", "wool plaid throw", "vintage book stack", "olive curtain panel", "leather desk catchall", "small persian style rug", "vintage reading nook ideas"],
    avoid: "Blocking natural light with too much darkness. Use brass, cream paper, and reflective glass to lift the palette.",
  },
  {
    id: "soft-romantic-vintage",
    name: "Soft Romantic Vintage",
    summary: "A lighter vintage look built with lace, blush, carved frames, milk glass, curved lines, and soft glow.",
    colors: ["#f4d7cf", "#fff6ed", "#b98c76", "#c7a15b", "#7a4953"],
    tags: ["romantic", "elegant", "cream", "burgundy", "subtle", "textiles", "glassware", "accessories"],
    bestRooms: ["bedroom", "bathroom", "reading-nook", "small-apartment"],
    items: ["milk glass lamp", "carved gold frame", "lace curtain panel", "blush velvet pillow", "vintage vanity tray", "rose print", "ceramic jewelry dish", "cream quilt"],
    keywords: ["soft romantic vintage decor", "milk glass lamp", "carved gold frame", "lace curtain panel", "blush velvet pillow", "vintage vanity tray", "rose wall print", "ceramic jewelry dish", "cream vintage quilt", "romantic vintage bedroom"],
    avoid: "Letting the room become too sweet. Add one dark wood, brass, or stone accent for structure.",
  },
];

const roomTips = {
  "living-room": "Start with lighting and one wall moment. A lamp, framed print, and textured pillow can shift the room before you buy furniture.",
  bedroom: "Keep the palette calm and focus on textiles, soft light, and one vintage surface such as a nightstand or vanity tray.",
  kitchen: "Use useful vintage: stoneware, glassware, hooks, trays, and framed small art. Avoid clutter near prep space.",
  "dining-room": "A mirror, dining light, or set of candle holders can create the whole mood without replacing the table.",
  bathroom: "Use small-scale pieces: mirror, tray, print, towel color, and one glass or ceramic object.",
  "home-office": "Prioritize a lamp, art, catchall, and one old wood piece so the room feels considered during work hours.",
  "reading-nook": "Build around a lamp, chair or cushion, small table, throw, and framed art at eye level.",
  "small-apartment": "Choose compact pieces with legs, reflective glass, and wall-mounted art so the room keeps breathing.",
};

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

function buildOptions() {
  Object.entries(options).forEach(([field, entries]) => {
    const root = document.querySelector(`[data-field="${field}"]`);
    root.innerHTML = entries
      .map(([value, label], index) => {
        const type = field === "colors" ? "checkbox" : "radio";
        const checked = index === 0 && field !== "colors" ? "checked" : "";
        return `
          <label class="chip">
            <input type="${type}" name="${field}" value="${value}" ${checked} />
            <span>${label}</span>
          </label>
        `;
      })
      .join("");
  });
}

function scoreStyles(formData) {
  const selected = [
    formData.get("room"),
    formData.get("budget"),
    formData.get("vibe"),
    formData.get("intensity"),
    formData.get("focus"),
    ...formData.getAll("colors"),
  ].filter(Boolean);

  return styles
    .map((style) => {
      let score = 0;
      selected.forEach((value) => {
        if (style.tags.includes(value)) score += 3;
        if (style.bestRooms.includes(value)) score += 2;
      });
      if (formData.get("budget") === "under-100" && style.id.includes("modern")) score += 1;
      if (formData.get("budget") === "750-plus" && style.tags.includes("dramatic")) score += 1;
      return { style, score };
    })
    .sort((a, b) => b.score - a.score);
}

function marketplaceUrl(marketplace, query) {
  const encoded = encodeURIComponent(query);
  if (marketplace === "Etsy") return `https://www.etsy.com/search?q=${encoded}`;
  if (marketplace === "eBay") return `https://www.ebay.com/sch/i.html?_nkw=${encoded}`;
  return `https://www.amazon.com/s?k=${encoded}`;
}

function renderResult(formData) {
  const [{ style }] = scoreStyles(formData);
  const room = formData.get("room");
  const focus = formData.get("focus");
  const roomLabel = options.room.find(([value]) => value === room)?.[1] || "your room";
  const focusLabel = options.focus.find(([value]) => value === focus)?.[1] || "decor";
  const leadKeyword = style.keywords[0];
  const keywords = [
    ...style.keywords.slice(0, 7),
    `${roomLabel.toLowerCase()} vintage ${focusLabel.toLowerCase()}`,
    `${style.name.toLowerCase()} ${roomLabel.toLowerCase()}`,
    `vintage ${focusLabel.toLowerCase()} for ${roomLabel.toLowerCase()}`,
  ];

  document.getElementById("result-panel").innerHTML = `
    <p class="result-kicker">Your vintage style</p>
    <h3>${style.name}</h3>
    <p>${style.summary}</p>
    <div class="palette" aria-label="Suggested color palette">
      ${style.colors.map((color) => `<span class="swatch" style="background:${color}"></span>`).join("")}
    </div>
    <p><strong>Room note:</strong> ${roomTips[room]}</p>
    <p><strong>Common mistake:</strong> ${style.avoid}</p>
    <h4>Starter pieces</h4>
    <ul class="result-list">
      ${style.items.slice(0, 8).map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <h4>Shopping keywords</h4>
    <div class="result-tags">
      ${keywords.map((keyword) => `<span>${keyword}</span>`).join("")}
    </div>
    <h4>Search marketplaces</h4>
    <div class="market-links">
      ${["Etsy", "eBay", "Amazon"].map((market) => `<a class="button ghost" target="_blank" rel="noreferrer" href="${marketplaceUrl(market, leadKeyword)}">${market}</a>`).join("")}
    </div>
  `;
}

function renderStyleCards() {
  document.getElementById("style-cards").innerHTML = styles
    .map((style, index) => `
      <article class="style-card" id="${style.id}">
        <div>
          <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${style.name}</h3>
          <p>${style.summary}</p>
        </div>
        <div>
          <div class="mini-palette">
            ${style.colors.map((color) => `<span style="background:${color}"></span>`).join("")}
          </div>
        </div>
      </article>
    `)
    .join("");
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderRoomsAndKeywords() {
  document.getElementById("room-list").innerHTML = options.room
    .map(([, label]) => `<a href="#finder">Vintage ${label} Ideas</a>`)
    .join("");

  document.getElementById("keyword-cloud").innerHTML = keywordPages
    .map((keyword) => `<a href="https://www.etsy.com/search?q=${encodeURIComponent(keyword)}" target="_blank" rel="noreferrer" title="Search ${keyword} on Etsy">${keyword}</a>`)
    .join("");
}

function setupForms() {
  const form = document.getElementById("decor-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderResult(new FormData(form));
    document.getElementById("result-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  document.getElementById("email-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailForm = event.currentTarget;
    const message = document.getElementById("email-message");
    const submitButton = emailForm.querySelector("button[type='submit']");
    const endpoint = emailForm.getAttribute("action");

    if (!endpoint) {
      message.textContent = "Email collection is not connected yet.";
      return;
    }

    submitButton.disabled = true;
    message.textContent = "Sending...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(emailForm),
        headers: { Accept: "application/json" },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Form submission failed");
      }

      message.textContent = "Thanks. You are on the checklist waitlist.";
      emailForm.reset();
    } catch (error) {
      message.textContent = error.message || "Something went wrong. Please try again in a moment.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

buildOptions();
renderStyleCards();
renderRoomsAndKeywords();
setupForms();

window.vintageDecorFinder = { styles, options, keywordPages, slugify };
