import { auth, ADMIN_EMAILS } from "../../firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🚨 यहाँ 'Discussion' जोड़ा गया है
const TABS = [
  { href: "/admin/index", icon: "📊", label: "Overview" },
  { href: "/admin/home", icon: "🏠", label: "Home" },
  { href: "/admin/themes", icon: "🎨", label: "Themes" },
  { href: "/admin/popups", icon: "📢", label: "Popups" },
  { href: "/admin/gallery", icon: "📸", label: "Gallery" },
  { href: "/admin/about", icon: "📖", label: "About" },
  { href: "/admin/panchayat", icon: "🏛️", label: "Panchayat" },
  { href: "/admin/contact", icon: "📞", label: "Contact" },
  { href: "/admin/chatbot", icon: "🤖", label: "Chatbot" },
  { href: "/admin/legal", icon: "📄", label: "Legal" },
  { href: "/admin/discussion", icon: "💬", label: "Discussion" }
];

function renderTabs() {
  const container = document.getElementById("sidebar");
  if (!container) return;
  const current = location.pathname.split("/").pop() || "/admin/index";
  container.className = "admin-tabs-container";
  
  // सारे Tabs render करो
  container.innerHTML = TABS.map(t => 
    `<a href="${t.href}" class="admin-tab-link ${t.href === current ? "active" : ""}">${t.icon} ${t.label}</a>`
  ).join("");
}

onAuthStateChanged(auth, user => {
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    window.location.href = "/admin/login"; return;
  }
  const emailEl = document.getElementById("user-email");
  if (emailEl) emailEl.textContent = user.email;
  renderTabs();
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("logout-btn");
  if (btn) btn.onclick = () => signOut(auth).then(() => window.location.href = "/admin/login");
});

export async function saveDoc(collectionName, docId, data) {
  const { db } = await import("../../firebase-config.js");
  const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  await setDoc(doc(db, collectionName, docId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getDocData(collectionName, docId) {
  const { db } = await import("../../firebase-config.js");
  const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const snap = await getDoc(doc(db, collectionName, docId));
  return snap.exists() ? snap.data() : null;
}

export function showMsg(el, text, type = "success") {
  el.style.color = type === "success" ? "#28a745" : "#dc3545";
  el.textContent = text;
  setTimeout(() => el.textContent = "", 3000);
}