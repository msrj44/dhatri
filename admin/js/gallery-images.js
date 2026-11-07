import { db, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../../firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const params = new URLSearchParams(location.search);
const groupId = params.get("group");
const groupName = params.get("name") || "Gallery";
if (!groupId) window.location.href = "gallery.html";

document.getElementById("group-title").textContent = groupName;
const grid = document.getElementById("images-grid");
const fileInput = document.getElementById("image-input");
const uploadBtn = document.getElementById("upload-images-btn");

async function loadImages() {
  grid.innerHTML = "";
  const q = query(collection(db, "gallery_images"), where("groupId", "==", groupId));
  const snap = await getDocs(q);
  if (snap.empty) { grid.innerHTML = "<p style='grid-column:1/-1; color:#64748b;'>कोई फोटो नहीं है। Add Images से अपलोड करें।</p>"; return; }
  
  snap.forEach(d => {
    const data = d.data();
    const div = document.createElement("div");
    div.className = "admin-card";
    div.style.padding = "0"; div.style.overflow = "hidden";
    div.innerHTML = `
      <img src="${data.url}" style="width:100%; height:150px; object-fit:cover;" />
      <div style="padding:1rem;">
        <p style="font-size:0.9rem; font-weight:600; margin-bottom:0.5rem;">${data.caption || "Untitled"}</p>
        <button class="btn btn-danger btn-sm" style="width:100%;" data-id="${d.id}">🗑️ Delete</button>
      </div>
    `;
    grid.appendChild(div);
  });

  grid.querySelectorAll("button[data-id]").forEach(b => b.onclick = async () => {
    if (confirm("फोटो डिलीट करें?")) {
      await deleteDoc(doc(db, "gallery_images", b.dataset.id));
      loadImages();
    }
  });
}

uploadBtn.onclick = () => fileInput.click();
fileInput.onchange = async (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  for (const file of files) {
    const caption = prompt(`"${file.name}" के लिए caption (optional):`, "");
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const res = await fetch(url, { method: "POST", body: fd });
      const data = await res.json();
      await addDoc(collection(db, "gallery_images"), {
        groupId, url: data.secure_url, caption, createdAt: serverTimestamp()
      });
    } catch (err) { alert("Error: " + err.message); }
  }
  fileInput.value = "";
  loadImages();
};

loadImages();