import { db, DEFAULT_THEME } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Theme Loader
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

// Popup Loader
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
          <p style="color:#444;">${p.body || ""}</p>
        </div>
      </div>`;
    document.body.appendChild(div);
    document.getElementById("popup-close").onclick = () => div.remove();
  } catch (e) { console.warn("Popup skipped:", e.message); }
}

// Chatbot Loader (FIX: CSS Load Added)
async function loadChatbot() {
  try {
    const snap = await getDoc(doc(db, "settings", "chatbot"));
    if (!snap.exists() || !snap.data().enabled) return;

    // 1. CSS लोड करो
    if (!document.querySelector('link[href="chatbot.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "chatbot.css";
      document.head.appendChild(link);
    }

    // 2. JS लोड करो
    const s = document.createElement("script");
    s.type = "module";
    s.src = "chatbot.js";
    document.body.appendChild(s);
  } catch (e) { console.warn("Chatbot skipped:", e.message); }
}

// RDX Badge
function addRdxBadge() {
  const f = document.querySelector(".site-footer");
  if (!f) return;
  const b = document.createElement("div");
  b.style.cssText = "margin-top:1rem;font-size:0.85rem;opacity:0.85;";
  b.innerHTML = `⚡ Powered by <strong>RDX</strong> | Managed by <strong>Mukesh Sinwar</strong>`;
  f.appendChild(b);
}

// PWA Service Worker & App Install
function setupPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Error', err));
    });
  }

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const footer = document.querySelector(".site-footer");
    if (footer && !document.getElementById("install-app-btn")) {
      const btn = document.createElement("button");
      btn.id = "install-app-btn";
      btn.style.cssText = "margin-top: 1.5rem; background: var(--accent); color: #fff; border: none; padding: 0.6rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 1rem;";
      btn.innerHTML = "📲 App Install करें";
      
      btn.onclick = async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') btn.remove();
          deferredPrompt = null;
        }
      };
      footer.appendChild(btn);
    }
  });
}

// Init All
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  loadPopup();
  loadChatbot();
  addRdxBadge();
  setupPWA();
});