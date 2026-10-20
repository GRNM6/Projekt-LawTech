export type MarkType = "wort" | "wortbild" | "bild";
export type ApplicantKind = "person" | "firma";

/** Alles, was der Nutzer im Assistenten eingibt. */
export interface WizardData {
  // Schritt 1: Marke
  /** Bis zu drei Namensoptionen; später wird geprüft, welche die besten Eintragungschancen hat */
  markNames: [string, string, string];
  markType: MarkType;
  logoDataUrl: string | null;

  // Schritt 2: Was machst du?
  offerings: string[];
  description: string;

  // Schritt 3: Zeig uns mehr
  website: string;

  // Schritt 4: Zukunft
  futurePlans: string[];
  futureNote: string;

  // Schritt 5: Anmelder
  applicantKind: ApplicantKind;
  firstName: string;
  lastName: string;
  companyName: string;
  legalForm: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  email: string;
}

/** Alle ausgefüllten Namensoptionen, ohne Leerzeichen am Rand und ohne Duplikate */
export function filledMarkNames(data: Pick<WizardData, "markNames">): string[] {
  // Robust gegen unvollständige Daten, z. B. wenn die API alte oder kaputte Angaben bekommt
  const raw: unknown[] = Array.isArray(data.markNames) ? data.markNames : [];
  const names = raw.filter((n): n is string => typeof n === "string").map((n) => n.trim()).filter(Boolean);
  return names.filter((n, i) => names.findIndex((x) => x.toLowerCase() === n.toLowerCase()) === i);
}

/** Erste ausgefüllte Namensoption (Favorit), sonst leerer String */
export function primaryMarkName(data: Pick<WizardData, "markNames">): string {
  return filledMarkNames(data)[0] ?? "";
}

/** Eine Klasse im KI-erstellten Waren- und Dienstleistungsverzeichnis. */
export interface SpecClass {
  classNumber: number;
  /** Kurzer, verständlicher Titel, z. B. "Apps & Software" */
  title: string;
  /** Warum diese Klasse für den Nutzer wichtig ist – ohne Juristendeutsch */
  why: string;
  /** Offizielle Begriffe für die Anmeldung (möglichst aus der EUIPO-Harmonised-Database) */
  terms: string[];
  /** true = Kerngeschäft (vorausgewählt), false = sinnvolle Erweiterung */
  core: boolean;
  /** Ergebnis der EUIPO-Prüfung je Begriff (nur vorhanden, wenn geprüft wurde) */
  termStatus?: Record<string, TermStatus>;
}

/** harmonised = in der EUIPO-Datenbank, unknown = nicht gefunden, wird individuell geprüft */
export type TermStatus = "harmonised" | "unknown";

export interface SpecResult {
  summary: string;
  classes: SpecClass[];
  hints: string[];
  sourcesUsed: string[];
  /** true, wenn die Begriffe gegen die EUIPO-Datenbank geprüft wurden */
  euipoChecked?: boolean;
  /** true, wenn kein API-Key gesetzt ist und Beispieldaten erzeugt wurden */
  demo: boolean;
}

export const emptyWizardData: WizardData = {
  markNames: ["", "", ""],
  markType: "wort",
  logoDataUrl: null,
  offerings: [],
  description: "",
  website: "",
  futurePlans: [],
  futureNote: "",
  applicantKind: "person",
  firstName: "",
  lastName: "",
  companyName: "",
  legalForm: "",
  street: "",
  zip: "",
  city: "",
  country: "DE",
  email: "",
};
