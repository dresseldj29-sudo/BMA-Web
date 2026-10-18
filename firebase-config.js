// Firebase-Webkonfiguration hier aus Firebase Console → Projekteinstellungen → Deine Apps eintragen.
// Diese Werte sind Projektkennungen, keine Admin-Schlüssel. Niemals Service-Account-Schlüssel im Browser verwenden.
export const firebaseConfig = {
  apiKey: "HIER_API_KEY_EINTRAGEN",
  authDomain: "HIER-PROJEKT.firebaseapp.com",
  projectId: "HIER-PROJEKT-ID",
  storageBucket: "HIER-PROJEKT.firebasestorage.app",
  messagingSenderId: "HIER_SENDER_ID",
  appId: "HIER_APP_ID",
  // E-Mail des Chefkontos aus Firebase Authentication (kein Passwort hier eintragen)
  adminEmail: "CHEF_EMAIL_HIER_EINTRAGEN"
};
