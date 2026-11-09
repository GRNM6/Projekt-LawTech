# Projektstand

_Zuletzt aktualisiert: 09.11.2026_

## Laufende Arbeit: Schritte 1–6 optimieren
Branch `anmeldeprozess-optimieren` (noch nicht in `main` übernommen). Vorgehen: Schritt für Schritt
nach den Vorgaben von Geronimo, keine eigenmächtigen Umbauten.

- [x] **Schritt 1 „Marke“** – umgesetzt und lokal abgenommen (20.10.):
  - Überschrift „Wie soll deine Marke heißen?“, Unterzeile: gute Namen beschreiben das Angebot nicht
    und preisen es nicht an
  - Aufklappbare „Vor- und Nachteile“ unter Wort-, Wort-Bild- und Bildmarke
  - Statt eines Namens bis zu drei Optionen (`markNames`; Option 1 Pflicht, 2 und 3 optional).
    Später soll das System prüfen, welcher Name die besten Eintragungschancen hat (noch nicht gebaut)
  - Entschieden 24.10.: Nur der erste Name ist Pflicht. Überschrift bleibt auch bei „Bildmarke“ gleich.
  - 24.10.: Kategorien heißen jetzt Wortmarke, Wort-/Bildmarke, Bildmarke; darunter umgangssprachlich, was geschützt wird
  - 26.10.: Unterzeile entfernt, stattdessen Infopunkt „Worauf soll ich achten?“ (`NameTips.tsx`) mit zwei
    Ebenen: Aufklappfeld (zwei Kernpunkte + Tipp) und per „Mehr Hinweise zur Wahl deines Markennamens“
    ein bildschirmfüllendes Infofeld mit allen 8 Hinweisen. Texte von Geronimo vorgegeben
### Aktuelle Schrittfolge (beschlossen 09.11., ersetzt die 8er-Folge vom 24.10.)
Marke → Kern → **Dein Schutzpaket** → Schutz → **Anmelder** → Fertig (6 Schritte)

Gedanke: wie in einer Markenberatung – erst der Kern, dann in *einem* Gespräch alles rund um den Kern,
heute und später. Jede Frage nur einmal. Anmelder bewusst hinter „Schutz“: Nutzer sieht Paket und
Kosten, bevor er Name und Adresse eingibt.

1. **Marke** – fertig (s. o.)
2. **Kern** – fertig: Überschrift „Welche Waren und Dienstleistungen sollen unbedingt erfasst werden?“,
   Infofeld „Was schützt eine EU-Marke eigentlich?“, Pflicht-Freitext, Knopf „✨ Passende Bereiche
   anzeigen“ → Nutzer tippt Kern-Bereiche an (`coreBereiche`, nicht vorausgewählt) = Muss-Schutz
3. **Dein Schutzpaket** (09.11., ersetzt „Unterlagen“, „Angebot“ und „Zukunft“):
   - Oben Rückblick „🎯 Dein Kern – fest dabei“
   - Vorschläge laden automatisch beim Verlassen von „Kern“ (Route `vorschlaege`, Modus `paket`), in
     zwei Spalten: 💼 „Bietest du das heute schon an?“ (`offerings`) · 🔮 „Kommt das in den nächsten
     Jahren?“ (`futureBereiche`, mit Hinweis auf Benutzungspflicht). Nichts vorausgewählt.
   - Darunter freiwillig „📎 Hast du eine Website oder ein Pitch-Deck?“ + „✨ Auswerten“ → Vorschläge
     werden genauer, Treffer markiert „· aus deinen Unterlagen“
   - „Etwas fehlt?“: Umschalter „Hinzufügen zu: 💼 Heute / 🔮 Später“ + Gesamtkatalog + *ein* Freitext
     „Sonst noch etwas?“ (`description`)
   - Alte feste Zukunfts-Chipliste (`FUTURE_PLANS`, `futurePlans`, `futureNote`) entfernt
4. **Schutz** – dreistufig: 🎯 Muss-Schutz (fest) · 💼 Kerngeschäft (vorausgewählt) · 🔮 Für später
   (freiwillig). Verzeichnis entsteht jetzt beim Verlassen von „Schutzpaket“
5. **Anmelder** – unverändert, nur verschoben; Land fließt nicht mehr ins Verzeichnis ein
6. **Fertig**

Bewusst verworfen: Frage nach Nachahmern/Konkurrenz (weckt falsches Bild – die Anmeldung wirkt nicht
gegen ältere Rechte; gehört zur späteren Ähnlichkeitsrecherche). Frage „Worum geht es dir vor allem?“
vorerst weggelassen.

### Technik
- Bereichskatalog `lib/bereiche.ts`: 61 Bereiche in 9 Gruppen, deckt alle 45 Klassen ab
- Route `app/api/vorschlaege`: Modus `kern` (nur Kerntext) und `paket` (heute / später / aus
  Unterlagen); Demo: Stichwortsuche + feste Begleitbereiche (`DEMO_NACHBARN`)
- Route `app/api/verzeichnis`: `SpecClass.tier` = muss | kern | spaeter
- Gemeinsame KI-Bausteine in `lib/quellen.ts`

### Als Nächstes
- [ ] Neuen Ablauf lokal testen (`npm run build`, durchklicken) und Feedback von Geronimo
- [ ] Danach: Schritte „Schutz“ und „Anmelder“ nach Geronimos Vorgaben

### Noch nicht lokal getestet (Stand 09.11.)
Alles ab Schritt 2 (Bereichs-Vorschläge), das neue „Schutzpaket“, „Schutz“ und die neue Reihenfolge
wurden in der Cloud nur per Demo-Test und TypeScript geprüft, kein vollständiger Build
(npm-Verzeichnis dort nicht erreichbar). Vor dem Weitermachen einmal lokal `npm run build` laufen
lassen und durchklicken.

## Hinweis zu Git auf Geronimos Mac
Im aktuellen Netzwerk ist GitHub über SSH-Port 22 gesperrt („Connection refused“).
Änderungen holen über Port 443 (Server vorher mit Strg + C stoppen):

```bash
git pull ssh://git@ssh.github.com:443/GRNM6/projekt-lawtech.git anmeldeprozess-optimieren && npm run dev
```

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
1. **Schritte 1–6 des Anmeldeprozesses optimieren** (läuft, siehe oben – Schrittfolge am 09.11. auf 6 Schritte verdichtet)
2. Claude-API-Schlüssel hinterlegen, damit echte Verzeichnisse entstehen
3. Ähnlichkeitsrecherche über die EUIPO Trademark Search API
4. Online stellen (Vercel)
5. Fortschritt speichern / Nutzerkonten, Bezahlung (Stripe)
6. Rechtlich klären: Rechtsdienstleistungsgesetz (RDG)
