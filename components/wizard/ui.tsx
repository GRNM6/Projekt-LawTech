"use client";

import type { ReactNode } from "react";

export function StepHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sun-soft text-3xl">
        {emoji}
      </div>
      <h1 className="font-display text-3xl leading-tight font-extrabold tracking-tight md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-muted">{subtitle}</p>}
    </div>
  );
}

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border-2 px-4 py-2 text-left text-sm font-medium transition ${
        selected
          ? "animate-pop border-violet bg-violet text-white shadow-[0_3px_0_0_#4a30c4]"
          : "border-line bg-paper hover:border-violet hover:-translate-y-0.5"
      }`}
    >
      {children}
    </button>
  );
}

export function ChoiceCard({
  selected,
  onClick,
  emoji,
  title,
  text,
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col rounded-2xl border-2 p-4 text-left transition ${
        selected
          ? "border-violet bg-violet-soft shadow-[4px_4px_0_0_#6c4cf5]"
          : "border-line bg-paper hover:border-violet"
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="mt-2 font-semibold">{title}</span>
      <span className="text-sm text-muted">{text}</span>
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border-2 border-line bg-paper px-4 py-3 text-base outline-none transition placeholder:text-muted/60 focus:border-violet";

export function Callout({ tone = "sun", children }: { tone?: "sun" | "mint" | "coral" | "violet"; children: ReactNode }) {
  const tones = {
    sun: "bg-sun-soft",
    mint: "bg-mint-soft",
    coral: "bg-coral-soft",
    violet: "bg-violet-soft",
  } as const;
  return <div className={`rounded-2xl p-4 text-sm ${tones[tone]}`}>{children}</div>;
}
