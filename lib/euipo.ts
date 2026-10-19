/**
 * Anbindung an die EUIPO-API (https://dev.euipo.europa.eu).
 *
 * Genutzt wird das Produkt "Goods and Services", um die von der KI vorgeschlagenen
 * Begriffe gegen die harmonisierte Datenbank (TMclass) zu prüfen.
 *
 * Aktivierung: EUIPO_CLIENT_ID, EUIPO_CLIENT_SECRET und EUIPO_API_BASE in .env.local setzen.
 * Ohne diese Werte wird die Prüfung einfach übersprungen.
 *
 * Nur serverseitig verwenden – die Zugangsdaten dürfen nie in den Browser gelangen.
 */

import type { SpecClass, TermStatus } from "./types";

const TOKEN_URLS = {
  sandbox: "https://auth-sandbox.euipo.europa.eu/oidc/accessToken",
  // Produktions-URL nach Freischaltung im Portal nachtragen bzw. per EUIPO_TOKEN_URL setzen
  production: "",
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
  const apiBase = process.env.EUIPO_API_BASE;
  const env = process.env.EUIPO_ENV === "production" ? "production" : "sandbox";
  const tokenUrl = process.env.EUIPO_TOKEN_URL || TOKEN_URLS[env];
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
      scope: process.env.EUIPO_SCOPE || "uid",
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`EUIPO-Token fehlgeschlagen (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error("EUIPO-Token: keine access_token in der Antwort.");

  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

/** Ruft einen Endpunkt der EUIPO-API mit gültigem Token auf. */
export async function euipoFetch(cfg: EuipoConfig, path: string, init: RequestInit = {}): Promise<Response> {
  const token = await accessToken(cfg);
  return fetch(`${cfg.apiBase}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
      "X-IBM-Client-Id": cfg.clientId,
    },
    signal: init.signal ?? AbortSignal.timeout(15_000),
  });
}

/* ------------------------------------------------------------------ */
/* Begriffe prüfen                                                      */
/* ------------------------------------------------------------------ */

/**
 * Ergebnis der EUIPO-Prüfung für einen einzelnen Begriff.
 * `suggestion` ist ein harmonisierter Alternativbegriff, falls die EUIPO einen liefert.
 */
export interface TermCheck {
  term: string;
  status: TermStatus;
  suggestion?: string;
}

/**
 * Prüft die Begriffe einer Klasse gegen die harmonisierte Datenbank.
 *
 * OFFEN: Pfad, Anfrage- und Antwortformat des Validierungs-Endpunkts stehen nur in der
 * OpenAPI-Spezifikation im EUIPO-Portal (nach Login). Sobald sie vorliegt, wird hier
 * die eigentliche Anfrage eingesetzt. Bis dahin wirft die Funktion einen Fehler,
 * den der Aufrufer abfängt – der Assistent funktioniert dann wie bisher.
 */
async function validateClassTerms(
  cfg: EuipoConfig,
  classNumber: number,
  terms: string[],
  language: string,
): Promise<TermCheck[]> {
  void cfg;
  void classNumber;
  void terms;
  void language;
  // Beispiel für später:
  // const res = await euipoFetch(cfg, "/<pfad-aus-der-spec>", { method: "POST", body: JSON.stringify({...}) });
  throw new Error("EUIPO-Validierung: Endpunkt noch nicht hinterlegt (OpenAPI-Spezifikation einbauen).");
}

/**
 * Prüft alle Klassen und ergänzt den Status je Begriff.
 * Nicht harmonisierte Begriffe werden durch den Vorschlag der EUIPO ersetzt, falls vorhanden.
 * Gibt `null` zurück, wenn die Prüfung nicht möglich war – dann bleibt das Verzeichnis unverändert.
 */
export async function checkSpecWithEuipo(classes: SpecClass[], language = "de"): Promise<SpecClass[] | null> {
  const cfg = config();
  if (!cfg) return null;

  try {
    return await Promise.all(
      classes.map(async (c) => {
        const checks = await validateClassTerms(cfg, c.classNumber, c.terms, language);
        const terms: string[] = [];
        const termStatus: Record<string, TermStatus> = {};
        for (const check of checks) {
          const term = check.status !== "harmonised" && check.suggestion ? check.suggestion : check.term;
          if (terms.includes(term)) continue;
          terms.push(term);
          termStatus[term] = check.suggestion && check.status !== "harmonised" ? "harmonised" : check.status;
        }
        return { ...c, terms, termStatus };
      }),
    );
  } catch (error) {
    console.warn("[euipo] Prüfung übersprungen:", error instanceof Error ? error.message : error);
    return null;
  }
}
