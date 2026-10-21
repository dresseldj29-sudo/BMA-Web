# BMA-Verwaltung – Manus-Integrationspaket

Dieses Paket übernimmt den deutschen BMA-Verwaltungsansatz und die dunkle Oberfläche aus dem bereitgestellten ZIP. Firebase-SDKs, Firebase-Konfiguration und Firestore-Regeln wurden nicht übernommen.

## Wichtige Grenze
Dies ist **noch keine fertig verbundene Manus-Live-Anwendung**. In dieser Chat-Umgebung stehen keine Manus-Projekt-IDs, OAuth-Konfiguration oder Manus-Datenbank-Endpunkte bereit. Daher ist die API absichtlich fail-closed (HTTP 503) und erfindet weder Anmeldung noch Speicherung. Die Oberfläche darf erst nach Verbindung der von Manus bereitgestellten serverseitigen Authentifizierung und Datenbank produktiv verwendet werden.

## Lokal starten
1. Node.js 20 oder neuer installieren.
2. `npm install` ausführen.
3. `npm start` ausführen.
4. `http://localhost:3000` öffnen. Die API zeigt bis zur Konfiguration bewusst eine deutsche Fehlermeldung.

## Vor Veröffentlichung erforderlich
- Manus-OAuth / Session-Middleware serverseitig anschließen; `/api/me`, `/api/logout` und `/auth/login` implementieren.
- Manus-Datenbank anbinden und versionierte Migrationen für Nutzer/Rollen, BMAs, Kategorien/Unterkategorien, Einstellungen und append-only Audit-Ereignisse ergänzen.
- Rollen serverseitig pro Operation prüfen; Owner einmalig über einen vertrauenswürdigen serverseitigen Bootstrap-Prozess setzen und dauerhaft schützen.
- Transaktionen, Fremdschlüssel, Kilometer-/Geldvalidierung in Integer-Cents, Bestätigungsdialoge und Echtzeit-/Polling-Synchronisierung implementieren.
- `manus-routes.json` mit den tatsächlich von Manus unterstützten Routenformaten abgleichen.
- Build, HTTP, Auth, Rechte, CRUD, Rollen, Audit und Synchronisierung in der Manus-Preview testen.

## Datenimport
Daten aus einer Firebase-Cloud werden nicht automatisch importiert. Eine Live-Firebase-Konfiguration oder Firebase-Tests werden nicht behauptet.
