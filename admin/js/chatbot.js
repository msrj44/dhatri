import { db } from "../../firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDocData, saveDoc, showMsg } from "./admin-core.js";

async function loadStatus() {
  const d = await getDocData("settings", "chatbot");
  document.getElementById("cb-enabled").checked = d ? !!d.enabled : false;
}

async function loadRules() {
  const tbody = document.getElementById("cb-rules-body");
  const snap = await getDocs(collection(db, "chatbot_rules"));
  tbody.innerHTML = "";
  snap.forEach(d => {
    const data = d.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${data.keywords || ""}</td><td>${data.reply || ""}</td><td><button class="btn btn-sm btn-danger" data-id="${d.id}">✕</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll("button[data-id]").forEach(b => b.onclick = async () => {
    if (confirm("डिलीट?")) { await deleteDoc(doc(db, "chatbot_rules", b.dataset.id)); loadRules(); }
  });
}

document.getElementById("cb-toggle-btn").onclick = async () => {
  const enabled = document.getElementById("cb-enabled").checked;
  await saveDoc("settings", "chatbot", { enabled });
  showMsg(document.getElementById("cb-msg"), "✅ Chatbot " + (enabled ? "ON" : "OFF"));
};

document.getElementById("cb-add-rule").onclick = async () => {
  const keywords = document.getElementById("cb-keywords").value.trim();
  const reply = document.getElementById("cb-reply").value.trim();
  if (!keywords || !reply) return alert("दोनों भरें");
  await addDoc(collection(db, "chatbot_rules"), { keywords, reply });
  document.getElementById("cb-keywords").value = "";
  document.getElementById("cb-reply").value = "";
  loadRules();
};

loadStatus(); loadRules();