const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function csv(rows, columns, filename) {
  const body = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");

  return new Response(`${body}\n`, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}

async function parseSubmission(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

async function handleSubscribe(request, env) {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (!env.SUBSCRIBERS_DB) {
    return json({ message: "Email collection is not configured yet." }, 503);
  }

  const submission = await parseSubmission(request);
  const email = String(submission.email || "").trim().toLowerCase();
  const source = String(submission.source || "homepage-checklist").trim().slice(0, 80);

  if (!EMAIL_PATTERN.test(email)) {
    return json({ message: "Please enter a valid email address." }, 400);
  }

  try {
    await env.SUBSCRIBERS_DB.prepare(
      `INSERT INTO email_subscribers (email, source, user_agent)
       VALUES (?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         source = excluded.source,
         user_agent = excluded.user_agent,
         updated_at = CURRENT_TIMESTAMP`
    )
      .bind(email, source, request.headers.get("user-agent") || "")
      .run();
  } catch (error) {
    return json({ message: "Email database is not ready yet." }, 503);
  }

  return json({ ok: true });
}

async function handleSubscribersExport(request, env) {
  if (request.method !== "GET") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (!env.EXPORT_TOKEN) {
    return json({ message: "Subscriber export is not configured yet." }, 503);
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";

  if (token !== env.EXPORT_TOKEN) {
    return json({ message: "Unauthorized" }, 401);
  }

  if (!env.SUBSCRIBERS_DB) {
    return json({ message: "Email collection is not configured yet." }, 503);
  }

  try {
    const { results } = await env.SUBSCRIBERS_DB.prepare(
      `SELECT email, source, created_at, updated_at
       FROM email_subscribers
       ORDER BY created_at DESC`
    ).all();

    return csv(results || [], ["email", "source", "created_at", "updated_at"], "vintage-decor-subscribers.csv");
  } catch (error) {
    return json({ message: "Email database is not ready yet." }, 503);
  }
}

async function handleOutboundClick(request, env) {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (!env.SUBSCRIBERS_DB) {
    return json({ message: "Click tracking is not configured yet." }, 503);
  }

  const submission = await parseSubmission(request);
  const marketplace = String(submission.marketplace || "").trim().slice(0, 40);
  const query = String(submission.query || "").trim().slice(0, 160);
  const pagePath = String(submission.page_path || "").trim().slice(0, 240);
  const targetUrl = String(submission.target_url || "").trim().slice(0, 600);

  if (!["Amazon", "eBay", "Etsy"].includes(marketplace) || !query || !pagePath || !targetUrl) {
    return json({ message: "Invalid click event." }, 400);
  }

  try {
    const parsedTarget = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsedTarget.protocol)) {
      return json({ message: "Invalid target URL." }, 400);
    }

    await env.SUBSCRIBERS_DB.prepare(
      `INSERT INTO outbound_clicks (marketplace, query, page_path, target_url)
       VALUES (?, ?, ?, ?)`
    )
      .bind(marketplace, query, pagePath, targetUrl)
      .run();
  } catch (error) {
    return json({ message: "Click database is not ready yet." }, 503);
  }

  return json({ ok: true });
}

async function handleOutboundExport(request, env) {
  if (request.method !== "GET") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (!env.EXPORT_TOKEN) {
    return json({ message: "Outbound export is not configured yet." }, 503);
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";

  if (token !== env.EXPORT_TOKEN) {
    return json({ message: "Unauthorized" }, 401);
  }

  if (!env.SUBSCRIBERS_DB) {
    return json({ message: "Click tracking is not configured yet." }, 503);
  }

  try {
    const { results } = await env.SUBSCRIBERS_DB.prepare(
      `SELECT marketplace, query, page_path, target_url, created_at
       FROM outbound_clicks
       ORDER BY created_at DESC`
    ).all();

    return csv(results || [], ["marketplace", "query", "page_path", "target_url", "created_at"], "vintage-decor-outbound-clicks.csv");
  } catch (error) {
    return json({ message: "Click database is not ready yet." }, 503);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/subscribe") {
      return handleSubscribe(request, env);
    }

    if (url.pathname === "/api/outbound-click") {
      return handleOutboundClick(request, env);
    }

    if (url.pathname === "/admin/subscribers.csv") {
      return handleSubscribersExport(request, env);
    }

    if (url.pathname === "/admin/outbound-clicks.csv") {
      return handleOutboundExport(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
