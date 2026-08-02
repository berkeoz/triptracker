// Vercel serverless function backing the shared checklist/open-items edits.
// Reads/writes a single JSON blob in Vercel KV (Upstash Redis under the hood)
// so edits made on one device show up on another. Requires a KV store
// attached to this Vercel project (env vars KV_REST_API_URL / KV_REST_API_TOKEN).

const KEY = "triptracker-state";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const base = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!base || !token) {
    return res.status(500).json({ error: "No KV store attached to this project yet." });
  }

  if (req.method === "GET") {
    const r = await fetch(`${base}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return res.status(502).json({ error: "KV read failed" });
    const data = await r.json();
    return res.status(200).json(data.result ? JSON.parse(data.result) : null);
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }
    const r = await fetch(`${base}/set/${KEY}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!r.ok) return res.status(502).json({ error: "KV write failed" });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
