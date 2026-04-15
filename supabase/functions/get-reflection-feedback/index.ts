// Supabase Edge Function: get-reflection-feedback
//
// Returns short, substantive feedback on a student's reflection response.
// Used by hist101/week14/secession-civil-war.html (and can be reused by any
// similar reflection-style module: pass `system`, `prompt`, and `response`).
//
// ─── Deploy ────────────────────────────────────────────────────────────────
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase functions deploy get-reflection-feedback --no-verify-jwt
//
// The `--no-verify-jwt` flag is appropriate because the reflection module is
// used by anonymous students; authentication is not required for this call.
// The function itself does not write any data.
//
// Request body (JSON):
//   { system: string, prompt: string, response: string, section_title?: string }
//
// Response body (JSON):
//   { feedback: string }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-4-5";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!ANTHROPIC_API_KEY) {
    return json({ error: "ANTHROPIC_API_KEY is not configured" }, 500);
  }

  let payload: {
    system?: string;
    prompt?: string;
    response?: string;
    section_title?: string;
  };

  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const system = (payload.system ?? "").trim();
  const studentPrompt = (payload.prompt ?? "").trim();
  const studentResponse = (payload.response ?? "").trim();

  if (!system || !studentResponse) {
    return json({ error: "Missing `system` or `response`" }, 400);
  }

  const userMessage = studentPrompt
    ? `Reflection prompt:\n${studentPrompt}\n\nStudent response:\n${studentResponse}`
    : studentResponse;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("Anthropic API error", r.status, errText);
      return json(
        { error: `Anthropic API returned ${r.status}` },
        502,
      );
    }

    const data = await r.json();
    const feedback =
      data?.content?.[0]?.text ??
      "Thanks for your response. Move on when ready.";

    return json({ feedback });
  } catch (e) {
    console.error("Edge function error", e);
    return json({ error: "Upstream request failed" }, 502);
  }
});
