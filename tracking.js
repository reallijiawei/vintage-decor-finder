function trackOutboundClick(link) {
  const payload = {
    marketplace: link.dataset.marketplace || "",
    query: link.dataset.query || "",
    page_path: window.location.pathname,
    target_url: link.href,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/outbound-click", blob);
    return;
  }

  fetch("/api/outbound-click", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-track-outbound]");
  if (!link) return;
  trackOutboundClick(link);
});
