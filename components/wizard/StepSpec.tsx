"use client";

import { useEffect, useState } from "react";
import { euipoFeeTotal, formatEuro } from "@/lib/fees";
import type { SpecClass, SpecResult } from "@/lib/types";
import { Callout, StepHeader } from "./ui";

const LOADING_MESSAGES = [
  "Lese mir dein Projekt durch …",
  "Blättere durch deine Unterlagen …",
  "Sortiere alles in 45 Schubladen …",
  "Übersetze ins Juristische, damit du es nicht musst …",
  "Poliere die Formulierungen …",
];

export function StepSpec({
  spec,
  loading,
  error,
  selected,
  onToggle,
  onRetry,
}: {
  spec: SpecResult | null;
  loading: boolean;
  error: string | null;
  selected: number[];
  onToggle: (classNumber: number) => void;
  onRetry: () => void;
}) {
  if (loading) return <SpecLoading />;

  if (error || !spec) {
    return (
      <div>
        <StepHeader emoji="😵" title="Hoppla, da hat etwas nicht geklappt" subtitle={error ?? "Unbekannter Fehler."} />
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-violet px-6 py-3 font-semibold text-white"
        >
          Nochmal versuchen
        </button>
      </div>
    );
  }

  const core = spec.classes.filter((c) => c.core);
  const optional = spec.classes.filter((c) => !c.core);

  return (
    <div>
      <StepHeader emoji="🛡️" title="Dein Schutzschild ist fertig!" subtitle={spec.summary} />

      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        {spec.demo && (
          <span className="rounded-full bg-coral px-3 py-1 font-semibold text-white">Demo-Modus</span>
        )}
        {spec.euipoChecked && (
          <span className="rounded-full bg-mint-soft px-3 py-1">✓ Mit EUIPO-Datenbank abgeglichen</span>
        )}
        {spec.sourcesUsed.map((s) => (
          <span key={s} className="rounded-full bg-mint-soft px-3 py-1">
            ✓ {s} ausgewertet
          </span>
        ))}
      </div>

      {core.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-bold">Dein Kerngeschäft</h2>
          <div className="space-y-3">
            {core.map((c) => (
              <ClassCard key={c.classNumber} c={c} checked={selected.includes(c.classNumber)} onToggle={onToggle} />
            ))}
          </div>
        </section>
      )}

      {optional.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">Auch spannend für später</h2>
          <p className="mb-3 text-sm text-muted">
            Optional – lohnt sich, wenn du diese Pläne wirklich angehst. Nachträglich erweitern geht nämlich nicht.
          </p>
          <div className="space-y-3">
            {optional.map((c) => (
              <ClassCard key={c.classNumber} c={c} checked={selected.includes(c.classNumber)} onToggle={onToggle} />
            ))}
          </div>
        </section>
      )}

      {spec.hints.length > 0 && (
        <div className="mt-8">
          <Callout tone="sun">
            <p className="mb-1 font-semibold">💡 Gut zu wissen</p>
            <ul className="list-disc space-y-1 pl-5">
              {spec.hints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Callout>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-paper p-4">
        <span>
          <strong>{selected.length}</strong> {selected.length === 1 ? "Klasse" : "Klassen"} ausgewählt
        </span>
        <span className="font-display text-xl font-bold">
          {selected.length > 0 ? formatEuro(euipoFeeTotal(selected.length)) : "–"}
          <span className="ml-1 text-xs font-normal text-muted">Amtsgebühr</span>
        </span>
      </div>

      <button type="button" onClick={onRetry} className="mt-4 text-sm text-muted underline">
        🔄 Neu erstellen lassen
      </button>
    </div>
  );
}

function ClassCard({ c, checked, onToggle }: { c: SpecClass; checked: boolean; onToggle: (n: number) => void }) {
  const allHarmonised = c.termStatus !== undefined && c.terms.every((t) => c.termStatus?.[t] === "harmonised");
  return (
    <div
      className={`rounded-2xl border-2 bg-paper transition ${
        checked ? "border-violet shadow-[4px_4px_0_0_#6c4cf5]" : "border-line opacity-80"
      }`}
    >
      <label className="flex cursor-pointer items-start gap-4 p-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(c.classNumber)}
          className="mt-1 h-5 w-5 shrink-0 accent-violet"
        />
        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{c.title}</span>
            <span className="rounded-full bg-violet-soft px-2 py-0.5 text-xs font-medium">Klasse {c.classNumber}</span>
          </span>
          <span className="mt-1 block text-sm text-muted">{c.why}</span>
        </span>
      </label>
      <details className="border-t-2 border-dashed border-line px-4 py-2 text-sm">
        <summary className="cursor-pointer text-muted select-none">
          Für Profis: die offiziellen Begriffe ({c.terms.length})
          {allHarmonised && <span className="ml-2 font-medium text-mint">✓ EUIPO-geprüft</span>}
        </summary>
        {c.termStatus ? (
          <ul className="mt-2 space-y-1 pb-2">
            {c.terms.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span
                  title={c.termStatus?.[t] === "harmonised" ? "In der EUIPO-Datenbank" : "Wird individuell geprüft"}
                  className={c.termStatus?.[t] === "harmonised" ? "text-mint" : "text-sun"}
                >
                  {c.termStatus?.[t] === "harmonised" ? "✓" : "●"}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 pb-2 leading-relaxed">{c.terms.join("; ")}</p>
        )}
      </details>
    </div>
  );
}

function SpecLoading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % LOADING_MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="animate-float text-7xl">🤖</div>
      <h1 className="mt-6 font-display text-3xl font-extrabold">Einen Moment …</h1>
      <p key={i} className="animate-step-in mt-3 text-lg text-muted">
        {LOADING_MESSAGES[i]}
      </p>
    </div>
  );
}
