import { getDocData, saveDoc, showMsg } from "./admin-core.js";

const PRESETS = [
  { name: "Default (Navy + Saffron)", primary: "#0a1f44", accent: "#ff9933", bg: "#f8f9fa", text: "#212529" },
  { name: "Dark Mode", primary: "#1a202c", accent: "#f6ad55", bg: "#2d3748", text: "#f7fafc" },
  { name: "Nature Green", primary: "#276749", accent: "#9ae6b4", bg: "#f0fff4", text: "#22543d" },
  { name: "Royal Maroon", primary: "#742a2a", accent: "#f6ad55", bg: "#fff5f5", text: "#742a2a" },
  { name: "Royal Purple", primary: "#553c9a", accent: "#d6bcfa", bg: "#faf5ff", text: "#44337a" },
  { name: "Ocean Blue", primary: "#2c5282", accent: "#63b3ed", bg: "#ebf8ff", text: "#2a4365" }
];

const presetsGrid = document.getElementById("presets-grid");
const activeThemeName = document.getElementById("active-theme-name");
const cPrimary = document.getElementById("c-primary");
const cAccent = document.getElementById("c-accent");
const cBg = document.getElementById("c-bg");
const cText = document.getElementById("c-text");

async function load() {
  presetsGrid.innerHTML = PRESETS.map((p, i) => `
    <div class="admin-card preset-card" data-i="${i}" style="cursor:pointer; text-align:center; padding:1rem; border-left-color:${p.accent};">
      <div style="width:50px; height:50px; border-radius:50%; margin:0 auto 0.5rem; background:linear-gradient(135deg, ${p.primary}, ${p.accent});"></div>
      <div style="font-size:0.85rem; font-weight:600; color:${p.primary};">${p.name}</div>
    </div>
  `).join("");

  document.querySelectorAll(".preset-card").forEach(card => {
    card.onclick = () => applyPreset(PRESETS[parseInt(card.dataset.i)]);
  });

  const d = await getDocData("settings", "theme");
  if (d) {
    cPrimary.value = d.primary || PRESETS[0].primary;
    cAccent.value = d.accent || PRESETS[0].accent;
    cBg.value = d.bg || PRESETS[0].bg;
    cText.value = d.text || PRESETS[0].text;
    activeThemeName.textContent = d.name || "Custom";
  } else {
    applyPreset(PRESETS[0], true);
  }
}

async function applyPreset(p, silent = false) {
  cPrimary.value = p.primary; cAccent.value = p.accent; cBg.value = p.bg; cText.value = p.text;
  await saveDoc("settings", "theme", { ...p });
  activeThemeName.textContent = p.name;
  if (!silent) showMsg(document.getElementById("msg"), "✅ Theme apply हो गया!");
}

document.getElementById("apply-custom-btn").onclick = async () => {
  await saveDoc("settings", "theme", {
    name: "Custom",
    primary: cPrimary.value, accent: cAccent.value,
    bg: cBg.value, text: cText.value
  });
  activeThemeName.textContent = "Custom";
  showMsg(document.getElementById("msg"), "✅ Custom theme apply हो गया!");
};

document.getElementById("reset-btn").onclick = () => applyPreset(PRESETS[0]);

load();