import { NextResponse } from "next/server";
import { FDL_CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot/systemPrompt";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type GeminiRequestContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function sleep(delayMs: number) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const candidate = entry as Record<string, unknown>;
      const role = candidate.role === "user" || candidate.role === "model" ? candidate.role : null;
      const text = typeof candidate.text === "string" ? candidate.text.trim() : "";

      if (!role || !text) {
        return null;
      }

      return {
        role,
        text: text.slice(0, 4000),
      } satisfies ChatMessage;
    })
    .filter(Boolean) as ChatMessage[];
}

async function generateGeminiReply(messages: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
  const contents: GeminiRequestContent[] = messages.map((message) => ({
    role: message.role,
    parts: [{ text: message.text }],
  }));

  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: FDL_CHATBOT_SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        const detail = await response.text();
        lastError = new Error(`Gemini request failed with status ${response.status}: ${detail}`);
      } else {
        const data = (await response.json()) as {
          candidates?: Array<{
            content?: {
              parts?: Array<{
                text?: string;
              }>;
            };
          }>;
        };

        const text = data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("")
          .trim();

        if (text) {
          return text;
        }

        lastError = new Error("Gemini returned an empty response");
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < 4) {
      await sleep(1000 * 2 ** attempt);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Gemini request failed");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { messages?: unknown };
    const messages = normalizeMessages(payload.messages);

    if (!messages.length) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const reply = await generateGeminiReply(messages);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[chatbot] Gemini request failed", error);
    return NextResponse.json({ error: "Chatbot unavailable" }, { status: 503 });
  }
}
