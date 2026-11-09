"use client";

import { useRef, useState } from "react";
import { BEREICH_GROUPS, BEREICHE, bereichById } from "@/lib/bereiche";
import { COUNTRIES, isEea } from "@/lib/options";
import { filledMarkNames, primaryMarkName, type MarkType, type SuggestResult, type WizardData } from "@/lib/types";
import { NameTips } from "./NameTips";
import { Callout, Chip, ChoiceCard, Field, inputClass, StepHeader } from "./ui";

type Update = (patch: Partial<WizardData>) => void;

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/* ------------------------------------------------------------------ */
/* 1 · Marke                                                            */
/* ------------------------------------------------------------------ */

const MARK_TYPES: {
  id: MarkType;
  emoji: string;
  title: string;
  text: string;
  pros: string[];
  cons: string[];
}[] = [
  {
    id: "wort",
    emoji: "🔤",
    title: "Wortmarke",
    text: "Geschützt wird nur dein Name – egal in welcher Schrift oder Farbe.",
    pros: [
      "Breitester Schutz für deinen Namen – egal in welcher Schrift, Farbe oder Gestaltung.",
      "Du kannst dein Logo später ändern, ohne neu anmelden zu müssen.",
    ],
    cons: [
      "Der Name muss für sich allein unterscheidungskräftig sein.",
      "Dein Logo-Design ist damit nicht geschützt.",
    ],
  },
  {
    id: "wortbild",
    emoji: "🖼️",
    title: "Wort-/Bildmarke",
    text: "Geschützt wird dein Name zusammen mit deinem Logo – genau so, wie beides aussieht.",
    pros: [
      "Schützt deinen Auftritt genau so, wie Kunden ihn sehen.",
      "Kann auch klappen, wenn der Name allein zu schwach wäre.",
    ],
    cons: [
      "Geschützt ist nur diese Kombination – den Namen in anderer Gestaltung erfasst sie weniger sicher.",
      "Änderst du das Logo deutlich, brauchst du eine neue Anmeldung.",
    ],
  },
  {
    id: "bild",
    emoji: "🎨",
    title: "Bildmarke",
    text: "Geschützt wird nur dein Logo – ein Zeichen ohne Text.",
    pros: [
      "Schützt ein Zeichen, das Kunden auch ohne Namen wiedererkennen.",
      "Funktioniert in jeder Sprache und jedem Land gleich.",
    ],
    cons: [
      "Dein Name bleibt ungeschützt.",
      "Ändert sich das Logo deutlich, brauchst du eine neue Anmeldung.",
    ],
  },
];

const NAME_SLOTS = [
  { label: "Option 1 · dein Favorit", placeholder: "z. B. Fluffy Rockets" },
  { label: "Option 2 (optional)", placeholder: "z. B. Rocket Paws" },
  { label: "Option 3 (optional)", placeholder: "z. B. Wuffwerk" },
] as const;

function MarkTypeInfo({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <details className="group mt-2 rounded-xl bg-paper px-3 py-2 text-sm">
      <summary className="cursor-pointer font-medium text-muted select-none group-open:text-ink">
        ℹ️ Vor- und Nachteile
      </summary>
      <div className="mt-2 space-y-2 pb-1">
        <ul className="space-y-1">
          {pros.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="text-mint">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <ul className="space-y-1">
          {cons.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="text-coral">✗</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export function StepName({ data, update }: { data: WizardData; update: Update }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  function onLogo(file: File | undefined) {
    setLogoError(null);
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setLogoError("Bitte lade ein PNG oder JPG hoch.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Das Logo darf höchstens 2 MB groß sein.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  function setName(index: number, value: string) {
    const markNames = [...data.markNames] as WizardData["markNames"];
    markNames[index] = value;
    update({ markNames });
  }

  const showName = data.markType !== "bild";
  const showLogo = data.markType !== "wort";
  const names = filledMarkNames(data);

  return (
    <div>
      <StepHeader emoji="✏️" title="Wie soll deine Marke heißen?" />

      <NameTips />

      <div className="grid items-start gap-3 sm:grid-cols-3">
        {MARK_TYPES.map((t) => (
          <div key={t.id}>
            <ChoiceCard
              selected={data.markType === t.id}
              onClick={() => update({ markType: t.id })}
              emoji={t.emoji}
              title={t.title}
              text={t.text}
            />
            <MarkTypeInfo pros={t.pros} cons={t.cons} />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {showName && (
          <div>
            <span className="mb-1 block text-sm font-semibold">Deine Namensideen</span>
            <span className="mb-3 block text-xs text-muted">
              Gib bis zu drei Optionen an – dein Favorit zuerst.
            </span>
            <div className="space-y-3">
              {NAME_SLOTS.map((slot, i) => (
                <Field key={slot.label} label={slot.label}>
                  <input
                    className={`${inputClass} ${
                      i === 0 ? "font-display text-2xl font-bold" : "font-display text-lg font-semibold"
                    }`}
                    value={data.markNames[i]}
                    onChange={(e) => setName(i, e.target.value)}
                    placeholder={slot.placeholder}
                    maxLength={80}
                    autoFocus={i === 0}
                  />
                </Field>
              ))}
            </div>
          </div>
        )}

        {showLogo && (
          <div>
            <span className="mb-1.5 block text-sm font-semibold">Dein Logo</span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-line bg-paper p-6 transition hover:border-violet"
            >
              {data.logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logoDataUrl} alt="Dein Logo" className="max-h-32 object-contain" />
              ) : (
                <span className="text-muted">📤 Logo hochladen (PNG oder JPG, max. 2 MB)</span>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => onLogo(e.target.files?.[0])}
            />
            {logoError && <p className="mt-2 text-sm text-coral">{logoError}</p>}
          </div>
        )}
      </div>

      {((showName && names.length > 0) || (showLogo && data.logoDataUrl)) && (
        <div className="mt-8 rounded-2xl border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_#1d1b2f]">
          <p className="text-xs font-semibold tracking-widest text-muted uppercase">Vorschau · Unionsmarke</p>
          <div className="mt-3 flex items-center gap-4">
            {showLogo && data.logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoDataUrl} alt="" className="h-14 w-14 object-contain" />
            )}
            {showName && names[0] && (
              <span className="font-display text-3xl font-extrabold break-all">{names[0]}</span>
            )}
          </div>
          {showName && names.length > 1 && (
            <p className="mt-3 text-sm text-muted">Alternativen: {names.slice(1).join(" · ")}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Kern                                                             */
/* ------------------------------------------------------------------ */

const PROTECTION_FACTS: { emoji: string; title: string; text: string }[] = [
  {
    emoji: "🎯",
    title: "Nur das, was du angibst",
    text: "Deine Marke gilt für die Waren und Dienstleistungen, die du bei der Anmeldung angibst – und für sehr ähnliche.",
  },
  {
    emoji: "🔒",
    title: "Später erweitern geht nicht",
    text: "Die Liste kann man nach der offiziellen Anmeldung beim Amt nur kürzen, nicht ergänzen. Für etwas Neues braucht es eine neue Markenanmeldung.",
  },
  {
    emoji: "⏳",
    title: "10 Jahre, beliebig verlängerbar",
    text: "Der Schutz gilt ab dem Anmeldetag in allen 27 EU-Staaten und lässt sich alle 10 Jahre gegen Gebühr verlängern.",
  },
  {
    emoji: "✋",
    title: "Benutzen ist Pflicht",
    text: "Spätestens 5 Jahre nach der Eintragung musst du die Marke für das Eingetragene wirklich nutzen – sonst kannst du sie dafür verlieren. Deshalb lieber gezielt als „alles auf Vorrat“.",
  },
];

function ProtectionInfo() {
  return (
    <details className="group rounded-2xl border-2 border-line bg-paper px-4 py-3">
      <summary className="cursor-pointer font-semibold select-none group-open:mb-3">
        ℹ️ Was schützt eine EU-Marke eigentlich?
      </summary>
      <ul className="space-y-3 text-sm">
        {PROTECTION_FACTS.map((f) => (
          <li key={f.title} className="flex gap-3">
            <span className="text-xl leading-6">{f.emoji}</span>
            <span>
              <span className="block font-semibold">{f.title}</span>
              <span className="text-muted">{f.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function StepKern({
  data,
  update,
  suggestion,
  stale,
  loading,
  error,
  onSuggest,
}: {
  data: WizardData;
  update: Update;
  suggestion: SuggestResult | null;
  /** Text wurde nach den letzten Vorschlägen geändert */
  stale: boolean;
  loading: boolean;
  error: string | null;
  onSuggest: () => void;
}) {
  const canSuggest = data.coreProtection.trim().length >= 5 && !loading;
  const suggested = suggestion?.suggested ?? [];
  // Gewählte Bereiche, die nicht (mehr) unter den Vorschlägen sind, bleiben sichtbar
  const ownPicks = data.coreBereiche.filter((id) => !suggested.includes(id));
  const shown = new Set([...suggested, ...ownPicks]);
  const toggleCore = (id: string) =>
    update({
      coreBereiche: toggle(data.coreBereiche, id),
      // Ein Bereich ist entweder Kern oder Teil des übrigen Pakets, nicht beides
      offerings: data.offerings.filter((x) => x !== id),
      futureBereiche: data.futureBereiche.filter((x) => x !== id),
    });

  return (
    <div>
      <StepHeader
        emoji="🎯"
        title="Welche Waren und Dienstleistungen sollen unbedingt erfasst werden?"
        subtitle="Beschreibe uns den Kern deines Angebots oder konkrete Waren und Dienstleistungen, die du unbedingt geschützt wissen willst."
      />

      <ProtectionInfo />

      <div className="mt-8">
        <Field
          label="In deinen eigenen Worten"
          hint="Ein, zwei Sätze reichen. Um den Rest kümmern wir uns in den nächsten Schritten."
        >
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={data.coreProtection}
            onChange={(e) => update({ coreProtection: e.target.value })}
            placeholder="z. B. Unsere App, mit der Hundebesitzer Gassi-Partner finden. Das ist der Kern – alles andere kommt später."
            maxLength={1000}
            autoFocus
          />
        </Field>

        {(!suggestion || stale) && (
          <button
            type="button"
            onClick={onSuggest}
            disabled={!canSuggest}
            className="mt-3 rounded-full border-2 border-violet bg-violet-soft px-5 py-2.5 font-semibold text-ink transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {stale ? "🔄 Vorschläge aktualisieren" : "✨ Passende Bereiche anzeigen"}
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-paper p-5">
          <span className="animate-float text-4xl">🤖</span>
          <span className="font-semibold">Ich suche passende Bereiche …</span>
        </div>
      )}

      {error && !loading && (
        <div className="mt-6">
          <Callout tone="coral">
            {error}{" "}
            <button type="button" onClick={onSuggest} className="font-semibold underline">
              Nochmal versuchen
            </button>
          </Callout>
        </div>
      )}

      {suggestion && !loading && (
        <section className="mt-8">
          <h2 className="mb-1 font-display text-xl font-bold">✨ Passt zu deinem Kern</h2>
          <p className="mb-3 text-sm text-muted">
            Tipp an, was unbedingt geschützt werden soll. Das ist später fest dabei.
            {suggestion.demo && (
              <span className="ml-2 rounded-full bg-coral px-2 py-0.5 text-xs font-semibold text-white">Demo-Modus</span>
            )}
          </p>
          {shown.size > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {[...suggested, ...ownPicks].map((id) => (
                <BereichChip key={id} id={id} selected={data.coreBereiche.includes(id)} onToggle={toggleCore} />
              ))}
            </div>
          ) : (
            <p className="text-sm">{suggestion.summary}</p>
          )}

          <AllBereiche
            className="mt-6"
            title="Etwas fehlt? Alle Bereiche"
            exclude={shown}
            isSelected={(id) => data.coreBereiche.includes(id)}
            onToggle={toggleCore}
          />
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bereichs-Chips (Kern und Angebot)                                    */
/* ------------------------------------------------------------------ */

function BereichChip({
  id,
  selected,
  onToggle,
  note,
}: {
  id: string;
  selected: boolean;
  onToggle: (id: string) => void;
  /** Kleiner Zusatz, z. B. „aus deinen Unterlagen“ */
  note?: string;
}) {
  const b = bereichById(id);
  if (!b) return null;
  return (
    <Chip selected={selected} onClick={() => onToggle(id)}>
      {b.emoji} {b.label}
      {note && <span className="ml-1.5 text-xs opacity-75">· {note}</span>}
    </Chip>
  );
}

/** Aufklappbarer Gesamtkatalog, nach Gruppen sortiert */
function AllBereiche({
  title,
  exclude,
  isSelected,
  onToggle,
  defaultOpen = false,
  className = "",
}: {
  title: string;
  exclude: Set<string>;
  isSelected: (id: string) => boolean;
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details className={`group rounded-2xl border-2 border-line bg-paper px-4 py-3 ${className}`} open={defaultOpen}>
      <summary className="cursor-pointer font-semibold select-none group-open:mb-4">➕ {title}</summary>
      <div className="space-y-5">
        {BEREICH_GROUPS.map((g) => {
          const items = BEREICHE.filter((b) => b.group === g.id && !exclude.has(b.id));
          if (items.length === 0) return null;
          return (
            <div key={g.id}>
              <h3 className="mb-2 text-sm font-semibold text-muted">{g.label}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((b) => (
                  <BereichChip key={b.id} id={b.id} selected={isSelected(b.id)} onToggle={onToggle} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Dein Schutzpaket – alles rund um den Kern, heute und später      */
/* ------------------------------------------------------------------ */

export function StepPaket({
  data,
  update,
  pitchFile,
  setPitchFile,
  suggestion,
  sourcesChanged,
  loading,
  error,
  onSuggest,
  textSuggestion,
  textStale,
  textLoading,
  textError,
  onSuggestText,
}: {
  data: WizardData;
  update: Update;
  pitchFile: File | null;
  setPitchFile: (f: File | null) => void;
  suggestion: SuggestResult | null;
  /** Kern, Website oder PDF wurden nach den letzten Vorschlägen geändert */
  sourcesChanged: boolean;
  loading: boolean;
  error: string | null;
  onSuggest: () => void;
  /** Neue Vorschläge aus dem Freitext „Sonst noch etwas?“ */
  textSuggestion: SuggestResult | null;
  textStale: boolean;
  textLoading: boolean;
  textError: string | null;
  onSuggestText: () => void;
}) {
  const [addTo, setAddTo] = useState<"heute" | "spaeter">("heute");

  const core = new Set(data.coreBereiche);
  const heute = new Set(data.offerings);
  const spaeter = new Set(data.futureBereiche);
  const fromSources = new Set(suggestion?.fromSources ?? []);
  const sugHeute = (suggestion?.suggested ?? []).filter((id) => !core.has(id));
  const sugSpaeter = (suggestion?.later ?? []).filter((id) => !core.has(id) && !sugHeute.includes(id));
  // Vorschläge aus dem Freitext: nur, was oben nicht ohnehin schon vorgeschlagen ist
  const notAbove = (id: string) => !core.has(id) && !sugHeute.includes(id) && !sugSpaeter.includes(id);
  const textHeute = (textSuggestion?.suggested ?? []).filter(notAbove);
  const textSpaeter = (textSuggestion?.later ?? []).filter((id) => notAbove(id) && !textHeute.includes(id));
  const textIds = new Set([...textHeute, ...textSpaeter]);

  // Ein Chip steht in der Spalte, in die der Nutzer ihn gewählt hat – sonst dort, wo er vorgeschlagen wurde
  // Chips aus dem Freitext bleiben unten beim Text, damit nichts doppelt erscheint
  const unique = (ids: string[]) => Array.from(new Set(ids)).filter((id) => !core.has(id) && !textIds.has(id));
  const colHeute = unique([...sugHeute.filter((id) => !spaeter.has(id)), ...sugSpaeter.filter((id) => heute.has(id)), ...data.offerings]);
  const colSpaeter = unique([...sugSpaeter.filter((id) => !heute.has(id)), ...sugHeute.filter((id) => spaeter.has(id)), ...data.futureBereiche]);
  const shown = new Set([...core, ...colHeute, ...colSpaeter, ...textIds]);
  const canSuggestText = data.description.trim().length >= 5 && !textLoading && (!textSuggestion || textStale);

  const toggleHeute = (id: string) =>
    update({ offerings: toggle(data.offerings, id), futureBereiche: data.futureBereiche.filter((x) => x !== id) });
  const toggleSpaeter = (id: string) =>
    update({ futureBereiche: toggle(data.futureBereiche, id), offerings: data.offerings.filter((x) => x !== id) });
  const toggleFromCatalog = (id: string) => {
    if (heute.has(id) || spaeter.has(id)) {
      update({ offerings: data.offerings.filter((x) => x !== id), futureBereiche: data.futureBereiche.filter((x) => x !== id) });
    } else if (addTo === "heute") {
      toggleHeute(id);
    } else {
      toggleSpaeter(id);
    }
  };
  const note = (id: string) => (fromSources.has(id) ? "aus deinen Unterlagen" : undefined);

  const name = data.markType !== "bild" && primaryMarkName(data) ? `„${primaryMarkName(data)}“` : "deiner Marke";
  const hasSources = data.website.trim() !== "" || pitchFile !== null;

  return (
    <div>
      <StepHeader
        emoji="🧩"
        title={`Was gehört noch zu ${name}?`}
        subtitle="Rund um deinen Kern: Tipp an, was du heute schon anbietest – und was in den nächsten Jahren dazukommen soll."
      />

      {/* Rückblick auf den Kern */}
      <section className="rounded-2xl border-2 border-violet bg-violet-soft p-4">
        <h2 className="text-sm font-semibold">🎯 Dein Kern – fest dabei</h2>
        <p className="mt-1 text-sm whitespace-pre-line text-muted">{data.coreProtection}</p>
        {data.coreBereiche.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.coreBereiche.map((id) => {
              const b = bereichById(id);
              return b ? (
                <span key={id} className="rounded-full border-2 border-violet bg-paper px-3 py-1 text-sm font-medium">
                  🔒 {b.emoji} {b.label}
                </span>
              ) : null;
            })}
          </div>
        )}
      </section>

      {loading && (
        <div className="mt-8 flex items-center gap-4 rounded-2xl border-2 border-dashed border-line bg-paper p-5">
          <span className="animate-float text-4xl">🤖</span>
          <span>
            <span className="block font-semibold">Ich überlege, was rund um deinen Kern dazugehört …</span>
            <span className="text-sm text-muted">Gleich siehst du meine Vorschläge.</span>
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8">
          <Callout tone="coral">
            {error}{" "}
            <button type="button" onClick={onSuggest} className="font-semibold underline">
              Nochmal versuchen
            </button>
          </Callout>
        </div>
      )}

      {!loading && (
        <>
          {suggestion && (
            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
              {suggestion.summary && <span className="mr-1 text-muted">{suggestion.summary}</span>}
              {suggestion.demo && (
                <span className="rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">Demo-Modus</span>
              )}
              {suggestion.sourcesUsed.map((src) => (
                <span key={src} className="rounded-full bg-mint-soft px-3 py-1 text-xs">
                  ✓ {src} ausgewertet
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border-2 border-line bg-paper p-4">
              <h2 className="font-display text-lg font-bold">💼 Bietest du das heute schon an?</h2>
              <p className="mb-3 text-sm text-muted">Tipp an, was stimmt.</p>
              {colHeute.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {colHeute.map((id) => (
                    <BereichChip key={id} id={id} selected={heute.has(id)} onToggle={toggleHeute} note={note(id)} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">Keine Vorschläge – unten findest du alle Bereiche.</p>
              )}
            </section>

            <section className="rounded-2xl border-2 border-line bg-paper p-4">
              <h2 className="font-display text-lg font-bold">🔮 Kommt das in den nächsten Jahren?</h2>
              <p className="mb-3 text-sm text-muted">
                Nur wählen, was du wirklich vorhast – die Marke muss spätestens 5 Jahre nach der Eintragung benutzt
                werden.
              </p>
              {colSpaeter.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {colSpaeter.map((id) => (
                    <BereichChip key={id} id={id} selected={spaeter.has(id)} onToggle={toggleSpaeter} note={note(id)} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">Keine Vorschläge – unten findest du alle Bereiche.</p>
              )}
            </section>
          </div>
        </>
      )}

      {/* Unterlagen – freiwillig, schärfen die Vorschläge */}
      <PaketSources
        data={data}
        update={update}
        pitchFile={pitchFile}
        setPitchFile={setPitchFile}
        canRefresh={sourcesChanged && !loading}
        hasSources={hasSources}
        onSuggest={onSuggest}
      />

      {/* Etwas fehlt? */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">Etwas fehlt?</h2>
        <div className="mt-2 mb-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Hinzufügen zu:</span>
          <Chip selected={addTo === "heute"} onClick={() => setAddTo("heute")}>
            💼 Heute
          </Chip>
          <Chip selected={addTo === "spaeter"} onClick={() => setAddTo("spaeter")}>
            🔮 Später
          </Chip>
        </div>
        <AllBereiche
          title="Alle Bereiche"
          exclude={shown}
          isSelected={(id) => heute.has(id) || spaeter.has(id)}
          onToggle={toggleFromCatalog}
        />

        <div className="mt-6">
          <Field
            label="Sonst noch etwas? In eigenen Worten"
            hint="Freiwillig – für alles, was du oben nicht findest. Die KI ordnet es der passenden Klasse zu."
          >
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={data.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="z. B. Später wollen wir auch Leinen und Halsbänder verkaufen."
              maxLength={2000}
            />
          </Field>

          {(!textSuggestion || textStale) && (
            <button
              type="button"
              onClick={onSuggestText}
              disabled={!canSuggestText}
              className="mt-3 rounded-full border-2 border-violet bg-violet-soft px-5 py-2.5 font-semibold transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {textStale ? "🔄 Vorschläge aktualisieren" : "✨ Vorschläge zu deinem Text"}
            </button>
          )}

          {textLoading && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-paper p-4">
              <span className="animate-float text-3xl">🤖</span>
              <span className="font-semibold">Ich lese deinen Text …</span>
            </div>
          )}

          {textError && !textLoading && (
            <div className="mt-4">
              <Callout tone="coral">
                {textError}{" "}
                <button type="button" onClick={onSuggestText} className="font-semibold underline">
                  Nochmal versuchen
                </button>
              </Callout>
            </div>
          )}

          {textSuggestion && !textLoading && (
            <div className="mt-4 rounded-2xl border-2 border-line bg-paper p-4">
              {textIds.size === 0 ? (
                <p className="text-sm text-muted">
                  ✓ Keine neuen Vorschläge – was du beschreibst, ist oben schon abgedeckt.
                </p>
              ) : (
                <>
                  <h3 className="font-semibold">✨ Neu aus deinem Text</h3>
                  <p className="mb-3 text-sm text-muted">
                    Tipp an, was dazugehören soll.
                    {textSuggestion.demo && (
                      <span className="ml-2 rounded-full bg-coral px-2 py-0.5 text-xs font-semibold text-white">
                        Demo-Modus
                      </span>
                    )}
                  </p>
                  {textHeute.length > 0 && (
                    <div className="mb-3">
                      <p className="mb-1.5 text-xs font-semibold text-muted">💼 Heute</p>
                      <div className="flex flex-wrap gap-2">
                        {textHeute.map((id) => (
                          <BereichChip key={id} id={id} selected={heute.has(id)} onToggle={toggleHeute} />
                        ))}
                      </div>
                    </div>
                  )}
                  {textSpaeter.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold text-muted">🔮 In den nächsten Jahren</p>
                      <div className="flex flex-wrap gap-2">
                        {textSpaeter.map((id) => (
                          <BereichChip key={id} id={id} selected={spaeter.has(id)} onToggle={toggleSpaeter} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PaketSources({
  data,
  update,
  pitchFile,
  setPitchFile,
  canRefresh,
  hasSources,
  onSuggest,
}: {
  data: WizardData;
  update: Update;
  pitchFile: File | null;
  setPitchFile: (f: File | null) => void;
  canRefresh: boolean;
  hasSources: boolean;
  onSuggest: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function onPitch(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Bitte lade eine PDF-Datei hoch.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Die Datei darf höchstens 10 MB groß sein.");
      return;
    }
    setPitchFile(file);
  }

  return (
    <section className="mt-8 rounded-2xl border-2 border-dashed border-line bg-paper p-4">
      <h2 className="font-display text-lg font-bold">📎 Hast du eine Website oder ein Pitch-Deck?</h2>
      <p className="mb-4 text-sm text-muted">Freiwillig – damit werden die Vorschläge oben genauer.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="🌐 Website">
          <input
            className={inputClass}
            value={data.website}
            onChange={(e) => update({ website: e.target.value })}
            placeholder="www.deine-marke.de"
            inputMode="url"
            autoComplete="url"
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-semibold">📄 Pitch-Deck, Businessplan oder Flyer</span>
          {pitchFile ? (
            <div className="flex items-center justify-between rounded-xl border-2 border-mint bg-mint-soft px-4 py-3">
              <span className="truncate text-sm font-medium">{pitchFile.name}</span>
              <button
                type="button"
                onClick={() => setPitchFile(null)}
                className="ml-3 shrink-0 text-sm font-semibold underline"
              >
                Entfernen
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-line px-4 py-3 text-sm text-muted transition hover:border-violet"
            >
              📤 PDF hochladen (max. 10 MB)
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => onPitch(e.target.files?.[0])}
          />
          {error && <p className="mt-2 text-sm text-coral">{error}</p>}
        </div>
      </div>

      {canRefresh && (
        <button
          type="button"
          onClick={onSuggest}
          className="mt-4 rounded-full border-2 border-violet bg-violet-soft px-5 py-2.5 font-semibold transition hover:-translate-y-0.5"
        >
          {hasSources ? "✨ Auswerten" : "🔄 Vorschläge aktualisieren"}
        </button>
      )}

      <p className="mt-4 text-xs text-muted">
        🔒 Deine Unterlagen nutzen wir nur, um dir passende Bereiche vorzuschlagen und dein Verzeichnis zu erstellen.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Anmelder (kommt nach „Schutz“)                                   */
/* ------------------------------------------------------------------ */

export function StepWho({ data, update }: { data: WizardData; update: Update }) {
  return (
    <div>
      <StepHeader emoji="🙋" title="Wem gehört die Marke?" subtitle="Der Name, der später im Register steht." />

      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceCard
          selected={data.applicantKind === "person"}
          onClick={() => update({ applicantKind: "person" })}
          emoji="🧑"
          title="Mir persönlich"
          text="Du meldest als Privatperson oder Einzelunternehmer an."
        />
        <ChoiceCard
          selected={data.applicantKind === "firma"}
          onClick={() => update({ applicantKind: "firma" })}
          emoji="🏢"
          title="Meiner Firma"
          text="Z. B. deine GmbH oder UG."
        />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {data.applicantKind === "person" ? (
          <>
            <Field label="Vorname">
              <input className={inputClass} value={data.firstName} onChange={(e) => update({ firstName: e.target.value })} autoComplete="given-name" />
            </Field>
            <Field label="Nachname">
              <input className={inputClass} value={data.lastName} onChange={(e) => update({ lastName: e.target.value })} autoComplete="family-name" />
            </Field>
          </>
        ) : (
          <>
            <Field label="Firmenname">
              <input className={inputClass} value={data.companyName} onChange={(e) => update({ companyName: e.target.value })} autoComplete="organization" />
            </Field>
            <Field label="Rechtsform">
              <input className={inputClass} value={data.legalForm} onChange={(e) => update({ legalForm: e.target.value })} placeholder="z. B. GmbH" />
            </Field>
          </>
        )}

        <div className="sm:col-span-2">
          <Field label="Straße & Hausnummer">
            <input className={inputClass} value={data.street} onChange={(e) => update({ street: e.target.value })} autoComplete="street-address" />
          </Field>
        </div>
        <Field label="PLZ">
          <input className={inputClass} value={data.zip} onChange={(e) => update({ zip: e.target.value })} autoComplete="postal-code" />
        </Field>
        <Field label="Ort">
          <input className={inputClass} value={data.city} onChange={(e) => update({ city: e.target.value })} autoComplete="address-level2" />
        </Field>
        <Field label="Land">
          <select className={inputClass} value={data.country} onChange={(e) => update({ country: e.target.value })}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="E-Mail" hint="Hierhin schicken wir Updates zu deiner Anmeldung.">
          <input className={inputClass} type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} autoComplete="email" />
        </Field>
      </div>

      {!isEea(data.country) && (
        <div className="mt-6">
          <Callout tone="sun">
            🌍 Gut zu wissen: Wer außerhalb des Europäischen Wirtschaftsraums sitzt, braucht für die EU-Marke einen
            Vertreter in der EU. Darum kümmern wir uns gemeinsam mit dir.
          </Callout>
        </div>
      )}
    </div>
  );
}
