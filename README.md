# BMA-Verwaltung – Feuerwehr

Eine kleine deutschsprachige Website zum Erfassen von Brandmeldeanlagen (BMA), Einsatzorten und gefahrenen Kilometern. Die Kosten werden automatisch berechnet.

## Funktionen
- BMA mit Name, Ort/Adresse, Kilometerzahl und Notiz erfassen
- Unterkategorien wie Krankenhaus, Wohngebäude, Gewerbe und Sonstiges
- Chef kann eigene Unterkategorien hinzufügen und löschen; Kategorien gelten für alle Einträge in diesem Browser
- Gesamtsumme aller gespeicherten Einträge am Ende der Liste
- Suche und Löschen von Einträgen
- Gesamtkosten und Anzahl in der Übersicht
- Admin-Einstellungen für Grundkosten pro BMA und Preis pro Kilometer
- Speicherung im Browser über `localStorage`
- Responsive Design für PC und Smartphone

## Demo-Zugang
- Benutzername: `FeuerwehrChef`
- Passwort: `chef-FW`

Standardmäßig sind die Grundkosten `0 $` und der Kilometerpreis `1.000 $`.

## Kostenformel
**Gesamtkosten = Grundkosten pro BMA + (Kilometer × Preis pro Kilometer)**

Beispiel: Grundkosten 0 $, 10 km, 1.000 $/km = **10.000 $**.

## Auf GitHub veröffentlichen
1. Erstelle auf GitHub ein neues Repository, zum Beispiel `bma-verwaltung`.
2. Lade `index.html`, `style.css`, `app.js` und `README.md` in das Repository hoch.
3. Öffne **Settings → Pages**.
4. Wähle **Deploy from a branch**, danach `main` und `/ (root)`, und speichere.
5. Nach dem Deployment zeigt GitHub Pages die öffentliche Website-Adresse an.

## Wichtige Hinweise
- Die Website ist eine statische Demo. Einträge und Tarife werden nur im Browser gespeichert, in dem sie eingegeben wurden. Sie werden nicht automatisch zwischen Nutzern synchronisiert.
- Die Anmeldedaten stehen im JavaScript und sind deshalb **keine sichere Zugriffskontrolle**. Jeder mit technischem Zugriff auf die Website kann sie aus dem Quelltext lesen oder die Prüfung umgehen.
- Für einen echten, gemeinsam genutzten Server mit geschütztem Adminbereich brauchst du ein Backend mit Datenbank und serverseitiger Anmeldung. Ändere das Demo-Passwort nicht in der Erwartung, dass dies die Frontend-Sicherheit herstellt.
- Die Kostenberechnung ist eine nachvollziehbare mathematische Berechnung, keine echte KI. Eine echte KI-Funktion benötigt einen KI-Dienst und einen geschützten Backend-Endpunkt; API-Schlüssel dürfen nicht in GitHub Pages oder Browser-JavaScript eingebaut werden.
