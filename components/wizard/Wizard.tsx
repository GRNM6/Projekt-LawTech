"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { emptyWizardData, type SpecResult, type WizardData } from "@/lib/types";
import { StepFuture, StepMore, StepName, StepWhat, StepWho } from "./InputSteps";
import { StepSpec } from "./StepSpec";
import { StepSummary } from "./StepSummary";
import { canContinue, specInputKey, STEPS, type StepId } from "./steps";

const NEXT_LABELS: Partial<Record<StepId, string>> = {
  name: "Klingt gut, weiter →",
  what: "Weiter →",
  more: "Weiter →",
  future: "Weiter →",
  who: "Schutz erstellen ✨",
  spec: "Passt so →",
};

export function Wizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<WizardData>(emptyWizardData);
  const [pitchFile, setPitchFile] = useState<File | null>(null);

  const [spec, setSpec] = useState<SpecResult | null>(null);
  const [specKey, setSpecKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const update = (patch: Partial<WizardData>) => setData((d) => ({ ...d, ...patch }));
  const goTo = (id: StepId) => {
    setStepIndex(STEPS.findIndex((s) => s.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function generateSpec() {
    const key = specInputKey(data, pitchFile);
    setLoading(true);
    setError(null);
    try {
      const body = new FormData();
      // Das Logo wird für das Verzeichnis nicht gebraucht
      body.append("data", JSON.stringify({ ...data, logoDataUrl: null }));
      if (pitchFile) body.append("pitch", pitchFile);

      const res = await fetch("/api/verzeichnis", { method: "POST", body });
      const json = (await res.json()) as SpecResult & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Das Verzeichnis konnte nicht erstellt werden.");

      setSpec(json);
      setSelected(json.classes.filter((c) => c.core).map((c) => c.classNumber));
      setSpecKey(key);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (!canContinue(step.id, data, selected.length > 0)) return;
    if (step.id === "who" && specInputKey(data, pitchFile) !== specKey) {
      void generateSpec();
    }
    goTo(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)].id);
  }

  function back() {
    if (stepIndex > 0) goTo(STEPS[stepIndex - 1].id);
  }

  function toggleClass(n: number) {
    setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n].sort((a, b) => a - b)));
  }

  const showNav = step.id !== "summary" && !(step.id === "spec" && (loading || error || !spec));
  const nextEnabled = canContinue(step.id, data, selected.length > 0);

  return (
    <div className="flex flex-1 flex-col">
      {/* Kopfzeile mit Fortschritt */}
      <header className="sticky top-0 z-10 border-b-2 border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 pt-4">
          <Link href="/" className="font-display text-lg font-bold">
            {BRAND.emoji} {BRAND.name}
          </Link>
          <span className="text-sm text-muted">
            Schritt {stepIndex + 1} von {STEPS.length}
          </span>
        </div>
        <ol className="mx-auto flex max-w-3xl gap-1.5 px-5 py-3" aria-label="Fortschritt">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex-1" title={s.label}>
              <div
                className={`h-2 rounded-full transition-colors duration-500 ${
                  i < stepIndex ? "bg-mint" : i === stepIndex ? "bg-violet" : "bg-line"
                }`}
              />
              <span
                className={`mt-1 hidden text-center text-xs sm:block ${
                  i === stepIndex ? "font-semibold text-ink" : "text-muted"
                }`}
              >
                {i < stepIndex ? "✓" : s.emoji} {s.label}
              </span>
            </li>
          ))}
        </ol>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
        <div key={step.id} className="animate-step-in">
          {step.id === "name" && <StepName data={data} update={update} />}
          {step.id === "what" && <StepWhat data={data} update={update} />}
          {step.id === "more" && (
            <StepMore data={data} update={update} pitchFile={pitchFile} setPitchFile={setPitchFile} />
          )}
          {step.id === "future" && <StepFuture data={data} update={update} />}
          {step.id === "who" && <StepWho data={data} update={update} />}
          {step.id === "spec" && (
            <StepSpec
              spec={spec}
              loading={loading}
              error={error}
              selected={selected}
              onToggle={toggleClass}
              onRetry={() => void generateSpec()}
            />
          )}
          {step.id === "summary" && spec && (
            <StepSummary data={data} spec={spec} selected={selected} onEdit={goTo} />
          )}
        </div>
      </main>

      {/* Navigation */}
      {stepIndex > 0 || showNav ? (
        <footer className="sticky bottom-0 border-t-2 border-line bg-cream/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-4">
            <button
              type="button"
              onClick={back}
              disabled={stepIndex === 0}
              className="rounded-full px-4 py-3 font-semibold text-muted transition hover:text-ink disabled:invisible"
            >
              ← Zurück
            </button>
            {showNav && (
              <button
                type="button"
                onClick={next}
                disabled={!nextEnabled}
                className="rounded-full bg-violet px-7 py-3 font-semibold text-white shadow-[0_5px_0_0_#4a30c4] transition enabled:hover:-translate-y-0.5 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step.id === "more" && !data.website.trim() && !pitchFile
                  ? "Überspringen →"
                  : NEXT_LABELS[step.id] ?? "Weiter →"}
              </button>
            )}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
