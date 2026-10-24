/**
 * Katalog der auswählbaren Bereiche (Chips) in Alltagssprache.
 *
 * Deckt alle 45 Nizza-Klassen ab. Die KI wählt in Schritt „Angebot“ passende Bereiche
 * aus diesem Katalog aus, statt frei zu formulieren – so bleiben die Chips verständlich
 * und jeder Chip führt sicher zu den richtigen Klassen.
 *
 * `keywords` dient im Demo-Modus (ohne API-Schlüssel) als einfache Schlagwortsuche.
 */

export interface Bereich {
  id: string;
  emoji: string;
  label: string;
  group: BereichGroup;
  /** Nizza-Klassen, die dieser Bereich typischerweise berührt (wichtigste zuerst) */
  classes: number[];
  /** Kleingeschriebene Suchbegriffe für den Demo-Modus */
  keywords: string[];
}

export type BereichGroup =
  | "digital"
  | "handel"
  | "mode"
  | "essen"
  | "gesundheit"
  | "wohnen"
  | "freizeit"
  | "business"
  | "industrie";

export const BEREICH_GROUPS: { id: BereichGroup; label: string }[] = [
  { id: "digital", label: "Digital & Medien" },
  { id: "handel", label: "Verkaufen & Handel" },
  { id: "mode", label: "Mode & Accessoires" },
  { id: "essen", label: "Essen & Trinken" },
  { id: "gesundheit", label: "Gesundheit & Beauty" },
  { id: "wohnen", label: "Haus, Wohnen & Garten" },
  { id: "freizeit", label: "Freizeit, Sport & Reisen" },
  { id: "business", label: "Dienstleistungen für Unternehmen & Menschen" },
  { id: "industrie", label: "Industrie & Material" },
];

export const BEREICHE: Bereich[] = [
  // Digital & Medien
  { id: "app", emoji: "📱", label: "App oder Software", group: "digital", classes: [9, 42], keywords: ["app", "software", "saas", "tool", "programm"] },
  { id: "plattform", emoji: "🌐", label: "Online-Plattform oder Marktplatz", group: "digital", classes: [35, 42], keywords: ["plattform", "marktplatz", "vermittlung", "portal", "matching"] },
  { id: "community", emoji: "💬", label: "Community, Chat oder Social Media", group: "digital", classes: [38, 42], keywords: ["community", "chat", "social", "netzwerk", "messenger", "forum"] },
  { id: "medien", emoji: "🎙️", label: "Podcast, Video oder Streaming", group: "digital", classes: [41, 38, 9], keywords: ["podcast", "video", "youtube", "streaming", "film", "musik", "kanal"] },
  { id: "games", emoji: "🎮", label: "Games", group: "digital", classes: [9, 41, 28], keywords: ["game", "spiel", "gaming", "esport"] },
  { id: "it", emoji: "🖥️", label: "IT-Dienstleistungen & Webentwicklung", group: "digital", classes: [42], keywords: ["it", "webentwicklung", "hosting", "programmierung", "entwicklung", "ki"] },
  { id: "elektronik", emoji: "🔌", label: "Elektronik & Gadgets", group: "digital", classes: [9], keywords: ["elektronik", "gadget", "kopfhörer", "ladegerät", "hardware", "smart"] },

  // Verkaufen & Handel
  { id: "shop", emoji: "🛒", label: "Online-Shop", group: "handel", classes: [35], keywords: ["shop", "onlineshop", "verkauf", "e-commerce", "versand"] },
  { id: "laden", emoji: "🏪", label: "Laden oder Einzelhandel", group: "handel", classes: [35], keywords: ["laden", "geschäft", "store", "einzelhandel", "boutique"] },
  { id: "grosshandel", emoji: "📦", label: "Großhandel & Import", group: "handel", classes: [35], keywords: ["großhandel", "import", "export", "vertrieb", "b2b"] },

  // Mode & Accessoires
  { id: "kleidung", emoji: "👕", label: "Kleidung, Schuhe & Merch", group: "mode", classes: [25], keywords: ["kleidung", "mode", "fashion", "shirt", "schuhe", "merch", "hoodie"] },
  { id: "taschen", emoji: "👜", label: "Taschen, Rucksäcke & Lederwaren", group: "mode", classes: [18], keywords: ["tasche", "rucksack", "leder", "koffer", "geldbörse"] },
  { id: "schmuck", emoji: "💍", label: "Schmuck & Uhren", group: "mode", classes: [14], keywords: ["schmuck", "uhr", "ring", "kette", "armband"] },
  { id: "brillen", emoji: "🕶️", label: "Brillen & Sonnenbrillen", group: "mode", classes: [9], keywords: ["brille", "sonnenbrille", "optik"] },
  { id: "kurzwaren", emoji: "🧵", label: "Haarschmuck, Knöpfe & Nähzubehör", group: "mode", classes: [26, 23], keywords: ["haarschmuck", "knopf", "nähen", "garn", "wolle", "patch", "aufnäher"] },
  { id: "textilien", emoji: "🛏️", label: "Stoffe, Bettwäsche & Handtücher", group: "mode", classes: [24], keywords: ["stoff", "bettwäsche", "handtuch", "textil", "decke"] },

  // Essen & Trinken
  { id: "gastro", emoji: "🍕", label: "Restaurant, Café oder Catering", group: "essen", classes: [43], keywords: ["restaurant", "café", "cafe", "catering", "imbiss", "bar", "foodtruck"] },
  { id: "suesses", emoji: "🥐", label: "Backwaren, Süßes, Kaffee & Tee", group: "essen", classes: [30], keywords: ["backwaren", "brot", "kuchen", "schokolade", "süß", "kaffee", "tee", "eis", "gewürz", "müsli"] },
  { id: "lebensmittel", emoji: "🧀", label: "Fleisch, Käse, Fertiggerichte & vegane Alternativen", group: "essen", classes: [29], keywords: ["fleisch", "wurst", "käse", "milch", "fertiggericht", "vegan", "aufstrich", "snack"] },
  { id: "frisch", emoji: "🥕", label: "Obst, Gemüse & frische Pflanzen", group: "essen", classes: [31], keywords: ["obst", "gemüse", "pflanze", "blumen", "saatgut", "frisch"] },
  { id: "getraenke", emoji: "🥤", label: "Limo, Saft, Wasser & Bier", group: "essen", classes: [32], keywords: ["limo", "saft", "wasser", "bier", "getränk", "smoothie", "energy"] },
  { id: "alkohol", emoji: "🍷", label: "Wein, Sekt & Spirituosen", group: "essen", classes: [33], keywords: ["wein", "sekt", "gin", "schnaps", "spirituose", "likör", "whisky"] },
  { id: "tabak", emoji: "💨", label: "Tabak & E-Zigaretten", group: "essen", classes: [34], keywords: ["tabak", "zigarette", "e-zigarette", "shisha", "vape"] },

  // Gesundheit & Beauty
  { id: "kosmetik", emoji: "💄", label: "Kosmetik, Pflege & Düfte", group: "gesundheit", classes: [3], keywords: ["kosmetik", "pflege", "creme", "parfum", "duft", "shampoo", "makeup", "seife"] },
  { id: "supplements", emoji: "💊", label: "Nahrungsergänzung & Arzneimittel", group: "gesundheit", classes: [5], keywords: ["nahrungsergänzung", "vitamin", "supplement", "arznei", "medikament", "protein"] },
  { id: "medizinprodukte", emoji: "🩹", label: "Medizinische Geräte & Hilfsmittel", group: "gesundheit", classes: [10], keywords: ["medizinprodukt", "medizinisch", "gerät", "hilfsmittel", "orthopädie"] },
  { id: "praxis", emoji: "🩺", label: "Arztpraxis, Therapie & Pflege", group: "gesundheit", classes: [44], keywords: ["arzt", "praxis", "therapie", "physiotherapie", "pflege", "psychologie"] },
  { id: "beautyservice", emoji: "💇", label: "Friseur, Kosmetikstudio & Wellness", group: "gesundheit", classes: [44], keywords: ["friseur", "kosmetikstudio", "wellness", "massage", "spa", "nagel", "tattoo"] },

  // Haus, Wohnen & Garten
  { id: "moebel", emoji: "🛋️", label: "Möbel", group: "wohnen", classes: [20], keywords: ["möbel", "sofa", "tisch", "stuhl", "regal", "matratze"] },
  { id: "deko", emoji: "🖼️", label: "Teppiche, Tapeten & Wohndeko", group: "wohnen", classes: [27, 20], keywords: ["teppich", "tapete", "deko", "wohnaccessoire", "spiegel"] },
  { id: "haushalt", emoji: "🍽️", label: "Geschirr, Küchen- & Haushaltswaren", group: "wohnen", classes: [21], keywords: ["geschirr", "küche", "haushalt", "tasse", "flasche", "glas", "bürste"] },
  { id: "geraete", emoji: "💡", label: "Lampen, Heizung, Sanitär & Kaffeemaschinen", group: "wohnen", classes: [11], keywords: ["lampe", "licht", "heizung", "sanitär", "kaffeemaschine", "klima", "kühlschrank"] },
  { id: "kerzen", emoji: "🕯️", label: "Kerzen & Brennstoffe", group: "wohnen", classes: [4], keywords: ["kerze", "brennstoff", "holz", "kohle", "öl"] },
  { id: "werkzeug", emoji: "🔧", label: "Werkzeug & Besteck", group: "wohnen", classes: [8], keywords: ["werkzeug", "messer", "besteck", "rasierer", "schere"] },
  { id: "bau", emoji: "🏗️", label: "Bau, Handwerk, Reparatur & Reinigung", group: "wohnen", classes: [37], keywords: ["bau", "handwerk", "reparatur", "reinigung", "renovierung", "installation", "hausmeister"] },
  { id: "baustoffe", emoji: "🧱", label: "Baustoffe & Metallwaren", group: "wohnen", classes: [19, 6], keywords: ["baustoff", "holz", "stein", "fliesen", "metall", "schloss", "beschlag"] },
  { id: "garten", emoji: "🌱", label: "Garten- & Landschaftspflege", group: "wohnen", classes: [44, 31], keywords: ["garten", "landschaft", "gärtner", "pflanzen", "rasen"] },
  { id: "haustier", emoji: "🐶", label: "Haustierbedarf & Tierpflege", group: "wohnen", classes: [31, 18, 44], keywords: ["haustier", "hund", "katze", "tierfutter", "leine", "halsband", "tierpflege"] },

  // Freizeit, Sport & Reisen
  { id: "spielzeug", emoji: "🧸", label: "Spielzeug, Spiele & Sportgeräte", group: "freizeit", classes: [28], keywords: ["spielzeug", "brettspiel", "puzzle", "sportgerät", "ball", "fitnessgerät"] },
  { id: "fitness", emoji: "🏋️", label: "Fitnessstudio, Sportkurse & Vereine", group: "freizeit", classes: [41], keywords: ["fitness", "sport", "yoga", "kurs", "verein", "training"] },
  { id: "musik", emoji: "🎸", label: "Musikinstrumente", group: "freizeit", classes: [15], keywords: ["instrument", "gitarre", "klavier", "musikinstrument"] },
  { id: "papier", emoji: "📚", label: "Bücher, Magazine, Papier & Schreibwaren", group: "freizeit", classes: [16], keywords: ["buch", "magazin", "papier", "schreibwaren", "kalender", "poster", "verpackung", "sticker"] },
  { id: "events", emoji: "🎉", label: "Events, Partys & Konzerte", group: "freizeit", classes: [41], keywords: ["event", "party", "konzert", "festival", "veranstaltung"] },
  { id: "reisen", emoji: "✈️", label: "Reisen, Touren & Transport", group: "freizeit", classes: [39], keywords: ["reise", "tour", "transport", "logistik", "lieferung", "kurier", "taxi", "lager"] },
  { id: "unterkunft", emoji: "🏨", label: "Hotel, Hostel & Ferienwohnung", group: "freizeit", classes: [43], keywords: ["hotel", "hostel", "ferienwohnung", "unterkunft", "pension"] },
  { id: "fahrzeuge", emoji: "🚲", label: "Fahrräder, E-Scooter & Fahrzeuge", group: "freizeit", classes: [12], keywords: ["fahrrad", "e-bike", "scooter", "auto", "fahrzeug", "kinderwagen"] },
  { id: "outdoor", emoji: "⛺", label: "Zelte, Seile & Outdoor-Ausrüstung", group: "freizeit", classes: [22], keywords: ["zelt", "seil", "plane", "outdoor", "hängematte", "camping"] },
  { id: "feuerwerk", emoji: "🎆", label: "Feuerwerk & Jagdbedarf", group: "freizeit", classes: [13], keywords: ["feuerwerk", "pyrotechnik", "jagd", "munition"] },

  // Dienstleistungen
  { id: "beratung", emoji: "💼", label: "Unternehmensberatung", group: "business", classes: [35], keywords: ["beratung", "consulting", "berater", "strategie"] },
  { id: "marketing", emoji: "📣", label: "Marketing, Werbung & Personalvermittlung", group: "business", classes: [35], keywords: ["marketing", "werbung", "pr", "recruiting", "personal", "social media marketing"] },
  { id: "design", emoji: "🎨", label: "Agentur, Design & Fotografie", group: "business", classes: [42, 41], keywords: ["agentur", "design", "grafik", "fotografie", "branding", "architektur"] },
  { id: "bildung", emoji: "🎓", label: "Kurse, Coaching & Bildung", group: "business", classes: [41], keywords: ["kurs", "coaching", "workshop", "schule", "bildung", "nachhilfe", "seminar"] },
  { id: "finanzen", emoji: "💶", label: "Finanzen, Versicherungen & Immobilien", group: "business", classes: [36], keywords: ["finanzen", "versicherung", "immobilie", "geld", "investment", "fintech", "krypto"] },
  { id: "telekom", emoji: "📡", label: "Telekommunikation & Datenübertragung", group: "business", classes: [38], keywords: ["telekommunikation", "internet", "mobilfunk", "übertragung", "telefon"] },
  { id: "recht", emoji: "⚖️", label: "Recht, Sicherheit & persönliche Dienste", group: "business", classes: [45], keywords: ["recht", "anwalt", "legal", "sicherheit", "dating", "babysitting", "bestattung"] },
  { id: "fertigung", emoji: "🏭", label: "Fertigung, Druck & Veredelung im Auftrag", group: "business", classes: [40], keywords: ["fertigung", "druck", "veredelung", "upcycling", "auftragsfertigung", "3d-druck"] },
  { id: "forschung", emoji: "🔬", label: "Forschung, Labor & Technik-Entwicklung", group: "business", classes: [42], keywords: ["forschung", "labor", "entwicklung", "ingenieur", "technik"] },

  // Industrie & Material
  { id: "chemie", emoji: "⚗️", label: "Chemikalien & Dünger", group: "industrie", classes: [1], keywords: ["chemie", "chemikalie", "dünger", "klebstoff"] },
  { id: "farben", emoji: "🖌️", label: "Farben & Lacke", group: "industrie", classes: [2], keywords: ["farbe", "lack", "tinte", "toner"] },
  { id: "maschinen", emoji: "⚙️", label: "Maschinen, Motoren & Küchenmaschinen", group: "industrie", classes: [7], keywords: ["maschine", "motor", "roboter", "küchenmaschine", "staubsauger"] },
  { id: "kunststoff", emoji: "🧪", label: "Kunststoffe, Gummi & Dämmstoffe", group: "industrie", classes: [17], keywords: ["kunststoff", "gummi", "dämmung", "schlauch", "folie"] },
];

/** Bereich zu einer ID */
export function bereichById(id: string): Bereich | undefined {
  return BEREICHE.find((b) => b.id === id);
}
