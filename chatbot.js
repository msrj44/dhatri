import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const toggle = document.createElement("button");
toggle.id = "chatbot-toggle"; toggle.innerHTML = "🤖"; toggle.title = "Chatbot";
document.body.appendChild(toggle);

const panel = document.createElement("div");
panel.id = "chatbot-panel";
panel.innerHTML = `
  <div id="chatbot-header">
    <h4>🤖 धात्री चैटबॉट</h4>
    <button id="chatbot-close">&times;</button>
  </div>
  <div id="chatbot-messages"></div>
  <div id="chatbot-input-area">
    <input id="chatbot-input" placeholder="अपना सवाल लिखें..." />
    <button id="chatbot-send">भेजें</button>
  </div>`;
document.body.appendChild(panel);

const msgs = panel.querySelector("#chatbot-messages");
const input = panel.querySelector("#chatbot-input");
const sendBtn = panel.querySelector("#chatbot-send");
const closeBtn = panel.querySelector("#chatbot-close");

toggle.onclick = () => panel.classList.toggle("open");
closeBtn.onclick = () => panel.classList.remove("open");

let rules = [];
(async () => {
  try {
    const snap = await getDocs(collection(db, "chatbot_rules"));
    snap.forEach(d => rules.push(d.data()));
  } catch (e) { console.warn("Chatbot rules:", e.message); }
})();

function botReply(text) {
  const q = text.toLowerCase();
  for (const r of rules) {
    if (!r.keywords) continue;
    const kws = r.keywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean);
    if (kws.some(k => q.includes(k))) return r.reply;
  }
  return "माफ़ करें, मुझे इसका जवाब नहीं पता। आप संपर्क पेज से पूछ सकते हैं।";
}

function addMsg(text, who) {
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.textContent = text;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function send() {
  const t = input.value.trim(); if (!t) return;
  addMsg(t, "user"); input.value = "";
  setTimeout(() => addMsg(botReply(t), "bot"), 400);
}
sendBtn.onclick = send;
input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
addMsg("नमस्ते! 🙏 मैं धात्री गाँव का चैटबॉट हूँ। पूछिए कुछ भी।", "bot");