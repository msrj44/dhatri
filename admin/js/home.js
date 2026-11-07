import { saveDoc, getDocData, showMsg } from "./admin-core.js";

async function load() {
  const data = await getDocData("site_content", "home");
  if (!data) return;
  document.getElementById("home-title").value = data.title || "";
  document.getElementById("home-intro").value = data.intro || "";
}

document.addEventListener("DOMContentLoaded", () => {
  load();
  document.getElementById("save-btn").onclick = async () => {
    const title = document.getElementById("home-title").value;
    const intro = document.getElementById("home-intro").value;
    await saveDoc("site_content", "home", { title, intro });
    showMsg(document.getElementById("msg"), "✅ होम पेज सेव हो गया!");
  };
});