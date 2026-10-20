"use client";

import { useState, type ReactNode } from "react";
import { BRAND } from "@/lib/brand";
import { euipoFeeLines, euipoFeeTotal, formatEuro } from "@/lib/fees";
import { countryName, isEea } from "@/lib/options";
import { filledMarkNames, type SpecResult, type WizardData } from "@/lib/types";
import { Callout, StepHeader } from "./ui";

export function StepSummary({
  data,
  spec,
  selected,
  onEdit,
}: {
  data: WizardData;
  spec: SpecResult;
  selected: number[];
  onEdit: (step: "name" | "who" | "spec") => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const classes = spec.classes.filter((c) => selected.includes(c.classNumber));
  const lines = euipoFeeLines(classes.length);
  const markNames = filledMarkNames(data);
  const applicant =
    data.applicantKind === "person"
      ? `${data.firstName} ${data.lastName}`
      : `${data.companyName}${data.legalForm ? ` ${data.legalForm}` : ""}`;

  if (submitted) {
    return (
      <div className="py-10 text-center">
        <Confetti />
        <div className="text-7xl">🎉</div>
        <h1 className="mt-4 font-display text-4xl font-extrabold">Stark gemacht!</h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-muted">
          Deine Anmeldung ist vorbereitet. Im nächsten Ausbauschritt geht es hier zur Bezahlung und Einreichung bei
          der EUIPO.
        </p>
      </div>
    );
  }

  return (
    <div>
      <StepHeader emoji="🎉" title="Fast geschafft!" subtitle="Einmal kurz drüberschauen, dann kann's losgehen." />

      <div className="space-y-4">
        <SummaryCard title="Deine Marke" onEdit={() => onEdit("name")}>
          <div className="flex items-center gap-3">
            {data.markType !== "wort" && data.logoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.logoDataUrl} alt="" className="h-12 w-12 object-contain" />
            )}
            {data.markType !== "bild" && (
              <span className="font-display text-2xl font-extrabold break-all">{markNames[0]}</span>
            )}
          </div>
          {data.markType !== "bild" && markNames.length > 1 && (
            <p className="mt-2 text-sm text-muted">
              Weitere Optionen: {markNames.slice(1).join(" · ")}
            </p>
          )}
        </SummaryCard>

        <SummaryCard title="Inhaber" onEdit={() => onEdit("who")}>
          <p className="font-medium">{applicant}</p>
          <p className="text-sm text-muted">
            {data.street}, {data.zip} {data.city}, {countryName(data.country)}
          </p>
        </SummaryCard>

        <SummaryCard title="Geschützt für" onEdit={() => onEdit("spec")}>
          <ul className="space-y-1">
            {classes.map((c) => (
              <li key={c.classNumber}>
                <span className="font-medium">{c.title}</span>{" "}
                <span className="text-sm text-muted">· Klasse {c.classNumber}</span>
              </li>
            ))}
          </ul>
        </SummaryCard>

        <SummaryCard title="Kosten">
          <dl className="space-y-1 text-sm">
            {lines.map((l) => (
              <div key={l.label} className="flex justify-between gap-4">
                <dt className="text-muted">{l.label}</dt>
                <dd>{formatEuro(l.amount)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t-2 border-dashed border-line pt-2 text-base font-bold">
              <dt>Amtsgebühr EUIPO</dt>
              <dd>{formatEuro(euipoFeeTotal(classes.length))}</dd>
            </div>
          </dl>
        </SummaryCard>
      </div>

      <div className="mt-6 space-y-3">
        <Callout tone="violet">
          🗣️ Wir melden auf Deutsch an und geben Englisch als zweite Sprache an – das verlangt die EUIPO so.
        </Callout>
        {!isEea(data.country) && (
          <Callout tone="sun">🌍 Da du außerhalb des EWR sitzt, organisieren wir einen Vertreter in der EU für dich.</Callout>
        )}
        <Callout tone="coral">
          🔎 Wichtig: Wir prüfen noch nicht, ob es schon ähnliche Marken gibt. Das kann zu Widersprüchen führen.
          Eine Ähnlichkeitsrecherche kommt bald als Extra dazu.
        </Callout>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-violet"
        />
        <span className="text-sm">
          Ich habe alles geprüft. Mir ist klar, dass {BRAND.name} keine Rechtsberatung ersetzt.
        </span>
      </label>

      <button
        type="button"
        disabled={!confirmed}
        onClick={() => setSubmitted(true)}
        className="mt-6 w-full rounded-full bg-coral px-6 py-4 text-lg font-bold text-white shadow-[0_6px_0_0_#c94a2f] transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        Marke jetzt anmelden 🚀
      </button>
    </div>
  );
}

function SummaryCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border-2 border-line bg-paper p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-widest text-muted uppercase">{title}</h2>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-sm font-semibold text-violet">
            Ändern
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

const CONFETTI_COLORS = ["#6c4cf5", "#ff6b4a", "#2fbf8f", "#ffc83d"];

function Confetti() {
  // Feste Verteilung statt Zufall, damit das Rendering stabil bleibt
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: ((i * 13) % 20) / 10,
    duration: 2.5 + ((i * 7) % 15) / 10,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));
  return (
    <div aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
