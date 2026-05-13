(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.VDFSearchSelection = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function selectedSearchTerms(items) {
    return items
      .filter((item) => item.selected)
      .map((item) => item.term)
      .filter(Boolean);
  }

  function searchTermsToClipboardText(items) {
    return selectedSearchTerms(items).join("\n");
  }

  function copyFallbackMessage() {
    return "Copy failed. The selected searches are ready below.";
  }

  return { selectedSearchTerms, searchTermsToClipboardText, copyFallbackMessage };
});
