/**
 * lists.js – Restaurant and todo list tab logic
 */

function filterByTag(tag) {
  const filterInput = document.getElementById("restaurant-filter");
  if (filterInput) {
    filterInput.value = tag;
    renderLists();
  }
}

function clearRestaurantFilter() {
  const filterInput = document.getElementById("restaurant-filter");
  if (filterInput) {
    filterInput.value = "";
    renderLists();
  }
}

function renderLists() {
  const rList = document.getElementById("restaurant-list");
  const filterText = (
    (document.getElementById("restaurant-filter") &&
      document.getElementById("restaurant-filter").value) || ""
  ).toLowerCase().trim();

  if (tripData && tripData.lists && Array.isArray(tripData.lists.restaurants)) {
    const allTags = new Set();
    tripData.lists.restaurants.forEach((r) => {
      if (r.tags && Array.isArray(r.tags)) r.tags.forEach((tag) => allTags.add(tag));
    });

    const tagsContainer = document.getElementById("restaurant-tags");
    if (tagsContainer && allTags.size > 0) {
      tagsContainer.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:6px; padding:12px; background:#f8fafc; border-radius:8px">
          <small style="color:var(--text-light); width:100%; margin-bottom:4px">快速篩選：</small>
          ${Array.from(allTags).sort().map(
          (tag) => `<span class="badge" style="background:#e0e7ff; color:#3730a3; cursor:pointer; padding:4px 10px" onclick="filterByTag('${tag.replace(/'/g, "\\'")}')">${tag}</span>`
        ).join("")}
        </div>
      `;
    }

    const items = tripData.lists.restaurants.filter((r) => {
      if (!filterText) return true;
      const hay = `${r.name || ""} ${r.area || r.station || ""} ${(r.tags || []).join(" ")}`.toLowerCase();
      return hay.indexOf(filterText) !== -1;
    });

    rList.innerHTML = items.map((r) => {
      const location = r.area || r.station || "";
      const mapLink = r.link || r.url || r.map ||
        `https://www.google.com/search?q=${encodeURIComponent((r.name || "") + " " + location)}`;
      const tagsHtml = (r.tags || []).map(
        (t) => `<span class="badge" style="background:#fef3c7; color:#92400e; cursor:pointer" onclick="filterByTag('${t.replace(/'/g, "\\'")}')">${t}</span>`
      ).join("");
      return `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start">
            <div style="flex:1">
              <strong>${r.name}</strong>
              ${location ? `<div style="font-size:0.75em; color:var(--text-light); margin-top:2px">📍 ${location}</div>` : ""}
              ${r.hours ? `<div style="font-size:0.75em; color:var(--text-light); margin-top:2px">🕒 ${r.hours}</div>` : ""}
              ${r.priceRangeJPY ? `<div style="font-size:0.75em; color:var(--text-light); margin-top:2px">💴 ¥${r.priceRangeJPY}</div>` : ""}
            </div>
            <div style="display:flex; gap:6px; align-items:center">
              <a class="btn" style="background:#eee; color:#000; padding:6px; text-decoration:none; min-width:32px; height:32px; justify-content:center" href="${mapLink}" target="_blank" title="地圖/搜尋">
                <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </a>
            </div>
          </div>
          <div class="tag-row">${tagsHtml}</div>
          <div style="font-size:0.81em; margin-top:4px">${r.note || ""}</div>
        </div>
      `;
    }).join("");
  } else if (rList) {
    rList.innerHTML = '<div style="color:var(--text-light);">無餐廳/店家清單資料。</div>';
  }

  const tList = document.getElementById("todo-list");
  const todoFilter = (
    (document.getElementById("todo-filter") && document.getElementById("todo-filter").value) || ""
  ).toLowerCase().trim();

  if (tripData && tripData.lists && Array.isArray(tripData.lists.todos)) {
    const todos = tripData.lists.todos.filter((t) => {
      if (!todoFilter) return true;
      if (typeof t === "string") return t.toLowerCase().indexOf(todoFilter) !== -1;
      const hay = `${t.title || t.name || ""} ${t.note || ""}`.toLowerCase();
      return hay.indexOf(todoFilter) !== -1;
    });
    tList.innerHTML = todos.map((t) => `
      <div class="card" style="padding:10px 16px; display:flex; gap:8px; align-items:center">
        <input type="checkbox"> <span>${typeof t === "string" ? t : t.title || t.name || ""}</span>
      </div>
    `).join("");
  } else if (tList) {
    tList.innerHTML = '<div style="color:var(--text-light);">無待辦/購物清單。</div>';
  }
}
