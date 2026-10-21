# BMA-Verwaltung – Supabase-Version

Diese Version nutzt Supabase (PostgreSQL + Realtime) statt Firebase. BMA-Einträge, Kategorien und Tarife liegen in einem gemeinsamen Datensatz, den alle Besucher sehen.

## Einrichtung
1. Erstelle ein Projekt unter https://supabase.com/.
2. Öffne SQL Editor und führe den vollständigen Inhalt von `supabase.sql` aus.
3. Öffne Project Settings → API und kopiere Project URL sowie den `anon`/publishable public key in `supabase-config.js`.
4. Lade `index.html`, `style.css`, `app.js`, `supabase-config.js` und `supabase.sql` gemeinsam auf GitHub Pages hoch.
5. Öffne die Seite mit Strg+F5. Der Status sollte „Mit Supabase verbunden“ anzeigen.

## Chef-Demo-Login
Benutzername: `FeuerwehrChef`
Passwort: `chef-FW`

Der Demo-Login bleibt im Website-Code. Er steuert nur die Oberfläche, ist keine echte Sicherheitsprüfung für die Datenbank. Die SQL-Regeln erlauben absichtlich öffentlichen Lese-/Schreibzugriff, damit das Demo ohne echte Konten funktioniert. Jeder, der die Datenbank-URL und den öffentlichen Schlüssel kennt, könnte Daten ändern oder löschen. Nicht für vertrauliche Produktivdaten verwenden.

Ohne Supabase-Konfiguration funktioniert die Seite mit lokalem Browser-Speicher, der NICHT zwischen Geräten synchronisiert wird.
