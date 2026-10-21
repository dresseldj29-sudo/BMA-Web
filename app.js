import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const DEFAULTS = { baseCost: 0, kmCost: 1000 };
// Demo-Chef-Zugang: steht absichtlich im Website-Code und ist NICHT sicher für öffentliche/professionelle Nutzung.
const CHEF_USERNAME = "FeuerwehrChef";
const CHEF_PASSWORD = "chef-FW";
const DEFAULT_CATEGORIES = ["Krankenhaus", "Wohngebäude", "Gewerbe", "Öffentliche Einrichtung", "Sonstiges"];
const $ = id => document.getElementById(id);
let settings = {...DEFAULTS};
let records = [];
let categories = [...DEFAULT_CATEGORIES];
let isLoggedIn = false;
let db, auth, sharedRef, firebaseReady = false, applyingRemote = false, saveQueue = Promise.resolve(), currentUser = null;

function money(value) { return new Intl.NumberFormat("de-DE", {maximumFractionDigits:2}).format(value) + " $"; }
function calc(record) { return Number(settings.baseCost || 0) + Number(record.km || 0) * Number(settings.kmCost || 0); }
function toast(message) { const el = $("toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 3000); }
function setConnection(text) { const badge = document.querySelector(".hero-badge"); if (badge) badge.textContent = "● " + text; }

async function saveShared() {
  if (!firebaseReady || applyingRemote) return;
  const payload = { settings, categories, records, updatedAt: new Date().toISOString() };
  // Serialize writes so fast edits do not overtake each other.
  saveQueue = saveQueue.then(() => set(sharedRef, payload)).catch(err => {
    console.error("Firebase save failed", err);
    toast("Speichern fehlgeschlagen. Prüfe Firebase-Konfiguration und Firestore-Regeln.");
  });
  await saveQueue;
}
function applyShared(data) {
  applyingRemote = true;
  settings = data?.settings && Number.isFinite(Number(data.settings.kmCost)) ? data.settings : {...DEFAULTS};
  categories = Array.isArray(data?.categories) && data.categories.length ? data.categories : [...DEFAULT_CATEGORIES];
  records = Array.isArray(data?.records) ? data.records : [];
  renderCategories(); render();
  applyingRemote = false;
}

async function startFirebase() {
  const configured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("HIER_") && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("HIER-") && firebaseConfig.databaseURL;
  if (!configured) {
    setConnection("Firebase-Konfiguration fehlt");
    console.warn("Bitte firebase-config.js mit den Web-App-Daten aus Firebase ausfüllen.");
    return;
  }
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app, firebaseConfig.databaseURL);
    await signInAnonymously(auth);
    onAuthStateChanged(auth, user => { currentUser = user; });
    sharedRef = ref(db, "bmaShared/main");
    onValue(sharedRef, snapshot => {
      firebaseReady = true;
      setConnection("Mit Firebase verbunden");
      if (snapshot.exists()) applyShared(snapshot.val());
      else saveShared();
    }, err => {
      firebaseReady = false;
      console.error("Realtime Database listener failed", err);
      setConnection("Firebase-Zugriff verweigert");
      toast("Firebase-Zugriff verweigert. Prüfe Realtime Database-Regeln und anonyme Anmeldung.");
    });
  } catch (err) {
    firebaseReady = false;
    console.error("Firebase startup failed", err);
    setConnection("Verbindung fehlgeschlagen");
    toast("Firebase konnte nicht starten. Prüfe firebase-config.js und anonyme Anmeldung.");
  }
}

function renderCategories() {
  const select = $("category"); const current = select.value; select.innerHTML = "";
  categories.forEach(name => { const option = document.createElement("option"); option.value = name; option.textContent = name; select.append(option); });
  if (categories.includes(current)) select.value = current;
  const list = $("categoryList"); list.innerHTML = "";
  categories.forEach(name => {
    const chip = document.createElement("span"); chip.className = "category-chip";
    const label = document.createElement("span"); label.textContent = name;
    const del = document.createElement("button"); del.type = "button"; del.textContent = "Löschen"; del.title = "Kategorie löschen";
    del.addEventListener("click", async () => {
      if (categories.length <= 1) return toast("Mindestens eine Kategorie muss vorhanden sein.");
      if (!confirm(`Kategorie „${name}“ löschen? Bestehende Einträge werden auf die erste verbleibende Kategorie gesetzt.`)) return;
      categories = categories.filter(c => c !== name);
      records.forEach(r => { if (r.category === name) r.category = categories[0]; });
      renderCategories(); render(); await saveShared(); toast("Kategorie für alle Nutzer gelöscht.");
    });
    chip.append(label, del); list.append(chip);
  });
}
function render() {
  const query = $("search").value.trim().toLocaleLowerCase("de");
  const filtered = records.filter(r => [r.name, r.location, r.note, r.category].join(" ").toLocaleLowerCase("de").includes(query));
  const total = records.reduce((sum, r) => sum + calc(r), 0);
  $("statCount").textContent = records.length; $("statCosts").textContent = money(total); $("listTotal").textContent = money(total);
  const totalsHost = $("categoryTotals"); totalsHost.innerHTML = "";
  categories.forEach(categoryName => {
    const categoryRecords = records.filter(r => (r.category || "Sonstiges") === categoryName);
    const tile = document.createElement("article"); tile.className = "category-total-card";
    const name = document.createElement("span"); name.className = "category-total-name"; name.textContent = categoryName;
    const amount = document.createElement("strong"); amount.textContent = money(categoryRecords.reduce((sum, r) => sum + calc(r), 0));
    const count = document.createElement("small"); count.textContent = `${categoryRecords.length} ${categoryRecords.length === 1 ? "Eintrag" : "Einträge"}`;
    tile.append(name, amount, count); totalsHost.append(tile);
  });
  $("statRate").textContent = money(Number(settings.kmCost || 0));
  $("empty").classList.toggle("hidden", filtered.length > 0); $("bmaList").innerHTML = "";
  filtered.forEach(r => {
    const card = document.createElement("article"); card.className = "bma-card";
    const info = document.createElement("div"); const title = document.createElement("div"); title.className = "bma-title"; title.textContent = r.name;
    const meta = document.createElement("div"); meta.className = "bma-meta";
    const category = document.createElement("span"); category.textContent = "▦ " + (r.category || "Sonstiges");
    const place = document.createElement("span"); place.textContent = "📍 " + r.location;
    const distance = document.createElement("span"); distance.textContent = "↗ " + r.km + " km";
    meta.append(category, place, distance); info.append(title, meta);
    if (r.note) { const note = document.createElement("div"); note.className = "bma-note"; note.textContent = "Notiz: " + r.note; info.append(note); }
    const cost = document.createElement("div"); cost.className = "cost"; const amount = document.createElement("strong"); amount.textContent = money(calc(r));
    const detail = document.createElement("small"); detail.textContent = `${money(settings.baseCost)} Grundkosten + ${r.km} km × ${money(settings.kmCost)}`;
    const del = document.createElement("button"); del.className = "delete"; del.textContent = "Eintrag löschen";
    del.addEventListener("click", async () => { if (confirm(`Eintrag „${r.name}“ wirklich für alle Nutzer löschen?`)) { records = records.filter(x => x.id !== r.id); render(); await saveShared(); toast("Eintrag wurde für alle Nutzer gelöscht."); } });
    cost.append(amount, detail, del); card.append(info, cost); $("bmaList").append(card);
  });
}
function openSettings() {
  $("settingsModal").classList.remove("hidden"); $("loginView").classList.remove("hidden"); $("configView").classList.add("hidden");
  $("loginError").classList.add("hidden"); $("username").value = ""; $("password").value = "";
  requestAnimationFrame(() => $("username").focus());
}
function closeSettings() { $("settingsModal").classList.add("hidden"); isLoggedIn = false; }

$("bmaForm").addEventListener("submit", async e => {
  e.preventDefault();
  if (!firebaseReady) return toast("Noch nicht mit Firebase verbunden. Bitte Konfiguration prüfen.");
  const km = Number($("km").value); if (!Number.isFinite(km) || km < 0) return toast("Bitte gültige Kilometer eingeben.");
  records.unshift({id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name: $("name").value.trim(), category: $("category").value, location: $("location").value.trim(), km, note: $("note").value.trim(), createdAt: new Date().toISOString()});
  render(); e.target.reset(); await saveShared(); toast("BMA wurde für alle Nutzer gespeichert.");
});
$("search").addEventListener("input", render);
$("settingsOpen").addEventListener("click", openSettings); $("settingsClose").addEventListener("click", closeSettings);
$("settingsModal").addEventListener("click", e => { if (e.target === $("settingsModal")) closeSettings(); });
$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const username = $("username").value.trim().toLocaleLowerCase("de");
  const password = $("password").value;
  if (username !== CHEF_USERNAME.toLocaleLowerCase("de") || password !== CHEF_PASSWORD) {
    $("loginError").textContent = "Benutzername oder Passwort falsch.";
    $("loginError").classList.remove("hidden");
    return;
  }
  isLoggedIn = true;
  $("loginError").classList.add("hidden");
  $("loginView").classList.add("hidden");
  $("configView").classList.remove("hidden");
  $("baseCost").value = settings.baseCost;
  $("kmCost").value = settings.kmCost;
  renderCategories();
});
$("configForm").addEventListener("submit", async e => {
  e.preventDefault(); if (!isLoggedIn) return;
  const base = Number($("baseCost").value), rate = Number($("kmCost").value);
  if (base < 0 || rate < 0 || !Number.isFinite(base) || !Number.isFinite(rate)) return toast("Bitte gültige, positive Tarife eingeben.");
  settings = {baseCost: base, kmCost: rate}; render(); await saveShared(); closeSettings(); toast("Tarife wurden für alle Nutzer gespeichert.");
});
$("addCategory").addEventListener("click", async () => {
  if (!isLoggedIn) return;
  const name = $("newCategory").value.trim(); if (!name) return toast("Bitte einen Kategorienamen eingeben.");
  if (categories.some(c => c.toLocaleLowerCase("de") === name.toLocaleLowerCase("de"))) return toast("Diese Kategorie gibt es bereits.");
  categories.push(name); $("newCategory").value = ""; renderCategories(); render(); await saveShared(); toast("Kategorie wurde für alle Nutzer hinzugefügt.");
});
$("newCategory").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); $("addCategory").click(); } });
$("logout").addEventListener("click", () => { isLoggedIn = false; $("configView").classList.add("hidden"); $("loginView").classList.remove("hidden"); $("password").value = ""; });
renderCategories(); render(); startFirebase();
