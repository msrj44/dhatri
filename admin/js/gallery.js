import { db, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../../firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { showMsg } from "./admin-core.js";

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(url, { method: "POST", body: fd });
  if (!res.ok) throw new Error("Cloudinary upload failed");
  return (await res.json()).secure_url;
}

async function loadImages() {
  const grid = document.getElementById("admin-gallery");
  const snap = await getDocs(collection(db, "gallery_images"));
  grid.innerHTML = "";
  snap.forEach(d => {
    const data = d.data();
    const div = document.createElement("div");
    div.style.cssText = "position:relative;background:#fff;padding:6px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);";
    div.innerHTML = `<img src="${data.url}" style="width:100%;height:140px;object-fit:cover;border-radius:6px;" /><button class="btn btn-sm btn-danger" style="position:absolute;top:8px;right:8px;" data-id="${d.id}">✕</button>`;
    grid.appendChild(div);
  });
  grid.querySelectorAll("button[data-id]").forEach(b => b.onclick = async () => {
    if (confirm("डिलीट करें?")) {
      await deleteDoc(doc(db, "gallery_images", b.dataset.id));
      loadImages();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadImages();
  document.getElementById("upload-btn").onclick = async () => {
    const file = document.getElementById("gallery-file").files[0];
    const caption = document.getElementById("gallery-caption").value;
    if (!file) return alert("फाइल चुनें");
    const msg = document.getElementById("msg");
    msg.textContent = "⏳ अपलोड हो रहा है...";
    try {
      const url = await uploadToCloudinary(file);
      await addDoc(collection(db, "gallery_images"), { url, caption, createdAt: serverTimestamp() });
      showMsg(msg, "✅ फोटो अपलोड हो गई!");
      document.getElementById("gallery-file").value = "";
      document.getElementById("gallery-caption").value = "";
      loadImages();
    } catch (e) { showMsg(msg, "❌ " + e.message, "error"); }
  };
});