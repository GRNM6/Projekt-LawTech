export interface ChipOption {
  id: string;
  emoji: string;
  label: string;
}

/** Zukunftspläne – damit die Marke mitwachsen kann. */
export const FUTURE_PLANS: ChipOption[] = [
  { id: "merch", emoji: "🧢", label: "Eigenes Merch" },
  { id: "app", emoji: "📱", label: "Eine eigene App" },
  { id: "shop", emoji: "🛒", label: "Einen Online-Shop" },
  { id: "courses", emoji: "🎓", label: "Kurse oder Workshops" },
  { id: "events", emoji: "🎉", label: "Eigene Events" },
  { id: "media", emoji: "🎙️", label: "Podcast oder YouTube" },
  { id: "products", emoji: "📦", label: "Eigene Produkte" },
  { id: "international", emoji: "🌍", label: "Ins Ausland expandieren" },
];

export interface Country {
  code: string;
  name: string;
  /** Liegt im Europäischen Wirtschaftsraum – sonst ist ein Vertreter Pflicht */
  eea: boolean;
}

const EEA: [string, string][] = [
  ["DE", "Deutschland"], ["AT", "Österreich"], ["BE", "Belgien"], ["BG", "Bulgarien"],
  ["HR", "Kroatien"], ["CY", "Zypern"], ["CZ", "Tschechien"], ["DK", "Dänemark"],
  ["EE", "Estland"], ["FI", "Finnland"], ["FR", "Frankreich"], ["GR", "Griechenland"],
  ["HU", "Ungarn"], ["IE", "Irland"], ["IT", "Italien"], ["LV", "Lettland"],
  ["LT", "Litauen"], ["LU", "Luxemburg"], ["MT", "Malta"], ["NL", "Niederlande"],
  ["PL", "Polen"], ["PT", "Portugal"], ["RO", "Rumänien"], ["SK", "Slowakei"],
  ["SI", "Slowenien"], ["ES", "Spanien"], ["SE", "Schweden"], ["IS", "Island"],
  ["LI", "Liechtenstein"], ["NO", "Norwegen"],
];

const NON_EEA: [string, string][] = [
  ["CH", "Schweiz"], ["GB", "Vereinigtes Königreich"], ["US", "USA"], ["TR", "Türkei"],
  ["OTHER", "Anderes Land"],
];

export const COUNTRIES: Country[] = [
  ...EEA.map(([code, name]) => ({ code, name, eea: true })),
  ...NON_EEA.map(([code, name]) => ({ code, name, eea: false })),
];

export function countryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export function isEea(code: string): boolean {
  return COUNTRIES.find((c) => c.code === code)?.eea ?? false;
}

export function optionLabel(options: ChipOption[], id: string): string {
  const o = options.find((x) => x.id === id);
  return o ? `${o.emoji} ${o.label}` : id;
}
