import { bereichById, matchBereiche } from "./bereiche";
import { higherTier, primaryMarkName, type SpecClass, type SpecResult, type SpecTier, type WizardData } from "./types";

/**
 * Beispiel-Verzeichnis, solange kein ANTHROPIC_API_KEY gesetzt ist.
 * Bildet die Auswahl grob auf Nizza-Klassen ab, damit der Flow lokal durchklickbar ist.
 * Die Begriffe sind nur Platzhalter – das echte Verzeichnis erstellt die KI.
 */
type Template = Omit<SpecClass, "tier">;

const BY_ID: Record<string, Template[]> = {
  app: [
    {
      classNumber: 9,
      title: "Apps & Software",
      why: "Schützt deine Marke auf allem, was man herunterladen und installieren kann – also deiner App.",
      terms: ["Herunterladbare Computersoftware", "Herunterladbare Anwendungssoftware für Mobiltelefone"],
    },
    {
      classNumber: 42,
      title: "Software im Netz & Entwicklung",
      why: "Deckt ab, wenn deine Software im Browser läuft oder du sie für andere entwickelst.",
      terms: ["Software as a Service [SaaS]", "Entwicklung von Software"],
    },
  ],
  shop: [
    {
      classNumber: 35,
      title: "Verkaufen & Werbung",
      why: "Damit niemand anderes unter deinem Namen einen Shop oder Marktplatz betreibt.",
      terms: ["Bereitstellung eines Online-Marktplatzes für Käufer und Verkäufer von Waren und Dienstleistungen", "Werbung"],
    },
  ],
  fashion: [
    {
      classNumber: 25,
      title: "Kleidung",
      why: "Schützt deinen Namen auf Shirts, Hoodies, Caps und Schuhen.",
      terms: ["Bekleidungsstücke", "Schuhwaren", "Kopfbedeckungen"],
    },
  ],
  food: [
    {
      classNumber: 43,
      title: "Gastronomie",
      why: "Für alles rund ums Bewirten: Restaurant, Café oder Catering.",
      terms: ["Verpflegung von Gästen in Restaurants", "Catering"],
    },
  ],
  foodproducts: [
    {
      classNumber: 30,
      title: "Lebensmittel",
      why: "Schützt deine Marke auf verpackten Lebensmitteln wie Snacks oder Kaffee.",
      terms: ["Kaffee", "Backwaren", "Süßwaren"],
    },
    {
      classNumber: 32,
      title: "Getränke",
      why: "Für alkoholfreie Getränke wie Limonaden oder Säfte.",
      terms: ["Alkoholfreie Getränke", "Fruchtsäfte"],
    },
  ],
  consulting: [
    {
      classNumber: 35,
      title: "Beratung & Business",
      why: "Deckt deine Beratungsleistungen für Unternehmen ab.",
      terms: ["Unternehmensberatung", "Betriebswirtschaftliche Beratung"],
    },
  ],
  courses: [
    {
      classNumber: 41,
      title: "Kurse & Wissen",
      why: "Für alles, wo du anderen etwas beibringst – online oder vor Ort.",
      terms: ["Coaching [Ausbildung und Erziehung]", "Durchführung von Workshops [Ausbildung]"],
    },
  ],
  events: [
    {
      classNumber: 41,
      title: "Events & Unterhaltung",
      why: "Schützt deinen Namen, wenn du Veranstaltungen organisierst.",
      terms: ["Organisation von Veranstaltungen zu Unterhaltungszwecken"],
    },
  ],
  media: [
    {
      classNumber: 41,
      title: "Medien & Unterhaltung",
      why: "Für Podcasts, Videos und andere Inhalte, die du produzierst.",
      terms: ["Produktion von Podcasts", "Produktion von Videofilmen"],
    },
  ],
  agency: [
    {
      classNumber: 42,
      title: "Design & Web",
      why: "Deckt kreative Leistungen wie Grafik- und Webdesign ab.",
      terms: ["Grafikdesign", "Gestaltung von Webseiten"],
    },
    {
      classNumber: 35,
      title: "Werbung & Marketing",
      why: "Für Marketing- und Werbeleistungen, die du für Kunden erbringst.",
      terms: ["Werbung", "Marketing"],
    },
  ],
  beauty: [
    {
      classNumber: 3,
      title: "Kosmetik & Pflege",
      why: "Schützt deine Marke auf Cremes, Make-up und Pflegeprodukten.",
      terms: ["Kosmetika", "Hautpflegemittel"],
    },
  ],
  health: [
    {
      classNumber: 44,
      title: "Gesundheit",
      why: "Für medizinische, therapeutische oder gesundheitsbezogene Leistungen.",
      terms: ["Gesundheitsberatung"],
    },
  ],
  fitness: [
    {
      classNumber: 41,
      title: "Sport & Fitness",
      why: "Für Trainings, Kurse und alles rund um Bewegung.",
      terms: ["Durchführung von Fitnesskursen", "Sportunterricht"],
    },
  ],
  finance: [
    {
      classNumber: 36,
      title: "Finanzen",
      why: "Deckt Finanzdienstleistungen und -beratung ab.",
      terms: ["Finanzberatung"],
    },
  ],
  travel: [
    {
      classNumber: 39,
      title: "Reisen",
      why: "Für das Organisieren und Vermitteln von Reisen.",
      terms: ["Organisation von Reisen"],
    },
  ],
  home: [
    {
      classNumber: 20,
      title: "Möbel & Einrichtung",
      why: "Schützt deine Marke auf Möbeln und Wohnaccessoires.",
      terms: ["Möbel", "Spiegel"],
    },
  ],
  legal: [
    {
      classNumber: 45,
      title: "Rechtliches",
      why: "Für juristische Dienstleistungen und Rechtsinformationen.",
      terms: ["Juristische Dienstleistungen"],
    },
  ],
  products: [],
  international: [],
  merch: [],
};

/** Bereiche aus dem Katalog, für die es eine Demo-Vorlage gibt */
const BEREICH_TO_TEMPLATE: Record<string, string> = {
  app: "app",
  plattform: "app",
  it: "app",
  shop: "shop",
  laden: "shop",
  kleidung: "fashion",
  gastro: "food",
  suesses: "foodproducts",
  getraenke: "foodproducts",
  beratung: "consulting",
  bildung: "courses",
  events: "events",
  medien: "media",
  design: "agency",
  kosmetik: "beauty",
  praxis: "health",
  fitness: "fitness",
  finanzen: "finance",
  reisen: "travel",
  moebel: "home",
  recht: "legal",
};

/** Platzhalter-Klassen für Bereiche ohne eigene Demo-Vorlage */
function templatesFromCatalog(bereichId: string): Template[] {
  const b = bereichById(bereichId);
  if (!b) return [];
  return b.classes.map((classNumber) => ({
    classNumber,
    title: b.label,
    why: "Beispiel aus dem Demo-Modus – mit KI-Schlüssel steht hier, warum diese Klasse zu dir passt.",
    terms: [`Beispielbegriff für „${b.label}“ (wird mit KI-Schlüssel individuell erstellt)`],
  }));
}

/** Zukunftspläne, die auf eine Angebots-ID verweisen */
const FUTURE_TO_OFFERING: Record<string, string> = {
  merch: "fashion",
  app: "app",
  shop: "shop",
  courses: "courses",
  events: "events",
  media: "media",
};

export function buildDemoSpec(data: WizardData, sourcesUsed: string[]): SpecResult {
  const classes = new Map<number, SpecClass>();

  const addTemplates = (templates: Template[], tier: SpecTier) => {
    for (const t of templates) {
      const existing = classes.get(t.classNumber);
      if (existing) {
        existing.terms = Array.from(new Set([...existing.terms, ...t.terms]));
        existing.tier = higherTier(existing.tier, tier);
      } else {
        classes.set(t.classNumber, { ...t, terms: [...t.terms], tier });
      }
    }
  };

  const add = (templateId: string, tier: SpecTier) => addTemplates(BY_ID[templateId] ?? [], tier);
  // Bereiche aus dem Katalog: eigene Demo-Vorlage, sonst Platzhalter je Klasse
  const addBereich = (bereichId: string, tier: SpecTier) => {
    const templateId = BEREICH_TO_TEMPLATE[bereichId];
    if (templateId) add(templateId, tier);
    else addTemplates(templatesFromCatalog(bereichId), tier);
  };

  (data.coreBereiche ?? []).forEach((id) => addBereich(id, "muss"));
  matchBereiche(data.coreProtection ?? "").forEach((id) => addBereich(id, "muss"));
  data.offerings.forEach((id) => addBereich(id, "kern"));
  data.futurePlans.forEach((id) => {
    const offering = FUTURE_TO_OFFERING[id];
    if (offering) add(offering, "spaeter");
  });

  if (classes.size === 0) {
    add("consulting", "kern");
  }

  const name = (data.markType !== "bild" && primaryMarkName(data)) || "deine Marke";
  return {
    summary: `So könnte der Schutz für „${name}“ aussehen. Das ist ein Beispiel – mit hinterlegtem KI-Schlüssel wird das Verzeichnis individuell aus deinen Angaben erstellt.`,
    classes: Array.from(classes.values()).sort((a, b) => a.classNumber - b.classNumber),
    hints: [
      "Demo-Modus: Es ist noch kein ANTHROPIC_API_KEY hinterlegt, deshalb siehst du Beispieldaten.",
    ],
    sourcesUsed,
    demo: true,
  };
}
