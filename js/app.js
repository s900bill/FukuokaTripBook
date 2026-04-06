/**
 * app.js – Core application logic
 * Manages trip data loading, header, summary, overview rendering, and tab switching.
 */

let tripData = null;
let currentDay = 1;
let currentPlan = "A";
let showMentaiko = "all"; // 'mentaiko' | 'no-mentaiko' | 'all'
const isAdmin =
  new URLSearchParams(window.location.search).get("admin") === "1";

// 字體大小設定
const FONT_SIZE_KEY = "fukuoka-trip-font-size";

function setFontSize(size) {
  document.body.classList.remove("font-large", "font-xlarge");
  if (size === "large") document.body.classList.add("font-large");
  else if (size === "xlarge") document.body.classList.add("font-xlarge");

  document.querySelectorAll(".font-control button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById("font-" + size).classList.add("active");
  localStorage.setItem(FONT_SIZE_KEY, size);
}

function loadFontSize() {
  const savedSize = localStorage.getItem(FONT_SIZE_KEY) || "normal";
  setFontSize(savedSize);
}

// UI Utilities
function switchTab(tabId, el) {
  document.querySelectorAll(".tab-view").forEach((t) => t.classList.add("hidden"));
  document.getElementById("tab-" + tabId).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  el.classList.add("active");
  window.scrollTo(0, 0);
}

// Data Loading
async function loadTrip() {
  try {
    const res = await fetch("./trip.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    initApp(data);
    return;
  } catch (e) {
    console.warn("Failed to fetch ./trip.json —", e);
  }

  try {
    const res2 = await fetch("./trip.sample.json");
    if (res2.ok) {
      const data2 = await res2.json();
      console.info("Loaded fallback ./trip.sample.json");
      initApp(data2);
      return;
    }
  } catch (e2) {
    console.warn("Failed to fetch ./trip.sample.json —", e2);
  }

  document.getElementById("error-ui").classList.remove("hidden");
}

document.getElementById("file-input").onchange = (e) =>
  handleFile(e.target.files[0]);

function handleFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      initApp(data);
      document.getElementById("error-ui").classList.add("hidden");
    } catch (err) {
      alert("JSON 格式錯誤");
    }
  };
  reader.readAsText(file);
}

function initApp(data) {
  tripData = data;
  renderHeader();
  renderSummary();
  renderOverview();
  renderDayPills();
  renderLists();

  if (isAdmin) {
    const adminNavItem = document.createElement("a");
    adminNavItem.className = "nav-item";
    adminNavItem.onclick = function () { switchTab("admin", this); };
    adminNavItem.innerHTML =
      '<svg viewBox="0 0 24 24" class="icon"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.24 2 14 2h-4c-.24 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.40 1.08.73 1.69.98l.38 2.65c.04.24.26.42.5.42h4c.24 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>管理';
    document.querySelector(".bottom-nav").appendChild(adminNavItem);
  }

  currentDay = 1;
  const toggleBtn = document.getElementById("btn-mentaiko-toggle");
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      if (showMentaiko === "all") {
        showMentaiko = "mentaiko";
        toggleBtn.innerText = "🌶️ 明太子派";
      } else if (showMentaiko === "mentaiko") {
        showMentaiko = "no-mentaiko";
        toggleBtn.innerText = "🚫 不明太子派";
      } else {
        showMentaiko = "all";
        toggleBtn.innerText = "🍽️ 全部顯示";
      }
      renderDayDetail();
    };
  }
  renderDayDetail();

  // Init expense module with trip members
  if (typeof initExpense === "function") {
    const members = (data.meta && data.meta.people && data.meta.people.groups)
      ? extractMemberNames(data.meta.people.groups, data.meta.people.total)
      : ["Bill", "Amy", "Dad", "Mom", "P5", "P6", "P7", "P8"];
    initExpense(members);
  }
}

function extractMemberNames(groups, total) {
  // Try to parse member names from groups array like ["父母×2(約60歲)", "姐弟×2(約30歲)"]
  // Fall back to generic names
  const defaults = [];
  for (let i = 1; i <= (total || 8); i++) defaults.push("成員" + i);
  return defaults;
}

function renderHeader() {
  const title =
    (tripData.meta && (tripData.meta.title || tripData.meta.destination)) ||
    "未命名行程";
  document.getElementById("trip-title").innerText = title;

  let dates = "";
  if (tripData.meta) {
    if (typeof tripData.meta.dateRange === "string")
      dates = tripData.meta.dateRange;
    else if (tripData.meta.dateRange && tripData.meta.dateRange.start)
      dates = `${tripData.meta.dateRange.start} → ${tripData.meta.dateRange.end || ""}`;
    else if (tripData.meta.createdAt) dates = tripData.meta.createdAt;
  }
  document.getElementById("trip-dates").innerText = dates || "--";
}

function renderSummary() {
  document.getElementById("meta-notes").innerHTML = `
    📌 參加本次旅行，即視為同意以下條款：<br>
    不說「好累」、不問「還要多久」、不對行程提出異議。<br><br>
    📌 本行程一經參與，代表你已簽署：<br>
    快樂出門條款、隨遇而安條款、笑著回家條款。<br><br>
    📌 報名即同意：<br>
    行程怎麼走都說「好」，吃什麼都說「可以」。
  `;
  const grid = document.getElementById("summary-cards");

  const stayName = (tripData.stay && tripData.stay.name) || "無住宿資料";
  const stayAddress = (tripData.stay && tripData.stay.address) || "";
  const checkIn = (tripData.stay && tripData.stay.checkIn) || "";
  const checkOut = (tripData.stay && tripData.stay.checkOut) || "";
  const navLink = stayAddress
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(stayAddress + " " + stayName)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stayName)}`;

  let outboundFlight = "無航班資料", outboundTime = "", outboundAirport = "", outboundTerminal = "", outboundNavLink = "";
  let inboundFlight = "無航班資料", inboundTime = "", inboundAirport = "", inboundTerminal = "", inboundNavLink = "";

  if (tripData.flights) {
    if (typeof tripData.flights.outbound === "string") {
      outboundFlight = tripData.flights.outbound;
    } else if (tripData.flights.outbound && tripData.flights.outbound.flightNo) {
      const ob = tripData.flights.outbound;
      outboundFlight = ob.flightNo;
      const depart = ob.depart ? new Date(ob.depart).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }) : "";
      const arrive = ob.arrive ? new Date(ob.arrive).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }) : "";
      if (depart && arrive) outboundTime = `${depart}-${arrive}`;
      outboundAirport = ob.departAirport || "";
      outboundTerminal = ob.departTerminal || "";
      if (outboundAirport) outboundNavLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(outboundAirport)}`;
    }

    if (typeof tripData.flights.inbound === "string") {
      inboundFlight = tripData.flights.inbound;
    } else if (tripData.flights.inbound && tripData.flights.inbound.flightNo) {
      const ib = tripData.flights.inbound;
      inboundFlight = ib.flightNo;
      const depart = ib.depart ? new Date(ib.depart).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }) : "";
      const arrive = ib.arrive ? new Date(ib.arrive).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }) : "";
      if (depart && arrive) inboundTime = `${depart}-${arrive}`;
      inboundAirport = ib.departAirport || "";
      inboundTerminal = ib.departTerminal || "";
      if (inboundAirport) inboundNavLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(inboundAirport)}`;
    }
  }

  grid.innerHTML = `
    <div style="display:grid; gap:12px">
      <div class="card" style="margin:0; background:#e0f2fe; box-shadow:none">
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
          <div style="flex:1">
            <small style="color:#0369a1; font-weight:600">✈️ 去程航班</small><br>
            <strong style="font-size:1em">${outboundFlight}</strong>
            ${outboundTime ? `<div style="font-size:0.81em; color:var(--text-light); margin-top:2px">${outboundTime}</div>` : ""}
            ${outboundAirport ? `<div style="font-size:0.75em; color:var(--text-light); margin-top:4px">📍 ${outboundAirport} ${outboundTerminal}</div>` : ""}
          </div>
          ${outboundNavLink ? `<a href="${outboundNavLink}" target="_blank" style="background:#0284c7; color:white; padding:8px 12px; border-radius:8px; text-decoration:none; font-size:0.75em; white-space:nowrap; display:flex; align-items:center; gap:4px"><svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>導航</a>` : ""}
        </div>
      </div>
      <div class="card" style="margin:0; background:#fef3c7; box-shadow:none">
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
          <div style="flex:1">
            <small style="color:#92400e; font-weight:600">✈️ 回程航班</small><br>
            <strong style="font-size:1em">${inboundFlight}</strong>
            ${inboundTime ? `<div style="font-size:0.81em; color:var(--text-light); margin-top:2px">${inboundTime}</div>` : ""}
            ${inboundAirport ? `<div style="font-size:0.75em; color:var(--text-light); margin-top:4px">📍 ${inboundAirport} ${inboundTerminal}</div>` : ""}
          </div>
          ${inboundNavLink ? `<a href="${inboundNavLink}" target="_blank" style="background:#d97706; color:white; padding:8px 12px; border-radius:8px; text-decoration:none; font-size:0.75em; white-space:nowrap; display:flex; align-items:center; gap:4px"><svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>導航</a>` : ""}
        </div>
      </div>
      <div class="card" style="margin:0; background:#dcfce7; box-shadow:none">
        <div style="display:flex; justify-content:space-between; align-items:flex-start">
          <div style="flex:1">
            <small style="color:#166534; font-weight:600">🏨 住宿點</small><br>
            <strong style="font-size:1em">${stayName}</strong>
            ${checkIn || checkOut ? `<div style="font-size:0.75em; color:var(--text-light); margin-top:4px">入住 ${checkIn} / 退房 ${checkOut}</div>` : ""}
            ${stayAddress ? `<div style="font-size:0.75em; color:var(--text-light); margin-top:2px">📍${stayAddress}</div>` : ""}
          </div>
          <a href="${navLink}" target="_blank" style="background:#16a34a; color:white; padding:8px 12px; border-radius:8px; text-decoration:none; font-size:0.75em; white-space:nowrap; display:flex; align-items:center; gap:4px"><svg viewBox="0 0 24 24" style="width:16px; height:16px; fill:currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>導航</a>
        </div>
      </div>
    </div>
  `;
}

function renderOverview() {
  const list = document.getElementById("overview-list");
  const overview =
    tripData.overview ||
    (Array.isArray(tripData.days)
      ? tripData.days.map((d) => ({
        day: d.day || 0,
        weekday: d.weekday || "",
        theme: d.title || d.theme || "",
        areas: d.areas || d.area || "",
        walkLevel: d.walkLevel || "",
      }))
      : []);
  list.innerHTML = overview
    .map(
      (d) => `
      <div class="card flex" onclick="goToDay(${d.day})">
        <div style="width:50px; text-align:center; border-right:1px solid #eee; margin-right:8px">
          <div style="font-size:0.75em">Day</div>
          <div style="font-weight:bold; font-size:1.125em">${d.day}</div>
        </div>
        <div style="flex:1">
          <div class="between">
            <strong>${d.theme}</strong>
            <span class="badge">${d.weekday.split("(")[0]}</span>
          </div>
          <div style="font-size:0.81em; color:var(--text-light)">
            📍 ${Array.isArray(d.areas) ? d.areas.join(" | ") : d.areas} | 🚶 步行: ${d.walkLevel}
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

window.onload = function () {
  loadFontSize();
  loadTrip();
  loadChecklist();
  renderJapanese("greeting");
  initConverter();
};

// 註冊 Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log("Service Worker 註冊成功:", registration.scope);
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              if (confirm("有新版本可用！點擊確定更新頁面。")) {
                newWorker.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log("Service Worker 註冊失敗:", error);
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  });
}
