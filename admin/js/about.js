import { saveDoc, getDocData, showMsg } from "./admin-core.js";
async function load() {
  const d = await getDocData("site_content", "about");
  if (d) { document.getElementById("about-history").value = d.history || ""; document.getElementById("about-extra").value = d.extra || ""; }
}
document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save-btn").onclick = async () => {
    await saveDoc("site_content", "about", {
      history: document.getElementById("about-history").value,
      extra: document.getElementById("about-extra").value
    });
    showMsg(document.getElementById("msg"), "✅ About सेव!");
  };
});