import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const toggle = document.createElement("button");
toggle.id = "chatbot-toggle"; 
toggle.innerHTML = "🤖"; 
toggle.title = "धात्री मित्र";
document.body.appendChild(toggle);

const panel = document.createElement("div");
panel.id = "chatbot-panel";
panel.innerHTML = `
  <div class="chat-header">
    <div class="chat-avatar">🤖</div>
    <div class="chat-title">
      <h4>धात्री मित्र</h4>
      <span>ऑनलाइन · तुरंत जवाब</span>
    </div>
    <button class="chat-close" id="chatbot-close">&times;</button>
  </div>
  <div class="chat-messages" id="chatbot-messages"></div>
  <div class="quick-replies" id="chat-quick"></div>
  <div class="chat-input-area">
    <input id="chatbot-input" placeholder="संदेश लिखें..." />
    <button class="chat-send" id="chatbot-send">➤</button>
  </div>`;
document.body.appendChild(panel);

const msgs = panel.querySelector("#chatbot-messages");
const input = panel.querySelector("#chatbot-input");
const sendBtn = panel.querySelector("#chatbot-send");
const closeBtn = panel.querySelector("#chatbot-close");
const quickBox = panel.querySelector("#chat-quick");

toggle.onclick = () => panel.classList.toggle("open");
closeBtn.onclick = () => panel.classList.remove("open");

const DEFAULT_QUICK = ["गाँव के बारे में", "सरपंच कौन है?", "जनसंख्या", "संपर्क नंबर"];
let rules = [];

(async () => {
  try {
    const snap = await getDocs(collection(db, "chatbot_rules"));
    snap.forEach(d => rules.push(d.data()));
  } catch (e) { console.warn(e); }
  renderQuickReplies();
})();

function renderQuickReplies() {
  quickBox.innerHTML = DEFAULT_QUICK.map(q => `<button class="quick-btn">${q}</button>`).join("");
  quickBox.querySelectorAll(".quick-btn").forEach(b => b.onclick = () => { input.value = b.innerText; send(); });
}

function addMsg(text, who) {
  const div = document.createElement("div");
  div.className = `msg-row ${who}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "msg-row bot"; div.id = "typing";
  div.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() { document.getElementById("typing")?.remove(); }

function getBotReply(text) {
  const q = text.toLowerCase();
  for (const r of rules) {
    if (!r.keywords) continue;
    const kws = r.keywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean);
    if (kws.some(k => q.includes(k))) return r.reply;
  }
  if (q.includes("जनसंख्या") || q.includes("population")) return "धात्री गाँव की जनसंख्या 3,169 है (2011 Census)।";
  if (q.includes("सरपंच")) return "धात्री गाँव के सरपंच <b>Rampratap</b> हैं।";
  if (q.includes("संपर्क") || q.includes("contact")) return "ईमेल: info@dhaatri.mywire.org";
  return "माफ़ करें, मुझे इसका जवाब नहीं पता। आप संपर्क पेज से पूछ सकते हैं।";
}

function send() {
  const t = input.value.trim(); if (!t) return;
  addMsg(t, "user"); input.value = "";
  
  // Quick replies छिपा दो जब यूजर मैसेज भेज दे
  if(quickBox) quickBox.style.display = "none";

  showTyping();
  setTimeout(() => {
    hideTyping();
    addMsg(getBotReply(t), "bot");
  }, 800);
}

sendBtn.onclick = send;
input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });

// Initial Greeting
addMsg("नमस्ते! 🙏 मैं <b>धात्री मित्र</b> हूँ — धात्री गाँव का आपका सहायक।", "bot");