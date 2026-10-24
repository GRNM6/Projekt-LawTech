# Markenstart (Arbeitstitel)

Spielerischer Assistent für die Anmeldung einer **Unionsmarke bei der EUIPO** – ohne Juristendeutsch.
Nutzer erzählen von ihrem Projekt (Kernangabe, Website, Pitch-PDF, vorgeschlagene Bereiche, eigene Worte); eine KI erstellt daraus
das Waren- und Dienstleistungsverzeichnis.

## Lokal starten

```bash
npm install
npm run dev
```

Dann im Browser http://localhost:3000 öffnen.

## KI aktivieren

Ohne Schlüssel läuft der Assistent im **Demo-Modus** mit Beispieldaten.
Für echte Verzeichnisse:

1. `.env.example` zu `.env.local` kopieren
2. Einen API-Schlüssel von https://console.anthropic.com eintragen
3. `npm run dev` neu starten

## EUIPO-Prüfung aktivieren

Die von der KI vorgeschlagenen Begriffe können gegen die harmonisierte Datenbank der EUIPO
geprüft werden (API-Produkt „Goods and Services“).

1. Auf https://dev.euipo.europa.eu mit dem EUIPO-Konto anmelden
2. Eine App registrieren und das Produkt **Goods and Services** abonnieren (zuerst in der Sandbox)
3. Client-ID und Client-Secret in `.env.local` eintragen (siehe `.env.example`)
4. `npm run dev` neu starten

Nicht harmonisierte Begriffe werden automatisch durch passende Vorschläge der EUIPO ersetzt.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `app/page.tsx` | Startseite |
| `app/anmelden/page.tsx` | Anmelde-Assistent |
| `components/wizard/` | Die einzelnen Schritte des Assistenten |
| `app/api/vorschlaege/route.ts` | KI-Vorschläge für passende Bereiche (Chips) im Schritt „Angebot“ |
| `app/api/verzeichnis/route.ts` | KI-Erstellung des Waren- und Dienstleistungsverzeichnisses |
| `lib/quellen.ts` | Gemeinsame Bausteine der KI-Routen (Website auslesen, PDF, Claude-Aufruf) |
| `lib/bereiche.ts` | Katalog der auswählbaren Bereiche – deckt alle 45 Klassen ab |
| `lib/euipo.ts` | Anbindung an die EUIPO-API |
| `lib/fees.ts` | EUIPO-Amtsgebühren |
| `lib/options.ts` | Zukunftspläne, Länderliste |
| `lib/demo.ts` | Beispieldaten für den Demo-Modus |

## Noch offen

- Bezahlung und Einreichung bei der EUIPO
- Ähnlichkeitsrecherche
- Nutzerkonten und Speichern des Fortschritts
