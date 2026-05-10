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

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/subscribe") {
      return handleSubscribe(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
