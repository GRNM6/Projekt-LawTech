# Markenstart (Arbeitstitel)

Spielerischer Assistent für die Anmeldung einer **Unionsmarke bei der EUIPO** – ohne Juristendeutsch.
Nutzer erzählen von ihrem Projekt (Auswahl, eigene Worte, Website, Pitch-PDF); eine KI erstellt daraus
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
3. Client-ID, Client-Secret und API-Basis-URL in `.env.local` eintragen (siehe `.env.example`)
4. Den Validierungs-Endpunkt in `lib/euipo.ts` (`validateClassTerms`) laut OpenAPI-Spezifikation einsetzen

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `app/page.tsx` | Startseite |
| `app/anmelden/page.tsx` | Anmelde-Assistent |
| `components/wizard/` | Die einzelnen Schritte des Assistenten |
| `app/api/verzeichnis/route.ts` | KI-Erstellung des Waren- und Dienstleistungsverzeichnisses |
| `lib/euipo.ts` | Anbindung an die EUIPO-API |
| `lib/fees.ts` | EUIPO-Amtsgebühren |
| `lib/options.ts` | Auswahl-Chips, Länderliste |
| `lib/demo.ts` | Beispieldaten für den Demo-Modus |

## Noch offen

- Bezahlung und Einreichung bei der EUIPO
- Ähnlichkeitsrecherche
- Nutzerkonten und Speichern des Fortschritts
