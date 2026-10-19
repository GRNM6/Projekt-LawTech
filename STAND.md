# Projektstand

_Zuletzt aktualisiert: 19.10.2026_

## Fertig
- Spielerischer Anmelde-Assistent für EU-Marken (EUIPO) unter `/anmelden`, 7 Schritte:
  Marke → Projekt → Mehr Infos → Zukunft → Anmelder → Schutz → Fertig
- KI-Erstellung des Waren- und Dienstleistungsverzeichnisses (`app/api/verzeichnis/route.ts`),
  läuft ohne `ANTHROPIC_API_KEY` im Demo-Modus mit Beispieldaten
- EUIPO Goods-and-Services-API (Sandbox) angebunden und getestet: Begriffe werden gegen die
  harmonisierte Datenbank geprüft, nicht harmonisierte durch EUIPO-Vorschläge ersetzt (`lib/euipo.ts`)
- Live-Berechnung der EUIPO-Amtsgebühren (`lib/fees.ts`)

## Leitlinien für das Produkt
- Userflow einfach, unjuristisch und spielerisch halten
- Nutzer formuliert keine Fachbegriffe selbst – das Verzeichnis entsteht durch KI aus seinen Angaben
- Fokus vorerst nur auf EUIPO-Unionsmarken

## Nächste Schritte
1. **Schritte 1–6 des Anmeldeprozesses optimieren** (als Nächstes geplant)
2. Claude-API-Schlüssel hinterlegen, damit echte Verzeichnisse entstehen
3. Ähnlichkeitsrecherche über die EUIPO Trademark Search API
4. Online stellen (Vercel)
5. Fortschritt speichern / Nutzerkonten, Bezahlung (Stripe)
6. Rechtlich klären: Rechtsdienstleistungsgesetz (RDG)
