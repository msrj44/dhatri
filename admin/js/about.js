import { getDocData, saveDoc, showMsg } from "./admin-core.js";

let sections = [];
let editingIndex = -1;
let currentType = "table";

const listEl = document.getElementById("sections-list");
const modal = document.getElementById("section-modal");
const modalTitle = document.getElementById("modal-title");
const secTitle = document.getElementById("sec-title");
const builderArea = document.getElementById("builder-area");
const builderRows = document.getElementById("builder-rows");
const htmlArea = document.getElementById("html-area");
const secHtml = document.getElementById("sec-html");

async function load() {
  const d = await getDocData("site_content", "about_sections");
  sections = d && d.sections ? d.sections : [];
  renderSections();
}

function renderSections() {
  listEl.innerHTML = "";
  if (sections.length === 0) {
    listEl.innerHTML = `<div class="admin-card" style="text-align:center; color:#64748b; border-left-color:#cbd5e0;">अभी कोई section नहीं है। नीचे से जोड़ें।</div>`;
    return;
  }
  sections.forEach((sec, i) => {
    const div = document.createElement("div");
    div.className = "admin-card";
    div.style.display = "flex"; div.style.justifyContent = "space-between"; div.style.alignItems = "center";
    let typeLabel = sec.type.toUpperCase();
    let badgeColor = sec.type === "table" ? "#3b82f6" : sec.type === "list" ? "#10b981" : sec.type === "cards" ? "#ec4899" : "#8b5cf6";
    
    div.innerHTML = `
      <div>
        <h3 style="margin-bottom:0.4rem;">${sec.title || "(No Title)"}</h3>
        <span style="background:${badgeColor}20; color:${badgeColor}; padding:0.2rem 0.6rem; border-radius:20px; font-size:0.75rem; font-weight:600;">${typeLabel}</span>
        <span style="color:#94a3b8; font-size:0.8rem; margin-left:0.5rem;">Order: ${i+1}</span>
      </div>
      <div style="display:flex; gap:0.5rem;">
        <button class="btn btn-primary btn-sm edit-btn" data-i="${i}">✏️</button>
        <button class="btn btn-danger btn-sm del-btn" data-i="${i}">🗑️</button>
      </div>
    `;
    listEl.appendChild(div);
  });

  document.querySelectorAll(".edit-btn").forEach(b => b.onclick = () => openModal(parseInt(b.dataset.i)));
  document.querySelectorAll(".del-btn").forEach(b => b.onclick = () => deleteSection(parseInt(b.dataset.i)));
}

function deleteSection(i) {
  if (confirm("क्या आप इस section को डिलीट करना चाहते हैं?")) {
    sections.splice(i, 1); saveAll(); renderSections();
  }
}

document.getElementById("add-section-btn").onclick = () => openModal(-1);

function openModal(index) {
  editingIndex = index;
  modal.classList.add("open");
  
  if (index >= 0) {
    const sec = sections[index];
    modalTitle.textContent = "Edit Section";
    secTitle.value = sec.title || "";
    setType(sec.type);
    if (sec.type === "html") { secHtml.value = sec.html || ""; }
    else {
      builderRows.innerHTML = "";
      (sec.rows || []).forEach(r => addBuilderRow(r.col1 || "", r.col2 || "", r.col3 || ""));
    }
  } else {
    modalTitle.textContent = "Add New Section";
    secTitle.value = ""; setType("table"); builderRows.innerHTML = ""; secHtml.value = "";
  }
}

function setType(t) {
  currentType = t;
  document.querySelectorAll(".type-card").forEach(c => c.classList.toggle("active", c.dataset.type === t));
  if (t === "html") { builderArea.style.display = "none"; htmlArea.style.display = "block"; }
  else {
    builderArea.style.display = "block"; htmlArea.style.display = "none";
    const label = document.querySelector("#builder-area > label");
    if (t === "table") label.textContent = "Rows (Label | Value)";
    else if (t === "list") label.textContent = "Items (Name | Extra)";
    else if (t === "cards") label.textContent = "Cards (Icon | Title | Subtitle)";
    if (builderRows.children.length === 0) addBuilderRow();
  }
}

document.querySelectorAll(".type-card").forEach(c => c.onclick = () => setType(c.dataset.type));

function addBuilderRow(col1 = "", col2 = "", col3 = "") {
  const row = document.createElement("div"); row.className = "builder-row";
  if (currentType === "table" || currentType === "list") {
    row.innerHTML = `<input type="text" placeholder="${currentType === 'table' ? 'Label' : 'Name'}" value="${col1}" /><input type="text" placeholder="${currentType === 'table' ? 'Value' : 'Extra'}" value="${col2}" /><button class="btn btn-danger btn-sm">✕</button>`;
  } else if (currentType === "cards") {
    row.innerHTML = `<input type="text" placeholder="Icon" value="${col1}" style="max-width:80px;" /><input type="text" placeholder="Title" value="${col2}" /><input type="text" placeholder="Subtitle" value="${col3}" /><button class="btn btn-danger btn-sm">✕</button>`;
  }
  row.querySelector(".btn-danger").onclick = () => row.remove();
  builderRows.appendChild(row);
}

document.getElementById("add-row-btn").onclick = () => addBuilderRow();
function closeModal() { modal.classList.remove("open"); }
document.getElementById("modal-close").onclick = closeModal;
document.getElementById("modal-cancel").onclick = closeModal;

document.getElementById("modal-save").onclick = () => {
  const title = secTitle.value.trim() || "(Untitled)";
  let sec = { title, type: currentType };
  if (currentType === "html") { sec.html = secHtml.value; }
  else {
    sec.rows = [];
    builderRows.querySelectorAll(".builder-row").forEach(r => {
      const inputs = r.querySelectorAll("input");
      if (currentType === "cards") sec.rows.push({ col1: inputs[0].value, col2: inputs[1].value, col3: inputs[2].value });
      else sec.rows.push({ col1: inputs[0].value, col2: inputs[1].value });
    });
  }
  if (editingIndex >= 0) sections[editingIndex] = sec;
  else sections.push(sec);
  closeModal(); renderSections(); saveAll();
};

async function saveAll() {
  const statusEl = document.getElementById("save-status");
  statusEl.textContent = "⏳ Saving...";
  try { await saveDoc("site_content", "about_sections", { sections }); statusEl.textContent = "✅ सब changes save हो चुके हैं"; }
  catch (e) { statusEl.textContent = "❌ Error: " + e.message; }
}
document.getElementById("save-all-btn").onclick = saveAll;

load();