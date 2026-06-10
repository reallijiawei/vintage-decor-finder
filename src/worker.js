const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEVICE_IMAGE_ID = "latest";
const DEVICE_IMAGE_NAME = "latest.png";
const LATEST_APK_KEY = "latest.apk";
const LATEST_APK_META_KEY = "latest-apk.json";
const MAX_DEVICE_IMAGE_BYTES = 2 * 1024 * 1024;

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

function imageStorageUnavailable() {
  return json({ message: "Image storage is not configured yet." }, 503);
}

function apkStorageUnavailable() {
  return json({ message: "APK storage is not configured yet." }, 503);
}

async function handleLatestApk(request, env) {
  if (!env.APK_BUCKET) {
    return apkStorageUnavailable();
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return json({ message: "Method not allowed" }, 405);
  }

  const object = await env.APK_BUCKET.get(LATEST_APK_KEY);
  if (!object) {
    return json({ message: "latest.apk has not been uploaded yet." }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Disposition", 'attachment; filename="latest.apk"');
  headers.set("Content-Type", headers.get("Content-Type") || "application/vnd.android.package-archive");
  headers.set("ETag", object.httpEtag);

  return new Response(request.method === "HEAD" ? null : object.body, {
    headers,
  });
}

async function handleLatestApkMeta(request, env) {
  if (!env.APK_BUCKET) {
    return apkStorageUnavailable();
  }

  if (request.method !== "GET") {
    return json({ message: "Method not allowed" }, 405);
  }

  const object = await env.APK_BUCKET.get(LATEST_APK_META_KEY);
  if (!object) {
    return json({ uploadedAt: "", size: 0 });
  }

  return new Response(object.body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(value) {
  const binary = atob(String(value || ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function ensureDeviceImageTable(env) {
  await env.SUBSCRIBERS_DB.prepare(
    `CREATE TABLE IF NOT EXISTS device_image_uploads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      data TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
}

async function handleDeviceImages(request, env) {
  if (!env.SUBSCRIBERS_DB) {
    return imageStorageUnavailable();
  }

  await ensureDeviceImageTable(env);

  if (request.method === "GET") {
    const image = await env.SUBSCRIBERS_DB.prepare(
      `SELECT id, name, size, uploaded_at
       FROM device_image_uploads
       WHERE id = ?`
    )
      .bind(DEVICE_IMAGE_ID)
      .first();

    return json({
      images: image ? [{
        id: image.id,
        name: DEVICE_IMAGE_NAME,
        size: image.size,
        uploadedAt: image.uploaded_at,
        url: "/latest.png",
      }] : [],
    });
  }

  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    return json({ message: "Expected multipart form data." }, 400);
  }

  const image = formData.get("image");
  if (!(image instanceof File)) {
    return json({ message: "Please choose an image file." }, 400);
  }

  if (!image.type.startsWith("image/")) {
    return json({ message: "Only image uploads are allowed." }, 400);
  }

  if (image.size <= 0 || image.size > MAX_DEVICE_IMAGE_BYTES) {
    return json({ message: "Image must be between 1 byte and 2 MB." }, 400);
  }

  const body = arrayBufferToBase64(await image.arrayBuffer());
  const uploadedAt = new Date().toISOString().replace("T", " ").slice(0, 19);

  await env.SUBSCRIBERS_DB.prepare(
    `INSERT INTO device_image_uploads (id, name, content_type, size, data, uploaded_at)
     VALUES (?, ?, ?, ?, ?, ?)`
    + ` ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      content_type = excluded.content_type,
      size = excluded.size,
      data = excluded.data,
      uploaded_at = excluded.uploaded_at`
  )
    .bind(DEVICE_IMAGE_ID, DEVICE_IMAGE_NAME, image.type, image.size, body, uploadedAt)
    .run();

  return json({
    ok: true,
    image: {
      id: DEVICE_IMAGE_ID,
      name: DEVICE_IMAGE_NAME,
      size: image.size,
      uploadedAt,
      url: "/latest.png",
    },
  });
}

async function handleDeviceImageDownload(request, env, imageId) {
  if (!env.SUBSCRIBERS_DB) {
    return imageStorageUnavailable();
  }

  await ensureDeviceImageTable(env);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return json({ message: "Method not allowed" }, 405);
  }

  const id = decodeURIComponent(imageId || "");
  if (id !== DEVICE_IMAGE_ID) {
    return json({ message: "Invalid image id." }, 400);
  }

  const image = await env.SUBSCRIBERS_DB.prepare(
    `SELECT name, content_type, data
     FROM device_image_uploads
     WHERE id = ?`
  )
    .bind(id)
    .first();

  if (!image) {
    return json({ message: "Image not found." }, 404);
  }

  const headers = new Headers();
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Disposition", `attachment; filename="${DEVICE_IMAGE_NAME}"`);
  headers.set("Content-Type", image.content_type || "application/octet-stream");

  return new Response(request.method === "HEAD" ? null : base64ToArrayBuffer(image.data), {
    headers,
  });
}

async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function getExportTokenHash(env) {
  if (env.EXPORT_TOKEN) {
    return sha256Hex(env.EXPORT_TOKEN);
  }

  if (!env.SUBSCRIBERS_DB) {
    return "";
  }

  try {
    const row = await env.SUBSCRIBERS_DB.prepare(
      `SELECT value FROM app_settings WHERE key = ?`
    )
      .bind("export_token_sha256")
      .first();
    return row?.value || "";
  } catch (error) {
    return "";
  }
}

async function authorizeExport(request, env, unconfiguredMessage) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const expectedHash = await getExportTokenHash(env);

  if (!expectedHash) {
    return { ok: false, response: json({ message: unconfiguredMessage }, 503) };
  }

  const actualHash = await sha256Hex(token);

  if (actualHash !== expectedHash) {
    return { ok: false, response: json({ message: "Unauthorized" }, 401) };
  }

  return { ok: true };
}

async function parseSubmission(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch (error) {
      return {};
    }
  }

  try {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  } catch (error) {
    return {};
  }
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

  const authorization = await authorizeExport(request, env, "Subscriber export is not configured yet.");
  if (!authorization.ok) {
    return authorization.response;
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

  const authorization = await authorizeExport(request, env, "Outbound export is not configured yet.");
  if (!authorization.ok) {
    return authorization.response;
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

    if (url.pathname === "/apk" || url.pathname === "/apk/") {
      const apkPageUrl = new URL("/apk-page.txt", url);
      const assetResponse = await env.ASSETS.fetch(new Request(apkPageUrl, request));
      const headers = new Headers(assetResponse.headers);
      headers.set("Cache-Control", "no-store");
      headers.set("Content-Type", "text/html; charset=utf-8");
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers,
      });
    }

    if (url.pathname === "/api/subscribe") {
      return handleSubscribe(request, env);
    }

    if (url.pathname === "/api/outbound-click") {
      return handleOutboundClick(request, env);
    }

    if (url.pathname === "/latest.apk") {
      return handleLatestApk(request, env);
    }

    if (url.pathname === "/api/latest-apk") {
      return handleLatestApkMeta(request, env);
    }

    if (url.pathname === "/api/device-images") {
      return handleDeviceImages(request, env);
    }

    if (url.pathname === "/latest.png") {
      return handleDeviceImageDownload(request, env, DEVICE_IMAGE_ID);
    }

    if (url.pathname.startsWith("/api/device-images/")) {
      return handleDeviceImageDownload(request, env, url.pathname.slice("/api/device-images/".length));
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
