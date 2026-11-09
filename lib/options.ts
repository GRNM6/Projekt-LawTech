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
