/**
 * Amtsgebühren der EUIPO für eine Unionsmarke (Online-Anmeldung, Individualmarke).
 * Quelle: https://www.euipo.europa.eu/en/trade-marks/before-applying/fees-payments
 * Stand: Oktober 2026 – vor dem Livegang erneut prüfen.
 */
export const EUIPO_FEES = {
  firstClass: 850,
  secondClass: 50,
  furtherClass: 150,
} as const;

export interface FeeLine {
  label: string;
  amount: number;
}

export function euipoFeeLines(classCount: number): FeeLine[] {
  if (classCount <= 0) return [];
  const lines: FeeLine[] = [
    { label: "Grundgebühr inkl. 1. Klasse", amount: EUIPO_FEES.firstClass },
  ];
  if (classCount >= 2) {
    lines.push({ label: "2. Klasse", amount: EUIPO_FEES.secondClass });
  }
  if (classCount >= 3) {
    const extra = classCount - 2;
    lines.push({
      label: extra === 1 ? "3. Klasse" : `3. bis ${classCount}. Klasse (${extra} × ${EUIPO_FEES.furtherClass} €)`,
      amount: extra * EUIPO_FEES.furtherClass,
    });
  }
  return lines;
}

export function euipoFeeTotal(classCount: number): number {
  return euipoFeeLines(classCount).reduce((sum, line) => sum + line.amount, 0);
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
