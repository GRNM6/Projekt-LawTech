"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Infopunkt „Worauf soll ich achten?“ in Schritt 1 – zwei Ebenen:
 * 1. Aufklappfeld mit den wichtigsten Punkten
 * 2. Bildschirmfüllendes Infofeld mit allen Hinweisen zur Namenswahl
 */

interface Tip {
  title: string;
  paragraphs: string[];
  examples?: string[];
  /** Hervorgehobener Zusatz, z. B. „Wichtig: …“ */
  important?: string;
}

const ALL_TIPS: Tip[] = [
  {
    title: "Dein Name sollte dein Angebot nicht einfach nur beschreiben.",
    paragraphs: [
      "Begriffe, die lediglich beschreiben, was du anbietest, z. B. durch Bezeichnung der Art, der Beschaffenheit, der Menge, der Bestimmung, des Wertes, der geografischen Herkunft oder der Zeit der Herstellung der Ware oder der Erbringung der Dienstleistung, können in der Regel nicht als Marke geschützt werden.",
    ],
    examples: ["„Fitness Coaching“ für Fitnesskurse", "„SleepWell“ für Matratzen", "„Chiemsee“ für Klamotten vom Chiemsee"],
  },
  {
    title: "Dein Name sollte nicht nur aus einer gewöhnlichen Werbeaussage bestehen.",
    paragraphs: ["Das kann auch für Slogans gelten."],
    examples: ["„Beste Qualität“ für Möbel", "„Simply the Best“"],
  },
  {
    title: "Auch fremdsprachige Begriffe können beschreibend sein.",
    paragraphs: [
      "Ein Begriff wird nicht automatisch schutzfähig, nur weil er beispielsweise auf Englisch formuliert ist. Wenn die angesprochenen Kunden seine Bedeutung verstehen, kann er ebenfalls als beschreibend gelten.",
    ],
    examples: ["„Healthy Food“ für gesunde Lebensmittel"],
  },
  {
    title: "Dein Name sollte keine falschen Erwartungen wecken.",
    paragraphs: [
      "Bezeichnungen, die bei Kunden einen falschen Eindruck über wesentliche Eigenschaften deiner Produkte oder Dienstleistungen hervorrufen können, sind möglicherweise nicht eintragungsfähig.",
    ],
    examples: ["„100 % Seide“ für Kleidung aus Polyester"],
  },
  {
    title: "Bei staatlichen Symbolen und offiziellen Zeichen solltest du vorsichtig sein.",
    paragraphs: [
      "Die Verwendung von Staatswappen, Flaggen, amtlichen Prüfzeichen und bestimmten Symbolen internationaler Organisationen kann einer Markeneintragung entgegenstehen.",
    ],
    examples: ["Das Bundeswappen oder das offizielle UN-Emblem"],
  },
  {
    title: "Dein Name sollte möglichst keine diskriminierenden oder schwerwiegend anstößigen Inhalte enthalten.",
    paragraphs: [
      "Bezeichnungen, die gegen grundlegende gesellschaftliche Werte oder die öffentliche Ordnung verstoßen, können von der Eintragung ausgeschlossen sein.",
    ],
  },
  {
    title: "Dein Name sollte sich ausreichend von bereits bestehenden Marken unterscheiden.",
    paragraphs: [
      "Auch wenn dein Name grundsätzlich eintragbar ist, kann er ältere Marken- oder Unternehmensrechte verletzen. Bereits ähnliche Namen können problematisch sein, insbesondere bei ähnlichen Produkten oder Dienstleistungen.",
    ],
    important:
      "Das Markenamt prüft bei der Anmeldung grundsätzlich nicht, ob ältere Rechte anderer Unternehmen entgegenstehen. Deshalb ist eine Markenrecherche vor der Anmeldung empfehlenswert.",
  },
  {
    title: "Auch bei der Kombination deines Namens mit einem Logo solltest du auf die Schutzfähigkeit achten.",
    paragraphs: [
      "Grafische Elemente können unter Umständen dazu beitragen, dass eine Wort-Bild-Marke eingetragen werden kann. Daraus ergibt sich jedoch nicht automatisch ein eigenständiger Schutz für den enthaltenen Namen.",
    ],
  },
];

export function NameTips() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <details className="group mb-8 rounded-2xl border-2 border-line bg-paper px-4 py-3">
        <summary className="cursor-pointer font-semibold select-none group-open:mb-3">
          ℹ️ Worauf soll ich achten?
        </summary>

        <div className="space-y-3 text-sm leading-relaxed">
          <p className="font-semibold">Besonders zu beachten:</p>
          <p>
            Nicht jeder Name kann als Marke geschützt werden. Ob dein Wunschname im Markenregister eingetragen werden
            kann, hängt auch davon ab, welche Bedeutung der Name in Bezug auf die von dir angebotenen Waren und
            Dienstleistungen hat.
          </p>
          <p>Achte insbesondere auf diese zwei Punkte:</p>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="font-display font-bold text-violet">1.</span>
              <span>
                <span className="block font-semibold">
                  Dein Name sollte dein Angebot nicht einfach nur beschreiben oder anpreisen.
                </span>
                <span className="text-muted">
                  Begriffe, die lediglich beschreiben, was du anbietest, können in der Regel nicht als Marke geschützt
                  werden. Z. B. „Fitness Coaching“ für Fitnesskurse oder „SleepWell“ für Matratzen, da der Name als
                  Hinweis auf einen guten Schlaf und damit auf einen Vorteil des Produkts verstanden werden könnte.
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-display font-bold text-violet">2.</span>
              <span>
                <span className="block font-semibold">
                  Dein Name sollte nicht nur aus einer gewöhnlichen Werbeaussage bestehen.
                </span>
                <span className="text-muted">
                  Z. B. „Simply the Best“, da der Name als allgemeines Qualitätsversprechen verstanden werden könnte.
                </span>
              </span>
            </li>
          </ol>
          <div className="rounded-xl bg-mint-soft p-3">
            <span className="font-semibold">💡 Unser Tipp:</span> Besonders gute Voraussetzungen bieten häufig
            Fantasienamen, ungewöhnliche Wortkombinationen oder Begriffe ohne direkten Bezug zu deinem Angebot. Je
            eigenständiger dein Name ist, desto eher kann er als Marke wahrgenommen werden.
          </div>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="font-semibold text-violet underline underline-offset-2"
          >
            Mehr Hinweise zur Wahl deines Markennamens →
          </button>
        </div>
      </details>

      <NameTipsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}

function NameTipsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Seite im Hintergrund nicht mitscrollen
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        document.documentElement.style.overflow = "";
        onClose();
      }}
      aria-labelledby="name-tips-title"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cream p-0 text-ink backdrop:bg-ink/60"
    >
      <div className="flex h-full flex-col">
        <header className="sticky top-0 border-b-2 border-line bg-cream/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
            <h2 id="name-tips-title" className="font-display text-xl font-extrabold md:text-2xl">
              Dinge, die du bei der Wahl deines Markennamens beachten solltest
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Schließen"
              className="shrink-0 rounded-full border-2 border-line bg-paper px-4 py-2 text-sm font-semibold transition hover:border-violet"
            >
              ✕ Schließen
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-5 py-8">
            <ol className="space-y-6">
              {ALL_TIPS.map((tip, i) => (
                <li key={tip.title} className="rounded-2xl border-2 border-line bg-paper p-5">
                  <h3 className="flex gap-3 font-semibold">
                    <span className="font-display text-lg font-bold text-violet">{i + 1}.</span>
                    <span className="pt-0.5">{tip.title}</span>
                  </h3>
                  <div className="mt-2 space-y-2 pl-7 text-sm leading-relaxed text-muted">
                    {tip.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {tip.examples && (
                      <div>
                        <p className="font-semibold text-ink">{tip.examples.length > 1 ? "Beispiele:" : "Beispiel:"}</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          {tip.examples.map((e) => (
                            <li key={e}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tip.important && (
                      <p className="rounded-xl bg-sun-soft p-3 text-ink">
                        <span className="font-semibold">Wichtig:</span> {tip.important}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 border-t-2 border-dashed border-line pt-6 text-sm leading-relaxed text-muted">
              Ob dein Name tatsächlich als Marke geschützt werden kann, hängt immer vom Einzelfall und den angemeldeten
              Waren und Dienstleistungen ab. Auch ein grundsätzlich eintragbarer Name kann mit älteren Rechten
              kollidieren.
            </p>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-violet px-7 py-3 font-semibold text-white shadow-[0_5px_0_0_#4a30c4] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              >
                Verstanden, zurück zum Namen
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
