// BMA-Verwaltung – statische Demo für GitHub Pages.
// Hinweis: Zugangsdaten und Tarifwerte in einer rein clientseitigen Website sind NICHT sicher.
const DEFAULTS = { baseCost: 0, kmCost: 1000 };
const DEMO_USER = "FeuerwehrChef";
const DEMO_PASSWORD = "chef-FW";
const $ = (id) => document.getElementById(id);
let settings = load("bmaSettings", DEFAULTS);
let records = load("bmaRecords", []);
let isLoggedIn = false;

function load(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}
function save() {
  localStorage.setItem("bmaSettings", JSON.stringify(settings));
  localStorage.setItem("bmaRecords", JSON.stringify(records));
}
function money(value) {
  return new Intl.NumberFormat("de-DE", {maximumFractionDigits:2}).format(value) + " $";
}
function calc(record) {
  // Transparente, deterministische Kostenberechnung: Grundkosten + Kilometer × Kilometerpreis.
  return Number(settings.baseCost || 0) + Number(record.km || 0) * Number(settings.kmCost || 0);
}
function render() {
  const query = $("search").value.trim().toLocaleLowerCase("de");
  const filtered = records.filter(r => [r.name, r.location, r.note].join(" ").toLocaleLowerCase("de").includes(query));
  $("statCount").textContent = records.length;
  $("statCosts").textContent = money(records.reduce((sum, r) => sum + calc(r), 0));
  $("statRate").textContent = money(Number(settings.kmCost || 0));
  $("empty").classList.toggle("hidden", filtered.length > 0);
  $("bmaList").innerHTML = "";
  filtered.forEach(r => {
    const card = document.createElement("article");
    card.className = "bma-card";
    const info = document.createElement("div");
    const title = document.createElement("div"); title.className = "bma-title"; title.textContent = r.name;
    const meta = document.createElement("div"); meta.className = "bma-meta";
    const place = document.createElement("span"); place.textContent = "📍 " + r.location;
    const distance = document.createElement("span"); distance.textContent = "↗ " + r.km + " km";
    meta.append(place, distance); info.append(title, meta);
    if (r.note) { const note = document.createElement("div"); note.className = "bma-note"; note.textContent = "Notiz: " + r.note; info.append(note); }
    const cost = document.createElement("div"); cost.className = "cost";
    const amount = document.createElement("strong"); amount.textContent = money(calc(r));
    const detail = document.createElement("small"); detail.textContent = `${money(settings.baseCost)} Grundkosten + ${r.km} km × ${money(settings.kmCost)}`;
    const del = document.createElement("button"); del.className = "delete"; del.textContent = "Eintrag löschen";
    del.addEventListener("click", () => { if (confirm(`BMA „${r.name}“ wirklich löschen?`)) { records = records.filter(x => x.id !== r.id); save(); render(); toast("BMA wurde gelöscht."); } });
    cost.append(amount, detail, del); card.append(info, cost); $("bmaList").append(card);
  });
}
function toast(message) { const el = $("toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2400); }
function openSettings() {
  $("settingsModal").classList.remove("hidden");
  $("loginView").classList.remove("hidden"); $("configView").classList.add("hidden");
  $("loginError").classList.add("hidden"); $("username").value = ""; $("password").value = "";
}
function closeSettings() { $("settingsModal").classList.add("hidden"); isLoggedIn = false; }
$("bmaForm").addEventListener("submit", e => {
  e.preventDefault();
  const km = Number($("km").value);
  if (!Number.isFinite(km) || km < 0) return toast("Bitte gültige Kilometer eingeben.");
  records.unshift({id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name: $("name").value.trim(), location: $("location").value.trim(), km, note: $("note").value.trim(), createdAt: new Date().toISOString()});
  save(); e.target.reset(); render(); toast("BMA wurde gespeichert.");
});
$("search").addEventListener("input", render);
$("settingsOpen").addEventListener("click", openSettings);
$("settingsClose").addEventListener("click", closeSettings);
$("settingsModal").addEventListener("click", e => { if (e.target === $("settingsModal")) closeSettings(); });
$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  if ($("username").value === DEMO_USER && $("password").value === DEMO_PASSWORD) {
    isLoggedIn = true; $("loginView").classList.add("hidden"); $("configView").classList.remove("hidden");
    $("baseCost").value = settings.baseCost; $("kmCost").value = settings.kmCost;
  } else $("loginError").classList.remove("hidden");
});
$("configForm").addEventListener("submit", e => {
  e.preventDefault(); if (!isLoggedIn) return;
  const base = Number($("baseCost").value), rate = Number($("kmCost").value);
  if (base < 0 || rate < 0 || !Number.isFinite(base) || !Number.isFinite(rate)) return toast("Bitte gültige, positive Tarife eingeben.");
  settings = {baseCost: base, kmCost: rate}; save(); render(); closeSettings(); toast("Tarife wurden gespeichert.");
});
$("logout").addEventListener("click", () => { isLoggedIn = false; $("configView").classList.add("hidden"); $("loginView").classList.remove("hidden"); });
render();