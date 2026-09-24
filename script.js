const SETTINGS_KEY = "gamerxdgz-appearance-settings";
const defaults = { theme: "dark", accent: "#6d96ff", backgroundAnimation: "none", animations: true, reducedMotion: false, transparency: true, timeStyle: "digital", timeFormat: "12" };
const $ = (id) => document.getElementById(id);
const els = { greeting: $("greeting"), time: $("timeDisplay"), date: $("dateDisplay"), overlay: $("settingsOverlay"), effects: $("backgroundEffects"), theme: $("theme"), accent: $("accentColor"), background: $("backgroundAnimation"), animations: $("animations"), reduced: $("reducedMotion"), transparency: $("transparency"), style: $("timeStyle"), format: $("timeFormat") };

function loadSettings() { try { const value = JSON.parse(localStorage.getItem(SETTINGS_KEY)); return { ...defaults, ...(value && typeof value === "object" ? value : {}) }; } catch { return { ...defaults }; } }
let settings = loadSettings();
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* Storage can be disabled; settings still work for this visit. */ } }
function validColor(value) { return typeof value === "string" && /^#[\da-f]{6}$/i.test(value) ? value : defaults.accent; }
function setAccent(color) { settings.accent = validColor(color); document.documentElement.style.setProperty("--accent", settings.accent); const rgb = settings.accent.match(/[\da-f]{2}/gi).map((v) => parseInt(v, 16)); document.documentElement.style.setProperty("--accent-soft", `rgba(${rgb.join(",")}, .14)`); document.documentElement.style.setProperty("--accent-contrast", (rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114) > 155 ? "#10141d" : "#fff"); }
function applySettings() { const root = document.documentElement; root.dataset.theme = settings.theme; root.classList.toggle("animations-off", !settings.animations); root.classList.toggle("reduced-motion", settings.reducedMotion); root.classList.toggle("no-transparency", !settings.transparency); els.effects.dataset.animation = settings.backgroundAnimation; setAccent(settings.accent); updateClock(); }
function syncControls() { els.theme.value = settings.theme; els.accent.value = validColor(settings.accent); els.background.value = settings.backgroundAnimation; els.animations.checked = settings.animations; els.reduced.checked = settings.reducedMotion; els.transparency.checked = settings.transparency; els.style.value = settings.timeStyle; els.format.value = settings.timeFormat; }
function updateGreeting() { els.greeting.textContent = "Hello, GamerXD_GZ."; }
function updateClock() { const now = new Date(); const options = { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: settings.timeFormat === "12" }; const time = now.toLocaleTimeString(undefined, options); const date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }); els.date.textContent = date; els.time.classList.toggle("dialogue", settings.timeStyle === "dialog"); if (settings.timeStyle === "date") { els.time.textContent = date; els.date.textContent = "Current date"; } else { els.time.textContent = settings.timeStyle === "dialog" ? `It's ${time}.` : time; } }
function openSettings() { syncControls(); els.overlay.classList.remove("hidden"); els.overlay.setAttribute("aria-hidden", "false"); els.close?.focus(); }
function closeSettingsPanel() { els.overlay.classList.add("hidden"); els.overlay.setAttribute("aria-hidden", "true"); }
function changed() { applySettings(); saveSettings(); syncControls(); }

$("settingsButton").addEventListener("click", openSettings); $("closeSettings").addEventListener("click", closeSettingsPanel); $("doneSettings").addEventListener("click", closeSettingsPanel); els.overlay.addEventListener("click", (event) => { if (event.target === els.overlay) closeSettingsPanel(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !els.overlay.classList.contains("hidden")) closeSettingsPanel(); });
els.theme.addEventListener("change", () => { settings.theme = els.theme.value; changed(); }); els.accent.addEventListener("input", () => { setAccent(els.accent.value); saveSettings(); }); els.background.addEventListener("change", () => { settings.backgroundAnimation = els.background.value; changed(); });
[els.animations, els.reduced, els.transparency].forEach((input) => input.addEventListener("change", () => { settings[input === els.animations ? "animations" : input === els.reduced ? "reducedMotion" : "transparency"] = input.checked; changed(); }));
els.style.addEventListener("change", () => { settings.timeStyle = els.style.value; changed(); }); els.format.addEventListener("change", () => { settings.timeFormat = els.format.value; changed(); });
document.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => { setAccent(button.dataset.color); els.accent.value = settings.accent; saveSettings(); }));
$("resetSettings").addEventListener("click", () => { settings = { ...defaults }; try { localStorage.removeItem(SETTINGS_KEY); } catch { /* Ignore unavailable storage. */ } applySettings(); syncControls(); });

let clockInterval = window.setInterval(updateClock, 1000); // One timer is intentionally created for the page lifetime.
updateGreeting(); applySettings(); syncControls();
