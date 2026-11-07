import { saveDoc, getDocData, showMsg } from "./admin-core.js";
async function load() {
  const d = await getDocData("settings", "theme");
  if (d) {
    document.getElementById("primary").value = d.primary || "#0a1f44";
    document.getElementById("accent").value = d.accent || "#ff9933";
    document.getElementById("bg").value = d.bg || "#f8f9fa";
    document.getElementById("text").value = d.text || "#212529";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save-btn").onclick = async () => {
    await saveDoc("settings", "theme", {
      primary: document.getElementById("primary").value,
      accent: document.getElementById("accent").value,
      bg: document.getElementById("bg").value,
      text: document.getElementById("text").value
    });
    showMsg(document.getElementById("msg"), "✅ Theme सेव!");
  };
});