/**
 * expense.js – Multi-user trip expense tracking with Firebase Realtime Database
 *
 * HOW TO SETUP FIREBASE (one-time):
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (free Spark plan)
 * 3. Click "Realtime Database" → "Create Database" → Start in test mode
 * 4. Go to Project Settings → Your apps → Add web app
 * 5. Copy the firebaseConfig object and paste it below, replacing the placeholder values
 * 6. Done! All 8 members sharing the same URL will see the same expense list in real-time.
 */

// ============================================================
//  🔧 FIREBASE CONFIG – Replace with your own values
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSy_REPLACE_ME",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};
// ============================================================

const EXPENSE_LOCAL_KEY = "fukuoka-expenses-local";
const EXPENSE_RATE_KEY = "fukuoka-rate";

let expenseMembers = ["Bill", "Amy", "Dad", "Mom", "Kate", "Tom", "Liz", "Ray"];
let expenses = []; // [{id, date, desc, amountJPY, paidBy, splitWith, category}]
let firebaseDB = null;
let expenseRef = null;
let isFirebaseConnected = false;

// Category definitions
const EXPENSE_CATEGORIES = [
  { key: "food", emoji: "🍽", label: "餐飲" },
  { key: "transport", emoji: "🚌", label: "交通" },
  { key: "ticket", emoji: "🎫", label: "門票" },
  { key: "shopping", emoji: "🛍", label: "購物" },
  { key: "hotel", emoji: "🏨", label: "住宿" },
  { key: "medical", emoji: "💊", label: "藥品" },
  { key: "other", emoji: "💰", label: "其他" },
];

function getCatEmoji(key) {
  const cat = EXPENSE_CATEGORIES.find((c) => c.key === key);
  return cat ? cat.emoji : "💰";
}

// ──────────────────────────────────────────────
//  Init
// ──────────────────────────────────────────────
function initExpense(members) {
  if (members && members.length > 0) expenseMembers = members;
  tryInitFirebase();
  renderExpensePage();
}

function tryInitFirebase() {
  try {
    // Check if Firebase SDK is loaded and config is real (not placeholder)
    if (
      typeof firebase === "undefined" ||
      FIREBASE_CONFIG.apiKey.includes("REPLACE_ME") ||
      FIREBASE_CONFIG.databaseURL.includes("your-project")
    ) {
      console.info("[Expense] Firebase not configured, using localStorage.");
      loadExpensesLocal();
      updateFirebaseStatusBadge("offline");
      return;
    }

    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    firebaseDB = firebase.database();
    expenseRef = firebaseDB.ref("fukuoka-trip/expenses");
    updateFirebaseStatusBadge("connecting");

    // Real-time listener
    expenseRef.on("value", (snapshot) => {
      const val = snapshot.val();
      expenses = val ? Object.values(val) : [];
      expenses.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
      isFirebaseConnected = true;
      updateFirebaseStatusBadge("online");
      renderExpenseList();
      renderSettlement();
      renderExpenseSummaryBar();
    });

  } catch (err) {
    console.error("[Expense] Firebase init error:", err);
    loadExpensesLocal();
    updateFirebaseStatusBadge("offline");
  }
}

function updateFirebaseStatusBadge(status) {
  const badge = document.getElementById("firebase-status-badge");
  if (!badge) return;
  if (status === "online") {
    badge.textContent = "🟢 Firebase 已連線";
    badge.className = "firebase-status";
  } else if (status === "connecting") {
    badge.textContent = "🟡 連線中…";
    badge.className = "firebase-status connecting";
  } else {
    badge.textContent = "🔴 離線模式";
    badge.className = "firebase-status offline";
  }
}

// ──────────────────────────────────────────────
//  Local storage fallback
// ──────────────────────────────────────────────
function loadExpensesLocal() {
  const saved = localStorage.getItem(EXPENSE_LOCAL_KEY);
  expenses = saved ? JSON.parse(saved) : [];
  renderExpenseList();
  renderSettlement();
  renderExpenseSummaryBar();
}

function saveExpensesLocal() {
  localStorage.setItem(EXPENSE_LOCAL_KEY, JSON.stringify(expenses));
}

// ──────────────────────────────────────────────
//  CRUD
// ──────────────────────────────────────────────
function addExpense(expData) {
  const rate = parseFloat(localStorage.getItem(EXPENSE_RATE_KEY)) || 0.22;
  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: expData.date,
    desc: expData.desc,
    amountJPY: expData.amountJPY,
    amountTWD: Math.round(expData.amountJPY * rate),
    paidBy: expData.paidBy,
    splitWith: expData.splitWith,
    category: expData.category || "other",
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConnected && expenseRef) {
    expenseRef.child(record.id).set(record);
  } else {
    expenses.push(record);
    expenses.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
    saveExpensesLocal();
    renderExpenseList();
    renderSettlement();
    renderExpenseSummaryBar();
  }
}

function deleteExpense(id) {
  if (!confirm("確定要刪除這筆記錄嗎？")) return;
  if (isFirebaseConnected && expenseRef) {
    expenseRef.child(id).remove();
  } else {
    expenses = expenses.filter((e) => e.id !== id);
    saveExpensesLocal();
    renderExpenseList();
    renderSettlement();
    renderExpenseSummaryBar();
  }
}

// ──────────────────────────────────────────────
//  Render: Summary Bar
// ──────────────────────────────────────────────
function renderExpenseSummaryBar() {
  const bar = document.getElementById("expense-summary-bar");
  if (!bar) return;
  const totalJPY = expenses.reduce((s, e) => s + (e.amountJPY || 0), 0);
  const totalTWD = expenses.reduce((s, e) => s + (e.amountTWD || 0), 0);
  const perPerson = expenseMembers.length > 0 ? Math.round(totalJPY / expenseMembers.length) : 0;
  bar.innerHTML = `
    <div class="expense-summary-item">
      <div class="label">總花費</div>
      <div class="value">¥${totalJPY.toLocaleString()}</div>
    </div>
    <div class="expense-summary-item">
      <div class="label">換算台幣</div>
      <div class="value">NT$${totalTWD.toLocaleString()}</div>
    </div>
    <div class="expense-summary-item">
      <div class="label">人均花費</div>
      <div class="value">¥${perPerson.toLocaleString()}</div>
    </div>
  `;
}

// ──────────────────────────────────────────────
//  Render: Expense List
// ──────────────────────────────────────────────
function renderExpenseList() {
  const container = document.getElementById("expense-list-container");
  if (!container) return;

  if (expenses.length === 0) {
    container.innerHTML = '<div style="text-align:center; color:var(--text-light); padding:40px 0">還沒有任何記錄，點 ＋ 新增第一筆！</div>';
    return;
  }

  // Group by date
  const groups = {};
  expenses.forEach((e) => {
    if (!groups[e.date]) groups[e.date] = [];
    groups[e.date].push(e);
  });

  let html = "";
  Object.keys(groups).sort().forEach((date) => {
    const dateObj = new Date(date);
    const dayStr = dateObj.toLocaleDateString("zh-TW", { month: "numeric", day: "numeric", weekday: "short" });
    const dayTotal = groups[date].reduce((s, e) => s + (e.amountJPY || 0), 0);
    html += `<div class="expense-day-header">${dayStr} &nbsp;·&nbsp; 小計 ¥${dayTotal.toLocaleString()}</div>`;
    groups[date].forEach((e) => {
      const splitStr = e.splitWith && e.splitWith.length > 0
        ? `${e.paidBy} 付 · ${e.splitWith.length}人均攤`
        : `${e.paidBy} 付`;
      html += `
        <div class="expense-item">
          <div class="expense-item-emoji">${getCatEmoji(e.category)}</div>
          <div class="expense-item-body">
            <div class="expense-item-title">${e.desc}</div>
            <div class="expense-item-meta">${splitStr}</div>
          </div>
          <div class="expense-item-amount">
            <div class="expense-item-jpy">¥${(e.amountJPY || 0).toLocaleString()}</div>
            <div class="expense-item-twd">NT$${(e.amountTWD || 0).toLocaleString()}</div>
          </div>
          <button class="delete-btn" onclick="deleteExpense('${e.id}')" title="刪除">✕</button>
        </div>
      `;
    });
  });
  container.innerHTML = html;
}

// ──────────────────────────────────────────────
//  Render: Settlement
// ──────────────────────────────────────────────
function renderSettlement() {
  const container = document.getElementById("expense-settlement-container");
  if (!container) return;

  if (expenses.length === 0) {
    container.innerHTML = '<div style="color:var(--text-light); font-size:0.88em">新增帳目後自動計算結清方式</div>';
    return;
  }

  // Calculate each person's net balance
  const balance = {};
  expenseMembers.forEach((m) => (balance[m] = 0));

  expenses.forEach((e) => {
    const splitCount = e.splitWith ? e.splitWith.length : expenseMembers.length;
    if (splitCount === 0) return;
    const shareJPY = (e.amountJPY || 0) / splitCount;

    // Payer gets credit
    if (balance[e.paidBy] !== undefined) balance[e.paidBy] += e.amountJPY || 0;

    // Each participant owes their share
    (e.splitWith || expenseMembers).forEach((member) => {
      if (balance[member] !== undefined) balance[member] -= shareJPY;
    });
  });

  // Settle with minimum transactions
  const transactions = settleMinTransactions(balance);

  if (transactions.length === 0) {
    container.innerHTML = '<div style="color:#16a34a; font-size:0.88em; text-align:center; padding:8px">✅ 已全部結清！</div>';
    return;
  }

  const rate = parseFloat(localStorage.getItem(EXPENSE_RATE_KEY)) || 0.22;
  container.innerHTML = transactions.map((t) => `
    <div class="settlement-card">
      <div class="settlement-transfer">
        <span style="font-weight:600">${t.from}</span>
        <span style="color:var(--text-light)">→</span>
        <span style="font-weight:600">${t.to}</span>
      </div>
      <div class="settlement-amount">
        ¥${Math.round(t.amount).toLocaleString()}
        <div style="font-size:0.75em; color:var(--text-light)">NT$${Math.round(t.amount * rate).toLocaleString()}</div>
      </div>
    </div>
  `).join("");
}

/** Minimum transactions settlement algorithm */
function settleMinTransactions(balanceMap) {
  const creditors = [], debtors = [];
  Object.entries(balanceMap).forEach(([person, bal]) => {
    const rounded = Math.round(bal);
    if (rounded > 0) creditors.push({ person, amount: rounded });
    else if (rounded < 0) debtors.push({ person, amount: -rounded });
  });

  const transactions = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const credit = creditors[i];
    const debt = debtors[j];
    const amount = Math.min(credit.amount, debt.amount);
    transactions.push({ from: debt.person, to: credit.person, amount });
    credit.amount -= amount;
    debt.amount -= amount;
    if (credit.amount === 0) i++;
    if (debt.amount === 0) j++;
  }
  return transactions;
}

// ──────────────────────────────────────────────
//  Render: Expense Page
// ──────────────────────────────────────────────
function renderExpensePage() {
  // Populate paidBy select
  const paidByEl = document.getElementById("exp-paid-by");
  if (paidByEl) {
    paidByEl.innerHTML = expenseMembers.map((m) => `<option value="${m}">${m}</option>`).join("");
  }

  // Populate split-with chips
  const splitContainer = document.getElementById("exp-split-chips");
  if (splitContainer) {
    splitContainer.innerHTML = expenseMembers.map((m) => `
      <div class="member-chip selected" data-member="${m}" onclick="toggleSplitMember(this)">${m}</div>
    `).join("");
  }

  // Populate category chips
  const catContainer = document.getElementById("exp-cat-chips");
  if (catContainer) {
    catContainer.innerHTML = EXPENSE_CATEGORIES.map((cat, idx) => `
      <div class="cat-chip ${idx === 0 ? "selected" : ""}" data-cat="${cat.key}" onclick="selectCategory(this)">
        ${cat.emoji} ${cat.label}
      </div>
    `).join("");
  }

  // Set default date to trip first day
  const dateEl = document.getElementById("exp-date");
  if (dateEl) dateEl.value = (tripData && tripData.meta && tripData.meta.dateRange && tripData.meta.dateRange.start) || new Date().toISOString().split("T")[0];

  // Live TWD preview
  const amtEl = document.getElementById("exp-amount");
  const twdHint = document.getElementById("exp-twd-hint");
  if (amtEl && twdHint) {
    amtEl.addEventListener("input", () => {
      const jpy = parseFloat(amtEl.value) || 0;
      const rate = parseFloat(localStorage.getItem(EXPENSE_RATE_KEY)) || 0.22;
      twdHint.textContent = jpy > 0 ? `≈ NT$${Math.round(jpy * rate).toLocaleString()}` : "";
    });
  }
}

function toggleSplitMember(el) {
  el.classList.toggle("selected");
}

function selectCategory(el) {
  document.querySelectorAll(".cat-chip").forEach((c) => c.classList.remove("selected"));
  el.classList.add("selected");
}

function openExpenseModal() {
  document.getElementById("expense-modal").classList.remove("hidden");
}

function closeExpenseModal() {
  document.getElementById("expense-modal").classList.add("hidden");
  document.getElementById("exp-amount").value = "";
  document.getElementById("exp-desc").value = "";
  document.getElementById("exp-twd-hint").textContent = "";
  // Reset all split chips to selected
  document.querySelectorAll(".member-chip").forEach((c) => c.classList.add("selected"));
  // Reset category
  document.querySelectorAll(".cat-chip").forEach((c, i) => c.classList.toggle("selected", i === 0));
}

function submitExpense() {
  const dateEl = document.getElementById("exp-date");
  const amtEl = document.getElementById("exp-amount");
  const descEl = document.getElementById("exp-desc");
  const paidByEl = document.getElementById("exp-paid-by");

  const date = dateEl.value;
  const amountJPY = parseInt(amtEl.value);
  const desc = descEl.value.trim();
  const paidBy = paidByEl.value;
  const splitWith = Array.from(document.querySelectorAll(".member-chip.selected")).map((el) => el.dataset.member);
  const selectedCat = document.querySelector(".cat-chip.selected");
  const category = selectedCat ? selectedCat.dataset.cat : "other";

  if (!date || isNaN(amountJPY) || amountJPY <= 0) {
    alert("請填入日期和有效金額！");
    return;
  }
  if (!desc) {
    alert("請輸入消費說明！");
    return;
  }
  if (splitWith.length === 0) {
    alert("均攤對象至少選一人！");
    return;
  }

  addExpense({ date, amountJPY, desc, paidBy, splitWith, category });
  closeExpenseModal();
}
