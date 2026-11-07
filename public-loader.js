import { db, DEFAULT_THEME } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function loadTheme() {
  try {
    const snap = await getDoc(doc(db, "settings", "theme"));
    const theme = snap.exists() ? snap.data() : DEFAULT_THEME;
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary || DEFAULT_THEME.primary);
    root.style.setProperty("--accent", theme.accent || DEFAULT_THEME.accent);
    root.style.setProperty("--bg", theme.bg || DEFAULT_THEME.bg);
    root.style.setProperty("--text", theme.text || DEFAULT_THEME.text);
  } catch (e) { console.warn("Theme load skipped:", e.message); }
}

async function loadPopup() {
  try {
    const snap = await getDoc(doc(db, "settings", "popups"));
    if (!snap.exists() || !snap.data().active) return;
    const p = snap.data();
    const div = document.createElement("div");
    div.id = "site-popup";
    div.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;">
        <div style="background:#fff;border-radius:14px;max-width:480px;width:100%;padding:2rem;position:relative;text-align:center;">
          <button id="popup-close" style="position:absolute;top:10px;right:14px;background:none;border:none;font-size:1.6rem;cursor:pointer;">&times;</button>
          ${p.image ? `<img src="${p.image}" style="max-width:100%;border-radius:10px;margin-bottom:1rem;">` : ""}
          <h3 style="color:#0a1f44;margin-bottom:0.75rem;">${p.title || ""}</h3>
          <p style="color:#444;">${p.message || ""}</p>
        </div>
      </div>`;
    document.body.appendChild(div);
    document.getElementById("popup-close").onclick = () => div.remove();
  } catch (e) { console.warn("Popup skipped:", e.message); }
}

async function loadChatbot() {
  try {
    const snap = await getDoc(doc(db, "settings", "chatbot"));
    if (!snap.exists() || !snap.data().enabled) return;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "chatbot.js";
    document.body.appendChild(s);
  } catch (e) { console.warn("Chatbot skipped:", e.message); }
}

function addRdxBadge() {
  const f = document.querySelector(".site-footer");
  if (!f) return;
  const b = document.createElement("div");
  b.style.cssText = "margin-top:1rem;font-size:0.85rem;opacity:0.85;";
  b.innerHTML = `⚡ Powered by <strong>RDX</strong> | Managed by <strong>Mukesh Sinwar</strong>`;
  f.appendChild(b);
}

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  loadPopup();
  loadChatbot();
  addRdxBadge();
});