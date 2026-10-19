import type { WizardData } from "@/lib/types";

export const STEPS = [
  { id: "name", emoji: "✏️", label: "Marke" },
  { id: "what", emoji: "💬", label: "Projekt" },
  { id: "more", emoji: "🔍", label: "Mehr Infos" },
  { id: "future", emoji: "🔮", label: "Zukunft" },
  { id: "who", emoji: "🙋", label: "Anmelder" },
  { id: "spec", emoji: "🛡️", label: "Schutz" },
  { id: "summary", emoji: "🎉", label: "Fertig" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Darf der Nutzer vom jeweiligen Schritt weiter? */
export function canContinue(step: StepId, data: WizardData, hasSelection: boolean): boolean {
  switch (step) {
    case "name":
      if (data.markType !== "bild" && data.markName.trim().length < 2) return false;
      if (data.markType !== "wort" && !data.logoDataUrl) return false;
      return true;
    case "what":
      return data.offerings.length > 0 || data.description.trim().length >= 20;
    case "more":
    case "future":
      return true;
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
    case "spec":
      return hasSelection;
    case "summary":
      return true;
  }
}

/** Fingerabdruck der Angaben, die das Verzeichnis beeinflussen */
export function specInputKey(data: WizardData, pitch: File | null): string {
  return JSON.stringify([
    data.markName,
    data.markType,
    data.offerings,
    data.description,
    data.website,
    data.futurePlans,
    data.futureNote,
    data.country,
    pitch ? `${pitch.name}:${pitch.size}` : null,
  ]);
}
