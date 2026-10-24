/**
 * Gemeinsame Bausteine für die KI-Routen (nur auf dem Server verwenden):
 * Angaben aus dem Formular lesen, Website auslesen, Pitch-PDF anhängen, Claude aufrufen.
 */
import type { WizardData } from "./types";

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5";
export const MAX_PDF_BYTES = 10 * 1024 * 1024;
const MAX_WEBSITE_CHARS = 12_000;

/** Liest Angaben und optionales Pitch-PDF aus dem Formular – oder liefert eine Fehlerantwort */
export async function readWizardForm(
  request: Request,
): Promise<{ data: WizardData; pitchFile: File | null } | { error: Response }> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { error: Response.json({ error: "Ungültige Anfrage." }, { status: 400 }) };
  }

  const raw = form.get("data");
  if (typeof raw !== "string") {
    return { error: Response.json({ error: "Es fehlen Angaben." }, { status: 400 }) };
  }

  let data: WizardData;
  try {
    data = JSON.parse(raw) as WizardData;
  } catch {
    return { error: Response.json({ error: "Ungültige Angaben." }, { status: 400 }) };
  }

  const pitch = form.get("pitch");
  const pitchFile = pitch instanceof File && pitch.size > 0 ? pitch : null;
  if (pitchFile && (pitchFile.type !== "application/pdf" || pitchFile.size > MAX_PDF_BYTES)) {
    return {
      error: Response.json({ error: "Das Dokument muss ein PDF mit maximal 10 MB sein." }, { status: 400 }),
    };
  }

  return { data, pitchFile };
}

/** Pitch-PDF als Dokument-Baustein für die Claude-API */
export async function pdfContentBlock(file: File): Promise<unknown> {
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  return {
    type: "document",
    source: { type: "base64", media_type: "application/pdf", data: base64 },
    title: "Pitch-Dokument",
  };
}

interface ClaudeResponse {
  content?: { type: string; name?: string; input?: unknown }[];
}

/** Ruft Claude mit genau einem Werkzeug auf und gibt dessen strukturierte Eingabe zurück */
export async function callClaudeTool(options: {
  apiKey: string;
  system: string;
  tool: { name: string; description: string; input_schema: unknown };
  content: unknown[];
  maxTokens: number;
  timeoutMs: number;
}): Promise<unknown> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": options.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: options.maxTokens,
      system: options.system,
      tools: [options.tool],
      tool_choice: { type: "tool", name: options.tool.name },
      messages: [{ role: "user", content: options.content }],
    }),
    signal: AbortSignal.timeout(options.timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as ClaudeResponse;
  const block = json.content?.find((b) => b.type === "tool_use" && b.name === options.tool.name);
  if (!block?.input) {
    throw new Error("Keine strukturierte Antwort erhalten.");
  }
  return block.input;
}

/* ------------------------------------------------------------------ */
/* Website auslesen                                                     */
/* ------------------------------------------------------------------ */

export async function fetchWebsiteText(input: string): Promise<string | null> {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input.trim()) ? input.trim() : `https://${input.trim()}`);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(url.protocol) || isPrivateHost(url.hostname)) {
    return null;
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MarkenAssistent/0.1)" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("text/html")) {
      return null;
    }
    const html = (await res.text()).slice(0, 500_000);
    const text = htmlToText(html);
    return text.length > 40 ? text.slice(0, MAX_WEBSITE_CHARS) : null;
  } catch {
    return null;
  }
}

function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h === "localhost" ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    /^127\./.test(h) ||
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    /^169\.254\./.test(h) ||
    h === "0.0.0.0" ||
    h.startsWith("[")
  );
}

function htmlToText(html: string): string {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const description =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ?? "";

  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  return decodeEntities([title, description, body].join("\n"))
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&auml;/g, "ä")
    .replace(/&ouml;/g, "ö")
    .replace(/&uuml;/g, "ü")
    .replace(/&Auml;/g, "Ä")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&szlig;/g, "ß")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)));
}

