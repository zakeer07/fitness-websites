import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Max base64 length ~3.75MB binary → safe under Supabase's 6MB body limit
const MAX_BASE64_BYTES = 4_000_000;

// Gemini request timeout
const GEMINI_TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = `You are a professional dietitian and nutritionist analyzing a food photograph.

Your job is to identify every food item visible and provide accurate nutritional data.

Rules:
- Be SPECIFIC: "grilled chicken breast" not "chicken". "white basmati rice" not "rice".
- Account for cooking method — fried food has significantly more calories than steamed/grilled.
- Identify visible oils, sauces, dressings, toppings, and garnishes separately if they are significant.
- For mixed dishes (curry, pasta, stew), list the dish as one item and estimate its components.
- Provide THREE portion sizes: small, medium, large with realistic gram weights.
- Never fabricate foods that are not visible. If something is unclear, say so in notes.
- If the image is not food, return an empty foods array with a note.

Return ONLY valid JSON — no markdown fences, no explanation, just raw JSON:
{
  "foods": [
    {
      "name": "string — specific food name including preparation method",
      "portions": {
        "small":  { "weight": "Xg", "cal": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "medium": { "weight": "Xg", "cal": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "large":  { "weight": "Xg", "cal": 0, "protein": 0, "carbs": 0, "fat": 0 }
      }
    }
  ],
  "confidence": "high | medium | low",
  "notes": "any caveats about accuracy, unclear items, or assumptions made"
}`;

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Validate Supabase session
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const geminiKey = Deno.env.get("GEMINI_API_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return json({ error: "Server misconfiguration" }, 500);
  }
  if (!geminiKey) {
    return json({ error: "GEMINI_API_KEY secret not set on this project" }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  // Parse request body
  let body: { image?: string; mimeType?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { image, mimeType } = body;
  if (!image || !mimeType) {
    return json({ error: "Missing image or mimeType" }, 400);
  }
  if (!["image/jpeg", "image/png", "image/webp", "image/heic"].includes(mimeType)) {
    return json({ error: "Unsupported image type" }, 400);
  }
  if (image.length > MAX_BASE64_BYTES) {
    return json({ error: "Image too large. Please compress or resize before uploading." }, 413);
  }

  // Call Gemini Vision with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  let geminiRes: Response;
  try {
    geminiRes = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { inline_data: { mime_type: mimeType, data: image } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          // response_mime_type omitted — relying on prompt to enforce JSON output
          // (Gemini 1.5 Flash JSON mode requires jsonSchema which we skip for simplicity)
        },
      }),
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return json({ error: "AI analysis timed out. Try again." }, 504);
    }
    return json({ error: "Failed to reach AI service." }, 502);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    console.error("Gemini error:", err);
    return json({ error: "AI analysis failed. Check GEMINI_API_KEY." }, 502);
  }

  const geminiData = await geminiRes.json();
  let rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!rawText) {
    return json({ error: "Empty response from AI" }, 502);
  }

  // Strip markdown fences if Gemini wraps the JSON anyway
  rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  let analysis: unknown;
  try {
    analysis = JSON.parse(rawText);
  } catch {
    return json({ error: "AI returned malformed JSON", raw: rawText }, 502);
  }

  return json({ ok: true, analysis }, 200);
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
