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
      affiliateParams: {},
    },
    eBay: {
      label: "eBay",
      searchBase: "https://www.ebay.com/sch/i.html",
      searchParam: "_nkw",
      affiliateParams: {
        mkcid: "1",
        mkrid: "711-53200-19255-0",
        siteid: "0",
        campid: "5339152947",
        customid: "vdf",
        toolid: "10001",
        mkevt: "1",
      },
    },
    Amazon: {
      label: "Amazon",
      searchBase: "https://www.amazon.com/s",
      searchParam: "k",
      affiliateParams: {},
    },
  };

  function marketplaceUrl(marketplace, query) {
    const config = marketplaces[marketplace];
    if (!config) throw new Error(`Unknown marketplace: ${marketplace}`);

    const url = new URL(config.searchBase);
    url.searchParams.set(config.searchParam, query);

    Object.entries(config.affiliateParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    return url.toString();
  }

  function marketplaceNames() {
    return Object.keys(marketplaces);
  }

  return { marketplaceNames, marketplaceUrl, marketplaces };
});
