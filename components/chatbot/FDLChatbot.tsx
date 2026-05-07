"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, ExternalLink, Mail, MessageCircle, SendHorizontal, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE_EMAIL, SITE_PHONE_DISPLAY } from "@/lib/siteContent";
import { FDL_CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot/systemPrompt";
import FormatChatText from "@/components/chatbot/FormatChatText";

const GEMINI_API_KEY = "AIzaSyDsISzXfrcBW4epDfp2GPiMh-OAKxkaTyU";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const HANDOFF_REGEX = /\|\|\|HANDOFF_START\|\|\|([\s\S]*?)\|\|\|HANDOFF_END\|\|\|/;
const WHATSAPP_NUMBER = "447869022673";
const WELCOME_MESSAGE =
  "Welcome to FDL Bespoke. Tell me about your vehicle and what you're after - I'll help get you a quote.";
const FAILURE_MESSAGE =
  "Having trouble connecting right now. Message us directly on **07869 022673** or email fdlbespokeuk@gmail.com.";
const HANDOFF_VISIBLE_FALLBACK =
  "I've put your enquiry together. Send it through using the button below and we'll be in touch shortly.";

const KEYFRAMES = `
  @keyframes fdl-slide-in-r {
    from { opacity: 0; transform: translateX(12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fdl-slide-in-l {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fdl-panel-in {
    from { opacity: 0; transform: translateY(18px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fdl-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fdl-pulse-ring {
    0%   { opacity: 0.6; transform: scale(1); }
    100% { opacity: 0;   transform: scale(2); }
  }
  @keyframes fdl-dot-wave {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30%           { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes fdl-btn-glow {
    0%, 100% { box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 0 0 rgba(211,191,137,0); }
    50%      { box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 24px 4px rgba(211,191,137,0.2); }
  }
`;

type HandoffData = {
  name: string;
  contact: string;
  vehicle: string;
  service: string;
  budget?: string;
  timeline?: string;
  location?: string;
  notes?: string;
};

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
  handoff?: HandoffData;
};

type GeminiRequestContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function sleep(delayMs: number) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, delayMs));
}

function normaliseHandoffData(raw: unknown): HandoffData | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const candidate = raw as Record<string, unknown>;
  const toOptionalString = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;

  const handoff: HandoffData = {
    name: toOptionalString(candidate.name) ?? "",
    contact: toOptionalString(candidate.contact) ?? "",
    vehicle: toOptionalString(candidate.vehicle) ?? "",
    service: toOptionalString(candidate.service) ?? "",
    budget: toOptionalString(candidate.budget),
    timeline: toOptionalString(candidate.timeline),
    location: toOptionalString(candidate.location),
    notes: toOptionalString(candidate.notes),
  };

  if (!handoff.name || !handoff.contact || !handoff.vehicle || !handoff.service) {
    return undefined;
  }

  return handoff;
}

function extractHandoff(text: string) {
  const match = text.match(HANDOFF_REGEX);
  const cleanText = text.replace(HANDOFF_REGEX, "").trim();

  if (!match) {
    return { cleanText, handoff: undefined as HandoffData | undefined };
  }

  try {
    const parsed = JSON.parse(match[1]);
    const handoff = normaliseHandoffData(parsed);
    return { cleanText: cleanText || HANDOFF_VISIBLE_FALLBACK, handoff };
  } catch {
    return {
      cleanText: cleanText || HANDOFF_VISIBLE_FALLBACK,
      handoff: undefined as HandoffData | undefined,
    };
  }
}

function buildHandoffBody(handoff: HandoffData) {
  const fallback = "-";

  return [
    "FDL Enquiry",
    `Name: ${handoff.name}`,
    `Contact: ${handoff.contact}`,
    `Vehicle: ${handoff.vehicle}`,
    `Service: ${handoff.service}`,
    `Budget: ${handoff.budget || fallback}`,
    `Timeline: ${handoff.timeline || fallback}`,
    `Location: ${handoff.location || fallback}`,
    `Notes: ${handoff.notes || fallback}`,
  ].join("\n");
}

function buildHandoffLinks(handoff: HandoffData) {
  const body = buildHandoffBody(handoff);
  const subject = `FDL Enquiry - ${handoff.name} - ${handoff.vehicle}`;

  return {
    whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`,
    email: `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

async function generateGeminiReply(messages: Message[]) {
  const contents: GeminiRequestContent[] = messages.map((message) => ({
    role: message.role,
    parts: [{ text: message.text }],
  }));

  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: FDL_CHATBOT_SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });

      if (!response.ok) {
        lastError = new Error(`Gemini request failed with status ${response.status}`);
      } else {
        const data = (await response.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
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

function TypingIndicator() {
  return (
    <div className="flex items-center gap-[5px] px-1 py-0.5">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-[7px] w-[7px] rounded-full bg-[var(--accent)]"
          style={{
            animation: "fdl-dot-wave 1.1s ease-in-out infinite",
            animationDelay: `${index * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function FDLChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "model", text: WELCOME_MESSAGE },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const animatedIdsRef = useRef<Set<string>>(new Set(["welcome"]));

  const isAdminRoute = pathname?.startsWith("/admin");
  const showChatbot = !isAdminRoute;
  const panelId = "fdl-assistant-panel";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
  }, [input]);

  useEffect(() => {
    if (!showChatbot) setIsOpen(false);
  }, [showChatbot]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const openHandoffLink = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const submitMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmedInput,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsTyping(true);

    try {
      const rawReply = await generateGeminiReply(nextMessages);
      const { cleanText, handoff } = extractHandoff(rawReply);
      setMessages((current) => [
        ...current,
        { id: `model-${Date.now()}`, role: "model", text: cleanText, handoff },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: `error-${Date.now()}`, role: "model", text: FAILURE_MESSAGE },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!showChatbot) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open FDL Assistant"
          aria-controls={panelId}
          aria-expanded={false}
          className="fixed bottom-6 right-6 z-[950] flex items-center gap-2.5 md:bottom-8 md:right-8"
          style={{ animation: "fdl-btn-glow 3.5s ease-in-out infinite" }}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: "rgba(211,191,137,0.18)",
              animation: "fdl-pulse-ring 2.2s ease-out infinite",
            }}
          />

          <span className="relative flex items-center gap-2.5 rounded-full border border-white/10 bg-[#111111] px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.55)] transition-all duration-300 hover:scale-105 hover:border-[rgba(211,191,137,0.4)] group">
            <MessageCircle
              size={18}
              className="text-[var(--accent)] transition-transform duration-300 group-hover:rotate-[-8deg]"
            />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/90">
              FDL AI
            </span>

            <span className="relative flex h-[7px] w-[7px]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-emerald-500" />
            </span>
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[950]"
          style={{ animation: "fdl-backdrop-in 0.25s ease-out both" }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-[6px] md:bg-black/50"
            aria-label="Close FDL Assistant"
            onClick={() => setIsOpen(false)}
          />

          <section
            id={panelId}
            aria-label="FDL Assistant"
            className="absolute inset-0 flex flex-col overflow-hidden bg-[#0D0D0D] md:inset-auto md:bottom-8 md:right-8 md:h-[620px] md:w-[390px] md:rounded-[24px] md:border md:border-white/[0.07] md:shadow-[0_40px_140px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]"
            style={{ animation: "fdl-panel-in 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <div
              className="h-[2px] w-full shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(211,191,137,0.8) 40%, rgba(211,191,137,0.9) 60%, transparent 100%)",
              }}
            />

            <header className="shrink-0 px-5 pb-4 pt-4 md:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="relative flex h-[7px] w-[7px]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-emerald-400/80">
                      Online
                    </span>
                  </div>

                  <p className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white">
                    FDL Assistant
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/30">
                    Bespoke builds and enquiries
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close FDL Assistant"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/60 transition-all duration-200 hover:border-[rgba(211,191,137,0.4)] hover:bg-[rgba(211,191,137,0.08)] hover:text-[var(--accent)]"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            <div
              className="h-px w-full shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)",
              }}
            />

            <div className="flex-1 overflow-y-auto px-4 py-5 md:px-5">
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const links = message.handoff ? buildHandoffLinks(message.handoff) : null;
                  const isNew = !animatedIdsRef.current.has(message.id);

                  if (isNew) {
                    animatedIdsRef.current.add(message.id);
                  }

                  const animStyle = isNew
                    ? {
                        animation: `${message.role === "user" ? "fdl-slide-in-r" : "fdl-slide-in-l"} 0.3s cubic-bezier(0.22,1,0.36,1) both`,
                        animationDelay: `${index === 0 ? "0.1s" : "0s"}`,
                      }
                    : {};

                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      style={animStyle}
                    >
                      <div className="max-w-[88%] space-y-3">
                        <div
                          className={
                            message.role === "user"
                              ? "rounded-[20px] rounded-tr-[6px] border border-[rgba(211,191,137,0.28)] px-4 py-3 text-white"
                              : "rounded-[20px] rounded-tl-[6px] border border-white/[0.07] border-l-2 border-l-[rgba(211,191,137,0.45)] px-4 py-3 text-white"
                          }
                          style={
                            message.role === "user"
                              ? {
                                  background:
                                    "linear-gradient(135deg, rgba(211,191,137,0.18) 0%, rgba(211,191,137,0.09) 100%)",
                                }
                              : { background: "#161616" }
                          }
                        >
                          <FormatChatText text={message.text} />
                        </div>

                        {message.handoff && links ? (
                          <div
                            className="rounded-[20px] p-[1px]"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(211,191,137,0.35) 0%, rgba(211,191,137,0.08) 100%)",
                            }}
                          >
                            <div className="rounded-[19px] bg-[#0F0F0F] p-4">
                              <div className="mb-1 flex items-center gap-2">
                                <CheckCircle size={13} className="shrink-0 text-[var(--accent)]" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--accent)]">
                                  Enquiry Ready
                                </p>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-white/85">
                                Send this straight through and we will pick it up with you directly.
                              </p>

                              <div className="mt-4 space-y-2">
                                <button
                                  type="button"
                                  onClick={() => openHandoffLink(links.whatsapp)}
                                  className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition-all duration-200 hover:brightness-110 active:scale-95"
                                  style={{ background: "var(--accent)" }}
                                >
                                  <MessageCircle size={15} />
                                  <span>Send via WhatsApp</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openHandoffLink(links.email)}
                                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white/70 transition-all duration-200 hover:border-white/[0.15] hover:text-white active:scale-95"
                                >
                                  <Mail size={15} />
                                  <span>Email instead</span>
                                  <ExternalLink size={13} className="ml-0.5 opacity-50" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div
                    className="flex justify-start"
                    style={{ animation: "fdl-slide-in-l 0.25s ease-out both" }}
                  >
                    <div
                      className="rounded-[20px] rounded-tl-[6px] border border-white/[0.07] border-l-2 border-l-[rgba(211,191,137,0.45)] px-4 py-3"
                      style={{ background: "#161616" }}
                    >
                      <TypingIndicator />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            <div className="shrink-0 border-t border-white/[0.06] px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-5 md:pb-5">
              <div
                className="rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-3 transition-all duration-200 focus-within:border-[rgba(211,191,137,0.3)] focus-within:bg-white/[0.05]"
                style={{
                  boxShadow: "none",
                  transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                }}
                onFocusCapture={(event) => {
                  (event.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 0 1px rgba(211,191,137,0.12), 0 4px 20px rgba(0,0,0,0.3)";
                }}
                onBlurCapture={(event) => {
                  (event.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="flex items-end gap-3">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void submitMessage();
                      }
                    }}
                    placeholder="Tell us about your vehicle..."
                    className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-6 text-white placeholder:text-white/25 focus:outline-none"
                    aria-label="Message FDL Assistant"
                  />

                  <button
                    type="button"
                    onClick={() => void submitMessage()}
                    disabled={isTyping || input.trim().length === 0}
                    aria-label="Send message"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black transition-all duration-150 hover:scale-105 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/25 disabled:scale-100 disabled:brightness-100"
                    style={
                      isTyping || input.trim().length === 0
                        ? {}
                        : { background: "var(--accent)" }
                    }
                  >
                    <SendHorizontal size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-white/20">
                FDL Bespoke - {SITE_PHONE_DISPLAY}
              </p>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
