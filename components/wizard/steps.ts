import type { WizardData } from "@/lib/types";

export const STEPS = [
  { id: "name", emoji: "✏️", label: "Marke" },
  { id: "kern", emoji: "🎯", label: "Kern" },
  { id: "paket", emoji: "🧩", label: "Schutzpaket" },
  { id: "spec", emoji: "🛡️", label: "Schutz" },
  { id: "who", emoji: "🙋", label: "Anmelder" },
  { id: "summary", emoji: "🎉", label: "Fertig" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Darf der Nutzer vom jeweiligen Schritt weiter? */
export function canContinue(step: StepId, data: WizardData, hasSelection: boolean): boolean {
  switch (step) {
    case "name":
      // Mindestens die erste Namensoption muss ausgefüllt sein, weitere sind freiwillig
      if (data.markType !== "bild" && data.markNames[0].trim().length < 2) return false;
      if (data.markType !== "wort" && !data.logoDataUrl) return false;
      return true;
    case "kern":
      // Ein kurzer Satz reicht – Hauptsache, die wichtigste Angabe ist da
      return data.coreProtection.trim().length >= 5;
    case "paket":
      // Alles freiwillig – der Kern allein reicht für ein Verzeichnis
      return true;
    case "spec":
      return hasSelection;
    case "who": {
      const nameOk =
        data.applicantKind === "person"
          ? data.firstName.trim() !== "" && data.lastName.trim() !== ""
          : data.companyName.trim() !== "";
      return (
        nameOk &&
        data.street.trim() !== "" &&
        data.zip.trim() !== "" &&
        data.city.trim() !== "" &&
        EMAIL_RE.test(data.email.trim())
      );
    }
    case "summary":
      return true;
  }
}

/** Fingerabdruck der Angaben, aus denen die Vorschläge im Schutzpaket entstehen */
export function suggestInputKey(data: WizardData, pitch: File | null): string {
  return JSON.stringify([
    data.coreProtection.trim(),
    data.coreBereiche,
    data.website.trim(),
    pitch ? `${pitch.name}:${pitch.size}` : null,
  ]);
}

/** Fingerabdruck der Angaben, die das Verzeichnis beeinflussen */
export function specInputKey(data: WizardData, pitch: File | null): string {
  return JSON.stringify([
    data.markNames,
    data.markType,
    data.coreProtection,
    data.coreBereiche,
    data.offerings,
    data.futureBereiche,
    data.description,
    data.website,
    pitch ? `${pitch.name}:${pitch.size}` : null,
  ]);
}
