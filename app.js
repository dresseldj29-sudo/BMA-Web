// BMA-Verwaltung – Kategorien und gemeinsame Gesamtsumme.
const DEFAULTS = { baseCost: 0, kmCost: 1000 };
const DEFAULT_CATEGORIES = ["Krankenhaus", "Wohngebäude", "Gewerbe", "Öffentliche Einrichtung", "Sonstiges"];
const DEMO_USER = "FeuerwehrChef";
const DEMO_PASSWORD = "chef-FW";
const $ = id => document.getElementById(id);
let settings = load("bmaSettings", DEFAULTS);
let records = load("bmaRecords", []);
let categories = load("bmaCategories", DEFAULT_CATEGORIES);
let isLoggedIn = false;

function load(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : JSON.parse(JSON.stringify(fallback)); }
  catch { return JSON.parse(JSON.stringify(fallback)); }
}
function save() {
  localStorage.setItem("bmaSettings", JSON.stringify(settings));
  localStorage.setItem("bmaRecords", JSON.stringify(records));
  localStorage.setItem("bmaCategories", JSON.stringify(categories));
}
function money(value) {
  return new Intl.NumberFormat("de-DE", {maximumFractionDigits:2}).format(value) + " $";
}
function calc(record) {
  return Number(settings.baseCost || 0) + Number(record.km || 0) * Number(settings.kmCost || 0);
}
function renderCategories() {
  const select = $("category");
  const current = select.value;
  select.innerHTML = "";
  categories.forEach(name => {
    const option = document.createElement("option"); option.value = name; option.textContent = name; select.append(option);
  });
  if (categories.includes(current)) select.value = current;
  const list = $("categoryList"); list.innerHTML = "";
  categories.forEach(name => {
    const chip = document.createElement("span"); chip.className = "category-chip";
    const label = document.createElement("span"); label.textContent = name;
    const del = document.createElement("button"); del.type = "button"; del.textContent = "Löschen"; del.title = "Kategorie löschen";
    del.addEventListener("click", () => {
      if (categories.length <= 1) return toast("Mindestens eine Kategorie muss vorhanden sein.");
      if (!confirm(`Kategorie „${name}“ löschen? Bestehende Einträge werden auf die erste verbleibende Kategorie gesetzt.`)) return;
      categories = categories.filter(c => c !== name);
      records.forEach(r => { if (r.category === name) r.category = categories[0]; });
      save(); renderCategories(); render(); toast("Kategorie gelöscht.");
    });
    chip.append(label, del); list.append(chip);
  });
}
function render() {
  const query = $("search").value.trim().toLocaleLowerCase("de");
  const filtered = records.filter(r => [r.name, r.location, r.note, r.category].join(" ").toLocaleLowerCase("de").includes(query));
  const total = records.reduce((sum, r) => sum + calc(r), 0);
  $("statCount").textContent = records.length;
  $("statCosts").textContent = money(total);
  $("listTotal").textContent = money(total);
  // Category totals include every configured category, even when it has no entries.
  const totalsHost = $("categoryTotals");
  totalsHost.innerHTML = "";
  categories.forEach(categoryName => {
    const categoryRecords = records.filter(r => (r.category || "Sonstiges") === categoryName);
    const categoryTotal = categoryRecords.reduce((sum, r) => sum + calc(r), 0);
    const tile = document.createElement("article");
    tile.className = "category-total-card";
    const name = document.createElement("span");
    name.className = "category-total-name";
    name.textContent = categoryName;
    const amount = document.createElement("strong");
    amount.textContent = money(categoryTotal);
    const count = document.createElement("small");
    count.textContent = `${categoryRecords.length} ${categoryRecords.length === 1 ? "Eintrag" : "Einträge"}`;
    tile.append(name, amount, count);
    totalsHost.append(tile);
  });
  $("statRate").textContent = money(Number(settings.kmCost || 0));
  $("empty").classList.toggle("hidden", filtered.length > 0);
  $("bmaList").innerHTML = "";
  filtered.forEach(r => {
    const card = document.createElement("article"); card.className = "bma-card";
    const info = document.createElement("div");
    const title = document.createElement("div"); title.className = "bma-title"; title.textContent = r.name;
    const meta = document.createElement("div"); meta.className = "bma-meta";
    const category = document.createElement("span"); category.textContent = "▦ " + (r.category || "Sonstiges");
    const place = document.createElement("span"); place.textContent = "📍 " + r.location;
    const distance = document.createElement("span"); distance.textContent = "↗ " + r.km + " km";
    meta.append(category, place, distance); info.append(title, meta);
    if (r.note) { const note = document.createElement("div"); note.className = "bma-note"; note.textContent = "Notiz: " + r.note; info.append(note); }
    const cost = document.createElement("div"); cost.className = "cost";
    const amount = document.createElement("strong"); amount.textContent = money(calc(r));
    const detail = document.createElement("small"); detail.textContent = `${money(settings.baseCost)} Grundkosten + ${r.km} km × ${money(settings.kmCost)}`;
    const del = document.createElement("button"); del.className = "delete"; del.textContent = "Eintrag löschen";
    del.addEventListener("click", () => { if (confirm(`Eintrag „${r.name}“ wirklich löschen?`)) { records = records.filter(x => x.id !== r.id); save(); render(); toast("Eintrag wurde gelöscht."); } });
    cost.append(amount, detail, del); card.append(info, cost); $("bmaList").append(card);
  });
}
function toast(message) { const el = $("toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2400); }
function openSettings() {
  // Login modal always starts in a clean state.
  $("settingsModal").classList.remove("hidden");
  $("loginView").classList.remove("hidden");
  $("configView").classList.add("hidden");
  $("loginError").classList.add("hidden");
  $("username").value = "";
  $("password").value = "";
  requestAnimationFrame(() => $("username").focus());
}
function closeSettings() { $("settingsModal").classList.add("hidden"); isLoggedIn = false; }
$("bmaForm").addEventListener("submit", e => {
  e.preventDefault();
  const km = Number($("km").value);
  if (!Number.isFinite(km) || km < 0) return toast("Bitte gültige Kilometer eingeben.");
  records.unshift({id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name: $("name").value.trim(), category: $("category").value, location: $("location").value.trim(), km, note: $("note").value.trim(), createdAt: new Date().toISOString()});
  save(); e.target.reset(); renderCategories(); render(); toast("Eintrag wurde gespeichert.");
});
$("search").addEventListener("input", render);
$("settingsOpen").addEventListener("click", openSettings);
$("settingsClose").addEventListener("click", closeSettings);
$("settingsModal").addEventListener("click", e => { if (e.target === $("settingsModal")) closeSettings(); });
$("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const enteredUser = $("username").value.trim().toLocaleLowerCase("de");
  const enteredPassword = $("password").value;
  const validUser = enteredUser === DEMO_USER.toLocaleLowerCase("de");
  if (validUser && enteredPassword === DEMO_PASSWORD) {
    isLoggedIn = true;
    $("loginError").classList.add("hidden");
    $("loginView").classList.add("hidden");
    $("configView").classList.remove("hidden");
    $("baseCost").value = settings.baseCost;
    $("kmCost").value = settings.kmCost;
    renderCategories();
  } else {
    isLoggedIn = false;
    $("loginError").classList.remove("hidden");
    $("password").focus();
  }
});
$("configForm").addEventListener("submit", e => {
  e.preventDefault(); if (!isLoggedIn) return;
  const base = Number($("baseCost").value), rate = Number($("kmCost").value);
  if (base < 0 || rate < 0 || !Number.isFinite(base) || !Number.isFinite(rate)) return toast("Bitte gültige, positive Tarife eingeben.");
  settings = {baseCost: base, kmCost: rate}; save(); render(); closeSettings(); toast("Tarife wurden gespeichert.");
});
$("addCategory").addEventListener("click", () => {
  if (!isLoggedIn) return;
  const name = $("newCategory").value.trim();
  if (!name) return toast("Bitte einen Kategorienamen eingeben.");
  if (categories.some(c => c.toLocaleLowerCase("de") === name.toLocaleLowerCase("de"))) return toast("Diese Kategorie gibt es bereits.");
  categories.push(name); $("newCategory").value = ""; save(); renderCategories(); toast("Kategorie wurde hinzugefügt.");
});
$("newCategory").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); $("addCategory").click(); } });
$("logout").addEventListener("click", () => { isLoggedIn = false; $("configView").classList.add("hidden"); $("loginView").classList.remove("hidden"); });
renderCategories();
render();
