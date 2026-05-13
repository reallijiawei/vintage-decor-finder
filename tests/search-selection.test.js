const assert = require("node:assert/strict");
const {
  selectedSearchTerms,
  searchTermsToClipboardText,
  copyFallbackMessage,
} = require("../search-selection");

const terms = [
  { term: "vintage brass floor lamp", selected: true },
  { term: "living room vintage lighting", selected: false },
  { term: "70s jewel tone decor", selected: true },
];

assert.deepEqual(selectedSearchTerms(terms), [
  "vintage brass floor lamp",
  "70s jewel tone decor",
]);

assert.equal(
  searchTermsToClipboardText(terms),
  "vintage brass floor lamp\n70s jewel tone decor",
);

assert.equal(
  copyFallbackMessage(),
  "Copy failed. The selected searches are ready below.",
);

console.log("search selection helpers ok");
