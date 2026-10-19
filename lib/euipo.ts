/**
 * Anbindung an die EUIPO-API (https://dev.euipo.europa.eu), Produkt "Goods and Services" 1.2.0.
 *
 * Prüft die von der KI vorgeschlagenen Begriffe gegen die harmonisierte Datenbank (HDB/TMclass)
 * und ersetzt nicht harmonisierte Begriffe durch passende Vorschläge der EUIPO.
 *
 * Aktivierung: EUIPO_CLIENT_ID und EUIPO_CLIENT_SECRET in .env.local setzen.
 * Ohne diese Werte wird die Prüfung einfach übersprungen.
 *
 * Nur serverseitig verwenden – die Zugangsdaten dürfen nie in den Browser gelangen.
 */

import type { SpecClass, TermStatus } from "./types";

const ENDPOINTS = {
  sandbox: {
    token: "https://auth-sandbox.euipo.europa.eu/oidc/accessToken",
    api: "https://api-sandbox.euipo.europa.eu/goods-and-services",
  },
  // Produktions-URLs nach Freischaltung im Portal per EUIPO_TOKEN_URL / EUIPO_API_BASE setzen
  production: {
    token: "",
    api: "",
  },
} as const;

export interface EuipoConfig {
  clientId: string;
  clientSecret: string;
  apiBase: string;
  tokenUrl: string;
}

function config(): EuipoConfig | null {
  const clientId = process.env.EUIPO_CLIENT_ID;
  const clientSecret = process.env.EUIPO_CLIENT_SECRET;
  const env = process.env.EUIPO_ENV === "production" ? "production" : "sandbox";
  const apiBase = process.env.EUIPO_API_BASE || ENDPOINTS[env].api;
  const tokenUrl = process.env.EUIPO_TOKEN_URL || ENDPOINTS[env].token;
  if (!clientId || !clientSecret || !apiBase || !tokenUrl) return null;
  return { clientId, clientSecret, apiBase: apiBase.replace(/\/$/, ""), tokenUrl };
}

export function euipoConfigured(): boolean {
  return config() !== null;
}

/* ------------------------------------------------------------------ */
/* Zugangstoken (OAuth2 Client Credentials)                             */
/* ------------------------------------------------------------------ */

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(cfg: EuipoConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const res = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      scope: "uid",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`EUIPO-Token fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error("EUIPO-Token: kein access_token in der Antwort.");

  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

/** POST an die Goods-and-Services-API mit gültigem Token. */
async function euipoPost<T>(cfg: EuipoConfig, path: string, body: unknown): Promise<T> {
  const token = await accessToken(cfg);
  const res = await fetch(`${cfg.apiBase}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-IBM-Client-Id": cfg.clientId,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`EUIPO ${path} fehlgeschlagen (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Antwortformate laut OpenAPI-Spezifikation                            */
/* ------------------------------------------------------------------ */

interface ValidationResult {
  goodsAndServices: {
    classNumber: number;
    terms: { text: string; harmonized: boolean; errors?: unknown[] }[];
  }[];
}

interface SuggestionResult {
  suggestions: {
    sourceTerm: string;
    suggestedTerms: { text: string; classNumber: number }[];
  }[];
}

/* ------------------------------------------------------------------ */
/* Verzeichnis prüfen                                                   */
/* ------------------------------------------------------------------ */

/**
 * Prüft alle Klassen gegen die harmonisierte Datenbank:
 * 1. Alle Begriffe in einem Aufruf validieren (/classification-validation)
 * 2. Für nicht harmonisierte Begriffe Vorschläge in derselben Klasse holen (/terms-suggestion-list)
 * 3. Begriff durch den besten Vorschlag ersetzen – sonst behalten und markieren
 *
 * Gibt `null` zurück, wenn die Prüfung nicht möglich war – dann bleibt das Verzeichnis unverändert.
 */
export async function checkSpecWithEuipo(classes: SpecClass[], language = "de"): Promise<SpecClass[] | null> {
  const cfg = config();
  if (!cfg || classes.length === 0) return null;

  try {
    const validation = await euipoPost<ValidationResult>(cfg, "/classification-validation", {
      sourceLanguage: language,
      goodsAndServices: classes.map((c) => ({ classNumber: c.classNumber, terms: c.terms })),
    });

    return await Promise.all(
      classes.map(async (c) => {
        const result = validation.goodsAndServices.find((g) => g.classNumber === c.classNumber);
        const checked = c.terms.map((term) => {
          const r = result?.terms.find((t) => t.text === term);
          return {
            term,
            harmonised: r?.harmonized === true,
            invalid: (r?.errors?.length ?? 0) > 0,
          };
        });

        const open = checked.filter((t) => !t.harmonised).map((t) => t.term);
        const replacements = open.length > 0 ? await suggestReplacements(cfg, c.classNumber, open, language) : {};

        const terms: string[] = [];
        const termStatus: Record<string, TermStatus> = {};
        const add = (term: string, status: TermStatus) => {
          if (terms.includes(term)) return;
          terms.push(term);
          termStatus[term] = status;
        };

        for (const t of checked) {
          if (t.harmonised) add(t.term, "harmonised");
          else if (replacements[t.term]) add(replacements[t.term], "harmonised");
          else if (!t.invalid) add(t.term, "unknown");
          // Begriffe mit formalen Fehlern (z. B. unzulässige Zeichen) und ohne Ersatz fallen weg
        }

        // Falls nichts übrig bleibt, lieber die Originalbegriffe behalten
        if (terms.length === 0) return c;
        return { ...c, terms, termStatus };
      }),
    );
  } catch (error) {
    console.warn("[euipo] Prüfung übersprungen:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Holt für nicht harmonisierte Begriffe den besten harmonisierten Vorschlag in derselben Klasse. */
async function suggestReplacements(
  cfg: EuipoConfig,
  classNumber: number,
  texts: string[],
  language: string,
): Promise<Record<string, string>> {
  try {
    const result = await euipoPost<SuggestionResult>(cfg, "/terms-suggestion-list?maxSuggestions=3", {
      language,
      texts,
      classNumber,
    });
    const map: Record<string, string> = {};
    for (const s of result.suggestions ?? []) {
      const best = s.suggestedTerms?.find((t) => t.classNumber === classNumber);
      if (best) map[s.sourceTerm] = best.text;
    }
    return map;
  } catch (error) {
    console.warn("[euipo] Vorschläge nicht verfügbar:", error instanceof Error ? error.message : error);
    return {};
  }
}
