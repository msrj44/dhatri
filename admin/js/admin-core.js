import { auth, ADMIN_EMAILS } from "../../firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Sidebar links (हर admin page पर inject होता है)
const SIDEBAR_LINKS = [
  { href: "index.html", icon: "📊", label: "Overview" },
  { href: "home.html", icon: "🏠", label: "Home" },
  { href: "themes.html", icon: "🎨", label: "Themes" },
  { href: "popups.html", icon: "📢", label: "Popups" },
  { href: "gallery.html", icon: "📸", label: "Gallery" },
  { href: "about.html", icon: "📖", label: "About" },
  { href: "panchayat.html", icon: "🏛️", label: "Panchayat" },
  { href: "contact.html", icon: "📞", label: "Contact" },
  { href: "chatbot.html", icon: "🤖", label: "Chatbot" },
  { href: "legal.html", icon: "📄", label: "Legal" }
];

function renderSidebar() {
  const sb = document.getElementById("sidebar");
  if (!sb) return;
  const current = location.pathname.split("/").pop() || "index.html";
  sb.innerHTML = SIDEBAR_LINKS.map(l =>
    `<a href="${l.href}" class="${l.href === current ? "active" : ""}">${l.icon} ${l.label}</a>`
  ).join("");
}

// Auth guard
onAuthStateChanged(auth, user => {
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    window.location.href = "login.html";
    return;
  }
  const emailEl = document.getElementById("user-email");
  if (emailEl) emailEl.textContent = user.email;
  renderSidebar();
});

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("logout-btn");
  if (btn) btn.onclick = () => signOut(auth).then(() => window.location.href = "login.html");
});

// Common helpers
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