import { getDocData, saveDoc, showMsg } from "./admin-core.js";

let officials = [];
const list = document.getElementById("officials-list");

async function load() {
  const d = await getDocData("site_content", "panchayat");
  officials = (d && d.officials) ? d.officials : [
    { name: "Rampratap", role: "सरपंच", phone: "" },
    { name: "", role: "ग्राम विकास अधिकारी", phone: "" },
    { name: "", role: "पंचायत सचिव", phone: "" }
  ];
  renderOfficials();
}

function renderOfficials() {
  list.innerHTML = "";
  officials.forEach((o, i) => {
    const div = document.createElement("div");
    div.className = "builder-row";
    div.innerHTML = `
      <input type="text" placeholder="Name" value="${o.name || ''}" data-i="${i}" data-field="name" />
      <input type="text" placeholder="Role / पद" value="${o.role || ''}" data-i="${i}" data-field="role" />
      <input type="text" placeholder="Phone (optional)" value="${o.phone || ''}" data-i="${i}" data-field="phone" />
      <button class="btn btn-danger btn-sm" data-i="${i}">✕</button>
    `;
    div.querySelector(".btn-danger").onclick = () => { officials.splice(i, 1); renderOfficials(); };
    div.querySelectorAll("input").forEach(inp => {
      inp.oninput = () => { officials[parseInt(inp.dataset.i)][inp.dataset.field] = inp.value; };
    });
    list.appendChild(div);
  });
}

document.getElementById("add-official-btn").onclick = () => {
  officials.push({ name: "", role: "", phone: "" }); renderOfficials();
};

document.getElementById("save-btn").onclick = async () => {
  await saveDoc("site_content", "panchayat", { officials });
  showMsg(document.getElementById("save-status"), "✅ सेव हो गया!");
};

load();