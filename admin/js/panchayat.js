import { saveDoc, getDocData, showMsg } from "./admin-core.js";
async function load() {
  const d = await getDocData("site_content", "panchayat");
  if (d) {
    document.getElementById("sarpanch").value = d.sarpanch || "Rampratap";
    document.getElementById("vdo").value = d.vdo || "";
    document.getElementById("secretary").value = d.secretary || "";
  }
}
document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save-btn").onclick = async () => {
    await saveDoc("site_content", "panchayat", {
      sarpanch: document.getElementById("sarpanch").value,
      vdo: document.getElementById("vdo").value,
      secretary: document.getElementById("secretary").value
    });
    showMsg(document.getElementById("msg"), "✅ Panchayat सेव!");
  };
});