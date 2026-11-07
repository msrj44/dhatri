import { db } from "../../firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { saveDoc, getDocData, showMsg } from "./admin-core.js";

async function load() {
  const d = await getDocData("site_content", "contact");
  if (d) document.getElementById("contact-email").value = d.email || "";
  loadMessages();
}
async function loadMessages() {
  const tbody = document.getElementById("messages-body");
  const snap = await getDocs(collection(db, "contact_messages"));
  tbody.innerHTML = "";
  snap.forEach(d => {
    const data = d.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${data.name || ""}</td><td>${data.email || ""}</td><td>${data.subject || ""}</td><td>${data.message || ""}</td><td><button class="btn btn-sm btn-danger" data-id="${d.id}">डिलीट</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll("button[data-id]").forEach(b => b.onclick = async () => {
    if (confirm("डिलीट करें?")) {
      const { deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      await deleteDoc(doc(db, "contact_messages", b.dataset.id));
      loadMessages();
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save-btn").onclick = async () => {
    await saveDoc("site_content", "contact", { email: document.getElementById("contact-email").value });
    showMsg(document.getElementById("msg"), "✅ Contact सेव!");
  };
});