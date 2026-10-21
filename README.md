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
Der Chef-Login ist wieder als Demo direkt im Website-Code eingebaut; du musst kein Chef-Konto in Firebase anlegen.
- Benutzername: `FeuerwehrChef`
- Passwort: `chef-FW`

**Wichtiger Sicherheitshinweis:** Diese Zugangsdaten sind im öffentlichen Website-Code sichtbar und können nicht als sichere Zugriffskontrolle gelten. Außerdem erlauben die mitgelieferten Firestore-Regeln allen angemeldeten Besuchern Änderungen an den gemeinsamen Daten. Für eine öffentliche Website bitte auf echte Firebase-Authentifizierung mit sicheren serverseitigen Rollen und passenden Firestore-Regeln umstellen. Nutze die Demo nur für Tests oder eine private, nicht sensible Website.

## Hinweis zu vorhandenen lokalen Daten
Die alte Version speicherte Einträge nur im jeweiligen Browser. Diese Daten werden nicht automatisch hochgeladen. Vorhandene BMA-Einträge müssen einmal in der Firebase-Version neu eingetragen werden. Danach sehen alle Nutzer dieselben Einträge.
