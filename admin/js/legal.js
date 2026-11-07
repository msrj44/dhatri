import { getDocData, saveDoc, showMsg } from "./admin-core.js";

async function load() {
  for (const key of ["privacy", "terms", "disclaimer"]) {
    const d = await getDocData("pages", key);
    if (d && d.content) document.getElementById(key).value = d.content;
  }
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => { b.classList.remove("active"); b.style.background = "#e2e8f0"; b.style.color = "#475569"; });
    btn.classList.add("active"); btn.style.background = "var(--primary)"; btn.style.color = "#fff";
    document.querySelectorAll("#tab-privacy, #tab-terms, #tab-disclaimer").forEach(el => el.style.display = "none");
    document.getElementById("tab-" + btn.dataset.tab).style.display = "block";
  };
});

document.getElementById("save-btn").onclick = async () => {
  for (const key of ["privacy", "terms", "disclaimer"]) {
    await saveDoc("pages", key, { content: document.getElementById(key).value });
  }
  showMsg(document.getElementById("msg"), "✅ Legal pages सेव!");
};

load();