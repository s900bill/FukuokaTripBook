/**
 * daily.js – Daily itinerary tab logic
 */

function renderDayPills() {
  const scroller = document.getElementById("day-scroller");
  const overview =
    tripData.overview ||
    (Array.isArray(tripData.days)
      ? tripData.days.map((d) => ({ day: d.day, weekday: d.weekday }))
      : []);
  scroller.innerHTML = overview
    .map(
      (d) => `
      <div class="day-pill ${d.day === currentDay ? "active" : ""}" onclick="selectDay(${d.day}, this)">
        Day ${d.day}<br><small style="font-size:0.625em">${d.weekday || ""}</small>
      </div>
    `
    )
    .join("");
}

function selectDay(day, el) {
  currentDay = day;
  document.querySelectorAll(".day-pill").forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  currentPlan = "A";
  renderDayDetail();
}

function goToDay(day) {
  currentDay = day;
  switchTab("daily", document.querySelectorAll(".nav-item")[1]);
  renderDayPills();
  renderDayDetail();
}

function switchPlan(plan) {
  currentPlan = plan;
  document.querySelectorAll("#plan-selector .selector-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", (idx === 0 && plan === "A") || (idx === 1 && plan === "B"));
  });
  renderDayDetail();
}

function renderDayDetail() {
  const content = document.getElementById("day-detail-content");
  let dayInfo = null;
  if (!tripData || !tripData.days) dayInfo = null;
  else if (Array.isArray(tripData.days)) {
    dayInfo =
      tripData.days.find((d) => d.day === currentDay) ||
      tripData.days[currentDay - 1];
  } else {
    dayInfo = tripData.days[currentDay] || tripData.days["" + currentDay];
  }

  if (!dayInfo) {
    content.innerHTML = '<p style="padding:20px; color:gray">此日期暫無詳細行程資料。</p>';
    return;
  }

  const blocks = dayInfo.plans || dayInfo.blocks || dayInfo.items || [];
  let hasPlanB = false;
  const normalizedItems = [];

  if (Array.isArray(blocks)) {
    for (const b of blocks) {
      if (b.plans && b.plans.B) hasPlanB = true;
      if (b.plans && (b.plans.A || b.plans.B)) {
        const pick = b.plans[currentPlan] || b.plans.A || b.plans.B;
        if (Array.isArray(pick)) {
          for (const p of pick) normalizedItems.push(Object.assign({}, p, { slot: b.slot || p.slot }));
        } else normalizedItems.push(Object.assign({}, pick, { slot: b.slot || (pick && pick.slot) }));
      } else {
        normalizedItems.push(Object.assign({}, b));
      }
    }
  } else if (dayInfo.plans && typeof dayInfo.plans === "object") {
    const arr = dayInfo.plans[currentPlan] || [];
    for (const it of arr) normalizedItems.push(Object.assign({}, it));
    hasPlanB = !!dayInfo.plans.B;
  }

  document.getElementById("btn-plan-b").classList.toggle("hidden", !hasPlanB);

  const filteredItems = normalizedItems.filter((item) => {
    if (showMentaiko === "all") return true;
    const tags = item.tags || [];
    const hasMentaiko = tags.includes("明太子派");
    const hasNoMentaiko = tags.includes("不明太子派");
    if (showMentaiko === "mentaiko") return hasMentaiko || (!hasMentaiko && !hasNoMentaiko);
    if (showMentaiko === "no-mentaiko") return hasNoMentaiko || (!hasMentaiko && !hasNoMentaiko);
    return true;
  });

  content.innerHTML = filteredItems
    .map(
      (item) => `
      <div class="timeline-item">
        <div class="item-time">${item.timeStart || item.slot || ""}</div>
        <div class="card" style="margin-bottom:0">
          <div class="item-title">${item.name || item.title || ""}</div>
          ${item.area ? `<div class="item-meta">📍 ${item.area}</div>` : ""}
          ${item.transport ? `<div class="item-meta">🚌 ${item.transport}</div>` : ""}
          ${item.notes ? `<div style="font-size:0.88em; margin-top:8px; border-left:3px solid #eee; padding-left:8px; color:var(--text-light)">${item.notes}</div>` : ""}
          ${item.link ? `<button class="btn" onclick="window.open('${item.link}')" style="margin-top:10px; font-size:0.75em; background:#eee">Google Maps</button>` : ""}
          <div class="tag-row">
            ${(item.tags || []).map((t) => `<span class="badge">${t}</span>`).join("")}
          </div>
        </div>
      </div>
    `
    )
    .join("");
}
