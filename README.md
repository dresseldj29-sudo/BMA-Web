# BMA-Verwaltung mit Firebase – gemeinsame Daten für alle Nutzer

## Was synchronisiert wird?
- Alle BMA-Einträge und Löschungen
- Unterkategorien, die der Chef anlegt oder löscht
- Grundkosten und Kilometerpreis
- Gesamtsumme und Summe je Unterkategorie (werden aus den gemeinsamen Daten berechnet)
- Änderungen erscheinen bei anderen geöffneten Browsern automatisch in Echtzeit.

## Firebase einrichten
1. Öffne https://console.firebase.google.com/ und erstelle ein Firebase-Projekt.
2. Unter **Projektübersicht → App hinzufügen → Web** eine Web-App registrieren.
3. Kopiere die Firebase-Konfiguration in `firebase-config.js` und ersetze alle `HIER_...` Platzhalter. Die Firebase-Webkonfiguration darf im Frontend stehen; niemals einen Service-Account-Schlüssel hochladen.
4. In Firebase unter **Build → Authentication → Sign-in method** die **Anonyme** Anmeldung aktivieren.
5. Unter **Build → Firestore Database** eine Datenbank erstellen.
6. In Firestore → **Regeln** den Inhalt aus `firestore.rules` einfügen und veröffentlichen.
7. Lade alle Dateien dieses Ordners ins GitHub-Repository hoch. Wichtig: `index.html`, `app.js`, `firebase-config.js`, `firestore.rules` und `style.css` müssen mit dabei sein.
8. Öffne die GitHub-Pages-Seite über HTTPS. Die erste Verbindung legt das gemeinsame Dokument an.

## Chef-Einstellungen
Kein Demo-Zugang ist im Code hinterlegt. Für den Chef-Login:
1. Firebase Console → **Authentication → Sign-in method** → **E-Mail/Passwort** aktivieren.
2. Unter **Authentication → Users** einen Nutzer mit Chef-E-Mail und Passwort erstellen.
3. In `firebase-config.js` `adminEmail` exakt auf diese E-Mail setzen.
4. Die Firebase-Webkonfiguration vollständig ausfüllen.

**Wichtiger Sicherheitshinweis:** `adminEmail` ist nur eine zusätzliche Prüfung im Frontend und allein keine sichere Berechtigungskontrolle. Die mitgelieferten Firestore-Regeln erlauben jedem angemeldeten Besucher das Lesen und Ändern der gemeinsamen BMA-Daten. Für produktiven Einsatz müssen die Datenstruktur und Firestore-Regeln so getrennt werden, dass normale Nutzer nur BMA-Einträge ändern dürfen und ausschließlich die verifizierte Chef-Rolle Tarife/Kategorien ändern darf. Nutze die aktuellen Regeln nur für Testdaten.

## Hinweis zu vorhandenen lokalen Daten
Die alte Version speicherte Einträge nur im jeweiligen Browser. Diese Daten werden nicht automatisch hochgeladen. Vorhandene BMA-Einträge müssen einmal in der Firebase-Version neu eingetragen werden. Danach sehen alle Nutzer dieselben Einträge.
