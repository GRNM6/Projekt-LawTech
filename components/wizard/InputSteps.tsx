"use client";

import { useRef, useState } from "react";
import { COUNTRIES, FUTURE_PLANS, isEea, OFFERINGS } from "@/lib/options";
import { filledMarkNames, primaryMarkName, type MarkType, type WizardData } from "@/lib/types";
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
    title: "Nur der Name",
    text: "Schützt den Namen – egal in welcher Schrift.",
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
    title: "Name mit Logo",
    text: "Schützt die Kombination, so wie sie aussieht.",
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
    title: "Nur ein Logo",
    text: "Schützt ein Zeichen ohne Text.",
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
      <StepHeader
        emoji="✏️"
        title="Wie soll deine Marke heißen?"
        subtitle="Am besten funktionieren Namen, die nicht einfach beschreiben, was du anbietest – und es auch nicht anpreisen."
      />

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
/* 2 · Was machst du?                                                   */
/* ------------------------------------------------------------------ */

export function StepWhat({ data, update }: { data: WizardData; update: Update }) {
  return (
    <div>
      <StepHeader
        emoji="💬"
        title={`Was steckt hinter ${
          data.markType !== "bild" && primaryMarkName(data) ? `„${primaryMarkName(data)}“` : "deiner Marke"
        }?`}
        subtitle="Tipp einfach alles an, was passt. Mehrfachauswahl ausdrücklich erwünscht."
      />

      <div className="flex flex-wrap gap-2.5">
        {OFFERINGS.map((o) => (
          <Chip
            key={o.id}
            selected={data.offerings.includes(o.id)}
            onClick={() => update({ offerings: toggle(data.offerings, o.id) })}
          >
            {o.emoji} {o.label}
          </Chip>
        ))}
      </div>

      <div className="mt-8">
        <Field
          label="Erklär's uns, als wären wir deine Oma 👵"
          hint="Ein paar Sätze reichen. Was bietest du an, für wen, und was macht es besonders?"
        >
          <textarea
            className={`${inputClass} min-h-32 resize-y`}
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="z. B. Wir bauen eine App, mit der Hundebesitzer in ihrer Nähe Gassi-Partner finden. Später wollen wir auch Leinen und Halsbänder verkaufen."
            maxLength={2000}
          />
        </Field>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Zeig uns mehr                                                    */
/* ------------------------------------------------------------------ */

export function StepMore({
  data,
  update,
  pitchFile,
  setPitchFile,
}: {
  data: WizardData;
  update: Update;
  pitchFile: File | null;
  setPitchFile: (f: File | null) => void;
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
    <div>
      <StepHeader
        emoji="🔍"
        title="Zeig uns, was du hast"
        subtitle="Je mehr wir wissen, desto besser passt dein Schutz. Beides ist freiwillig."
      />

      <div className="space-y-6">
        <Field label="🌐 Deine Website" hint="Wir lesen sie kurz durch, um dein Angebot zu verstehen.">
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
          <span className="mb-1.5 block text-sm font-semibold">📎 Pitch-Deck, Businessplan oder Flyer</span>
          {pitchFile ? (
            <div className="flex items-center justify-between rounded-2xl border-2 border-mint bg-mint-soft p-4">
              <span className="truncate font-medium">📄 {pitchFile.name}</span>
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
              className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-line bg-paper p-8 text-muted transition hover:border-violet"
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

        <Callout tone="violet">
          🔒 Deine Unterlagen nutzen wir nur, um dein Verzeichnis zu erstellen. Noch nichts davon fertig? Kein
          Problem – einfach weiter.
        </Callout>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · Zukunft                                                          */
/* ------------------------------------------------------------------ */

export function StepFuture({ data, update }: { data: WizardData; update: Update }) {
  return (
    <div>
      <StepHeader
        emoji="🔮"
        title="Träum mal ein bisschen"
        subtitle="Wo steht deine Marke in drei Jahren? Damit dein Schutz mitwachsen kann."
      />

      <div className="flex flex-wrap gap-2.5">
        {FUTURE_PLANS.map((o) => (
          <Chip
            key={o.id}
            selected={data.futurePlans.includes(o.id)}
            onClick={() => update({ futurePlans: toggle(data.futurePlans, o.id) })}
          >
            {o.emoji} {o.label}
          </Chip>
        ))}
      </div>

      <div className="mt-8">
        <Field label="Noch was im Kopf?" hint="Optional – jede verrückte Idee zählt.">
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            value={data.futureNote}
            onChange={(e) => update({ futureNote: e.target.value })}
            placeholder="z. B. Irgendwann eine eigene Hundefutter-Linie 🐶"
            maxLength={1000}
          />
        </Field>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Anmelder                                                         */
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
