import { getDocData, saveDoc, showMsg } from "./admin-core.js";

async function load() {
  const d = await getDocData("settings", "popups");
  if (d) {
    document.getElementById("p-title").value = d.title || "";
    document.getElementById("p-badge").value = d.badge || "";
    document.getElementById("p-body").value = d.body || "";
    document.getElementById("p-image").value = d.image || "";
    document.getElementById("p-active").checked = !!d.active;
  }
}

document.getElementById("save-btn").onclick = async () => {
  await saveDoc("settings", "popups", {
    title: document.getElementById("p-title").value,
    badge: document.getElementById("p-badge").value,
    body: document.getElementById("p-body").value,
    image: document.getElementById("p-image").value,
    active: document.getElementById("p-active").checked
  });
  showMsg(document.getElementById("msg"), "✅ Popup सेव!");
};

document.getElementById("clear-btn").onclick = () => {
  document.getElementById("p-title").value = "";
  document.getElementById("p-badge").value = "";
  document.getElementById("p-body").value = "";
  document.getElementById("p-image").value = "";
  document.getElementById("p-active").checked = false;
};

load();