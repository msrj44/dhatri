import { saveDoc, getDocData, showMsg } from "./admin-core.js";
async function load() {
  for (const key of ["privacy", "terms", "disclaimer"]) {
    const d = await getDocData("pages", key);
    if (d && d.content) document.getElementById(key).value = d.content;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save-btn").onclick = async () => {
    for (const key of ["privacy", "terms", "disclaimer"]) {
      await saveDoc("pages", key, { content: document.getElementById(key).value });
    }
    showMsg(document.getElementById("msg"), "✅ Legal pages सेव!");
  };
});