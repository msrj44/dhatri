import { db, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../../firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showMsg } from "./admin-core.js";

let groups = [];
const container = document.getElementById("groups-container");
const modal = document.getElementById("group-modal");
const gModalTitle = document.getElementById("g-modal-title");
const gName = document.getElementById("g-name");
const gDesc = document.getElementById("g-desc");
let currentGroupId = null;

async function loadGroups() {
  const snap = await getDocs(collection(db, "gallery_groups"));
  groups = [];
  snap.forEach(d => groups.push({ id: d.id, ...d.data() }));
  renderGroups();
}

function renderGroups() {
  container.innerHTML = "";
  if (groups.length === 0) {
    container.innerHTML = `<div class="admin-card" style="grid-column: 1/-1; text-align:center;">कोई group नहीं है। ऊपर New Group से जोड़ें।</div>`;
    return;
  }
  groups.forEach(g => {
    const div = document.createElement("div");
    div.className = "admin-card";
    div.style.cssText = "display:flex; flex-direction:column; justify-content:space-between; cursor:pointer; text-align:center;";
    div.innerHTML = `
      <div style="font-size:3rem; margin-bottom:1rem;">📁</div>
      <div>
        <h3 style="margin-bottom:0.25rem; font-size:1.1rem;">${g.name}</h3>
        <p style="font-size:0.8rem; color:#64748b; margin-bottom:1rem;">${g.description || 'No description'}</p>
      </div>
      <div style="display:flex; gap:0.5rem; justify-content:center;">
        <button class="btn btn-sm edit-g" data-id="${g.id}">✏️ Edit</button>
        <button class="btn btn-danger btn-sm del-g" data-id="${g.id}">🗑️</button>
      </div>
    `;
    container.appendChild(div);
    
    // Click to open group images (redirect to gallery-images.html?group=ID या उसी page पर images दिखाएँ)
    // यहाँ हम बस एक simple prompt दिखा रहे हैं, actual gallery images के लिए अलग page बना सकते हैं
    div.onclick = (e) => {
      if (e.target.tagName !== "BUTTON") {
        window.location.href = `gallery-images.html?group=${g.id}&name=${encodeURIComponent(g.name)}`;
      }
    };
  });

  document.querySelectorAll(".edit-g").forEach(b => b.onclick = (e) => { e.stopPropagation(); editGroup(b.dataset.id); });
  document.querySelectorAll(".del-g").forEach(b => b.onclick = async (e) => { 
    e.stopPropagation();
    if (confirm("Group और उसकी सभी फोटो डिलीट करें?")) {
      await deleteDoc(doc(db, "gallery_groups", b.dataset.id));
      // Also delete images associated
      const imgSnap = await getDocs(query(collection(db, "gallery_images"), where("groupId", "==", b.dataset.id)));
      imgSnap.forEach(async (img) => await deleteDoc(doc(db, "gallery_images", img.id)));
      loadGroups();
    }
  });
}

// Modal logic
document.getElementById("new-group-btn").onclick = () => {
  currentGroupId = null; gModalTitle.textContent = "New Gallery Group"; gName.value = ""; gDesc.value = "";
  modal.classList.add("open");
};
document.getElementById("g-modal-close").onclick = () => modal.classList.remove("open");
document.getElementById("g-modal-cancel").onclick = () => modal.classList.remove("open");

document.getElementById("g-modal-save").onclick = async () => {
  const name = gName.value.trim(); const description = gDesc.value.trim();
  if (!name) return alert("Group name डालें");
  
  if (currentGroupId) {
    await updateDoc(doc(db, "gallery_groups", currentGroupId), { name, description });
  } else {
    await addDoc(collection(db, "gallery_groups"), { name, description, createdAt: serverTimestamp() });
  }
  modal.classList.remove("open");
  loadGroups();
};

function editGroup(id) {
  const g = groups.find(x => x.id === id);
  if (!g) return;
  currentGroupId = id;
  gModalTitle.textContent = "Edit Group";
  gName.value = g.name; gDesc.value = g.description || "";
  modal.classList.add("open");
}

loadGroups();