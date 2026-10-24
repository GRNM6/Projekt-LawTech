# Projektstand

_Zuletzt aktualisiert: 24.10.2026_

## Laufende Arbeit: Schritte 1–6 optimieren
Branch `anmeldeprozess-optimieren` (noch nicht in `main` übernommen). Vorgehen: Schritt für Schritt
nach den Vorgaben von Geronimo, keine eigenmächtigen Umbauten.

- [x] **Schritt 1 „Marke“** – umgesetzt und lokal abgenommen (20.10.):
  - Überschrift „Wie soll deine Marke heißen?“, Unterzeile: gute Namen beschreiben das Angebot nicht
    und preisen es nicht an
  - Aufklappbare „Vor- und Nachteile“ unter Wort-, Wort-Bild- und Bildmarke
  - Statt eines Namens bis zu drei Optionen (`markNames`; Option 1 Pflicht, 2 und 3 optional).
    Später soll das System prüfen, welcher Name die besten Eintragungschancen hat (noch nicht gebaut)
  - Offene Rückfragen: Sollen alle drei Namen Pflicht sein? Andere Überschrift bei „Bildmarke“?
  - 24.10.: Kategorien heißen jetzt Wortmarke, Wort-/Bildmarke, Bildmarke; darunter umgangssprachlich, was geschützt wird
### Beschlossen am 24.10.: neue Schrittfolge (8 statt 7 Schritte)
1. **Marke** (fertig, s. o.)
2. **Kern** (neu): „Was muss auf jeden Fall geschützt sein?“ (Freitext) + aufklappbares Infofeld
   „Was schützt eine Marke?“: nur angegebene Waren/DL + ähnliche · nachträglich nicht erweiterbar,
   nur kürzbar · 10 Jahre, verlängerbar, alle 27 EU-Staaten · Benutzungspflicht spätestens 5 Jahre
   nach Eintragung
3. **Unterlagen**: Website + Pitch-Deck, beides freiwillig (bisher „Mehr Infos“)
4. **Angebot**: KI wertet Kern, Website, PDF aus und schlägt Chips aus dem Bereichskatalog vor
   (vorausgewählt); darunter „Weitere Bereiche“ + Freitext „in eigenen Worten“.
   Ohne Website/PDF nur anhand der Kernfrage; im Demo-Modus Schlagwortsuche
5. **Zukunft**
6. **Anmelder**
7. **Schutz**: drei Stufen – Muss-Schutz (aus Kernfrage, fest vorausgewählt) · Kerngeschäft ·
   Für später (mit Hinweis auf Benutzungspflicht)
8. **Fertig**

Bewusst verworfen: Frage nach Nachahmern/Konkurrenz (weckt falsches Bild – die Anmeldung wirkt nicht
gegen ältere Rechte; gehört zur späteren Ähnlichkeitsrecherche). Frage „Worum geht es dir vor allem?“
vorerst weggelassen.

### Umsetzung
- [x] Bereichskatalog `lib/bereiche.ts`: 61 Bereiche in 9 Gruppen, deckt alle 45 Klassen ab
      (von Geronimo abgenommen 24.10.; im Demo-Modus schon genutzt, als Chips noch nicht)
- [x] Schritt „Kern“ mit Infofeld (24.10., eingebaut nach „Marke“; Pflichtfeld ab 5 Zeichen; geht als
      wichtigste Angabe an die KI, erscheint in der Zusammenfassung; Demo: Schlagwortsuche im Katalog)
- [ ] Schrittfolge umstellen (Unterlagen vor Angebot)
- [ ] KI-Vorschläge für Chips (neue API-Route) + Demo-Schlagwortsuche
- [ ] Schritt „Schutz“ dreistufig
- [ ] Danach weiter nach Geronimos Vorgaben: Zukunft, Anmelder, Schutz

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
1. **Schritte 1–6 des Anmeldeprozesses optimieren** (läuft, siehe oben – neue Schrittfolge beschlossen)
2. Claude-API-Schlüssel hinterlegen, damit echte Verzeichnisse entstehen
3. Ähnlichkeitsrecherche über die EUIPO Trademark Search API
4. Online stellen (Vercel)
5. Fortschritt speichern / Nutzerkonten, Bezahlung (Stripe)
6. Rechtlich klären: Rechtsdienstleistungsgesetz (RDG)
