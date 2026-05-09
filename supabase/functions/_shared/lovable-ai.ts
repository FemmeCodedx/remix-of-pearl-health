// Thin wrapper around the Lovable AI Gateway (OpenAI-compatible).
// Server-side only — uses LOVABLE_API_KEY which must never reach the client.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type AiError = { status: number; message: string };

export async function callAiJson<T = unknown>(opts: {
  system?: string;
  prompt: string;
  model?: string;
  schemaHint?: string; // appended to system message
}): Promise<T> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw { status: 500, message: "LOVABLE_API_KEY not configured" } satisfies AiError;

  const messages: Array<{ role: string; content: string }> = [];
  const sys = [opts.system, opts.schemaHint].filter(Boolean).join("\n\n");
  if (sys) messages.push({ role: "system", content: sys });
  messages.push({ role: "user", content: opts.prompt });

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-3-flash-preview",
      messages,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw {
      status: res.status,
      message: res.status === 429
        ? "AI rate limit reached. Try again in a moment."
        : res.status === 402
        ? "Workspace AI credits exhausted. Add credits in Lovable settings."
        : `AI gateway error: ${text.slice(0, 200)}`,
    } satisfies AiError;
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw { status: 502, message: "AI returned empty response" } satisfies AiError;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw { status: 502, message: "AI returned invalid JSON" } satisfies AiError;
  }
}

export async function callAiText(opts: {
  system?: string;
  prompt: string;
  model?: string;
}): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw { status: 500, message: "LOVABLE_API_KEY not configured" } satisfies AiError;

  const messages: Array<{ role: string; content: string }> = [];
  if (opts.system) messages.push({ role: "system", content: opts.system });
  messages.push({ role: "user", content: opts.prompt });

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model ?? "google/gemini-3-flash-preview",
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw {
      status: res.status,
      message: res.status === 429
        ? "AI rate limit reached."
        : res.status === 402
        ? "Workspace AI credits exhausted."
        : `AI gateway error: ${text.slice(0, 200)}`,
    } satisfies AiError;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}
