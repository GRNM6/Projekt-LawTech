import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { EUIPO_FEES, formatEuro } from "@/lib/fees";

const STEPS = [
  { emoji: "✏️", title: "Name rein", text: "Verrate uns, wie deine Marke heißt – mit oder ohne Logo." },
  { emoji: "💬", title: "Erzähl drauflos", text: "Was machst du, was hast du vor? Website oder Pitch-Deck reichen völlig." },
  { emoji: "✨", title: "KI sortiert", text: "Wir übersetzen dein Projekt in die offiziellen Begriffe der EUIPO." },
  { emoji: "🛡️", title: "Geschützt", text: "Kurz prüfen, abschicken – deine Marke gilt in allen 27 EU-Ländern." },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <span className="font-display text-xl font-bold">
          {BRAND.emoji} {BRAND.name}
        </span>
        <Link
          href="/anmelden"
          className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold transition hover:bg-ink hover:text-cream"
        >
          Loslegen
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5">
        <section className="grid items-center gap-12 py-10 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sun-soft px-3 py-1 text-sm font-medium">
              🇪🇺 EU-Marke · ohne Juristendeutsch
            </p>
            <h1 className="font-display text-5xl leading-[1.05] font-extrabold tracking-tight md:text-7xl">
              Deine Idee verdient einen{" "}
              <span className="relative inline-block text-violet">
                Namen
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  className="absolute -bottom-2 left-0 w-full text-coral"
                  preserveAspectRatio="none"
                >
                  <path d="M2 9 C 50 2, 150 2, 198 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              , der nur dir gehört.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Erzähl uns von deinem Projekt, als würdest du es Freunden erklären. Wir kümmern uns um
              Nizza-Klassen, Fachbegriffe und Formulare – du bekommst eine fertige Anmeldung für die EUIPO.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/anmelden"
                className="rounded-full bg-violet px-7 py-4 text-lg font-semibold text-white shadow-[0_6px_0_0_#4a30c4] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              >
                Marke schützen →
              </Link>
              <span className="text-sm text-muted">Dauert ca. 5 Minuten</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="animate-float rounded-3xl border-2 border-ink bg-paper p-6 shadow-[8px_8px_0_0_#1d1b2f]">
              <p className="text-xs font-semibold tracking-widest text-muted uppercase">Unionsmarke</p>
              <p className="mt-2 font-display text-4xl font-extrabold">DEINE MARKE</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-violet-soft px-3 py-1 text-sm">📱 Apps</span>
                <span className="rounded-full bg-coral-soft px-3 py-1 text-sm">👕 Merch</span>
                <span className="rounded-full bg-mint-soft px-3 py-1 text-sm">🎓 Kurse</span>
              </div>
              <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-line pt-4 text-sm">
                <span className="text-muted">Geschützt in</span>
                <span className="font-semibold">27 Ländern 🇪🇺</span>
              </div>
            </div>
            <div className="absolute -top-5 -right-3 rotate-12 rounded-full bg-sun px-4 py-2 text-sm font-bold shadow">
              ab {formatEuro(EUIPO_FEES.firstClass)}*
            </div>
          </div>
        </section>

        <section className="pb-20">
          <h2 className="font-display text-3xl font-bold">So einfach geht&apos;s</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border-2 border-line bg-paper p-5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="font-display text-sm font-bold text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-xs text-muted">
            * Amtsgebühr der EUIPO für eine Klasse bei Online-Anmeldung. Weitere Klassen kosten extra – du siehst
            den genauen Betrag, bevor du etwas abschickst.
          </p>
        </section>
      </main>
    </div>
  );
}
