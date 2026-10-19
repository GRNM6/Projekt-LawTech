export type MarkType = "wort" | "wortbild" | "bild";
export type ApplicantKind = "person" | "firma";

/** Alles, was der Nutzer im Assistenten eingibt. */
export interface WizardData {
  // Schritt 1: Marke
  markName: string;
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
}

export interface SpecResult {
  summary: string;
  classes: SpecClass[];
  hints: string[];
  sourcesUsed: string[];
  /** true, wenn kein API-Key gesetzt ist und Beispieldaten erzeugt wurden */
  demo: boolean;
}

export const emptyWizardData: WizardData = {
  markName: "",
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
