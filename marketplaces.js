(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.VDFMarketplaces = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const marketplaces = {
    Etsy: {
      label: "Etsy",
      searchBase: "https://www.etsy.com/search",
      searchParam: "q",
    },
    eBay: {
      label: "eBay",
      searchBase: "https://www.ebay.com/sch/i.html",
      searchParam: "_nkw",
    },
    Amazon: {
      label: "Amazon",
      searchBase: "https://www.amazon.com/s",
      searchParam: "k",
    },
  };

  function marketplaceUrl(marketplace, query) {
    const config = marketplaces[marketplace];
    if (!config) throw new Error(`Unknown marketplace: ${marketplace}`);

    const url = new URL(config.searchBase);
    url.searchParams.set(config.searchParam, query);

    return url.toString();
  }

  function marketplaceNames() {
    return Object.keys(marketplaces);
  }

  return { marketplaceNames, marketplaceUrl, marketplaces };
});
