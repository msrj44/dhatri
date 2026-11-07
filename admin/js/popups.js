import { saveDoc, getDocData, showMsg } from "./admin-core.js";
async function load() {
  const d = await getDocData("settings", "popups");
  if (d) {
    document.getElementById("popup-active").checked = !!d.active;
    document.getElementById("popup-title").value = d.title || "";
    document.getElementById("popup-message").value = d.message || "";
    document.getElementById("popup-image").value = d.image || "";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save-btn").onclick = async () => {
    await saveDoc("settings", "popups", {
      active: document.getElementById("popup-active").checked,
      title: document.getElementById("popup-title").value,
      message: document.getElementById("popup-message").value,
      image: document.getElementById("popup-image").value
    });
    showMsg(document.getElementById("msg"), "✅ Popup सेव!");
  };
});