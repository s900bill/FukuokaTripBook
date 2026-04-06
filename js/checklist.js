/**
 * checklist.js – Pre-trip checklist tab logic
 */

let checklistItems = [];
const STORAGE_KEY = "fukuoka-trip-checklist";

const defaultCategories = {
  證件: ["護照（有效期6個月以上）", "身分證", "國際駕照（若租車）", "機票電子憑證", "旅館訂房確認單", "旅遊保險單"],
  金錢: ["日幣現金", "信用卡", "提款卡", "零錢包", "悠遊卡或ICOCA卡"],
  電子: ["手機", "手機充電器", "行動電源", "相機", "相機記憶卡", "轉接頭", "Wi-Fi分享器或SIM卡"],
  衣物: ["換洗衣物（5天份）", "內衣褲", "襪子", "外套（早晚溫差用）", "舒適的走路鞋", "拖鞋", "雨具（折疊傘）", "太陽眼鏡", "帽子"],
  藥品: ["個人常備藥", "暈車藥", "腸胃藥", "感冒藥", "OK繃", "防蚊液", "防曬乳", "口罩"],
  其他: ["盥洗用品（牙刷、牙膏）", "護膚保養品", "濕紙巾", "面紙", "環保袋（購物用）", "筆記本和筆", "空行李箱空間（買伴手禮）"],
};

function loadChecklist() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    checklistItems = JSON.parse(saved);
  } else {
    initDefaultChecklist();
  }
  renderChecklist();
}

function initDefaultChecklist() {
  checklistItems = [];
  let idCounter = 1;
  Object.keys(defaultCategories).forEach((category) => {
    defaultCategories[category].forEach((text) => {
      checklistItems.push({ id: idCounter++, text, completed: false, category, addedAt: new Date().toISOString() });
    });
  });
  saveChecklist();
}

function saveChecklist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistItems));
}

function resetChecklist() {
  if (confirm("確定要重置所有項目嗎？這將清除所有勾選記錄並恢復預設清單。")) {
    initDefaultChecklist();
    renderChecklist();
  }
}

function toggleChecklistItem(id) {
  const item = checklistItems.find((i) => i.id === id);
  if (item) {
    item.completed = !item.completed;
    saveChecklist();
    renderChecklist();
  }
}

function clearCompleted() {
  const completedCount = checklistItems.filter((i) => i.completed).length;
  if (completedCount === 0) { alert("目前沒有已完成的項目！"); return; }
  if (confirm(`確定要清除 ${completedCount} 個已完成的項目嗎？`)) {
    checklistItems = checklistItems.filter((i) => !i.completed);
    saveChecklist();
    renderChecklist();
  }
}

function renderChecklist() {
  const container = document.getElementById("checklist-items");
  if (!container) return;

  const total = checklistItems.length;
  const completed = checklistItems.filter((i) => i.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById("progress-text").textContent = `${completed}/${total} (${percentage}%)`;
  document.getElementById("progress-bar").style.width = `${percentage}%`;

  const grouped = {};
  checklistItems.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  const categoryOrder = ["證件", "金錢", "電子", "衣物", "藥品", "其他"];
  let html = "";

  categoryOrder.forEach((category) => {
    if (!grouped[category]) return;
    const items = grouped[category];
    html += `
      <div id="cat-${category}" class="card" style="margin-bottom: 16px; scroll-margin-top: 16px;">
        <h3 style="margin: 0 0 12px; font-size: 1em; color: var(--primary); display: flex; align-items: center; gap: 8px;">
          <span>${getCategoryIcon(category)}</span>
          <span>${category}</span>
          <span style="color: var(--text-light); font-size: 0.88em; font-weight: normal;">(${items.filter((i) => i.completed).length}/${items.length})</span>
        </h3>
    `;
    items.forEach((item) => {
      html += `
        <div style="display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 8px; background: ${item.completed ? "#f0fdf4" : "#fafafa"}; margin-bottom: 6px; transition: all 0.2s;">
          <input type="checkbox" ${item.completed ? "checked" : ""} onchange="toggleChecklistItem(${item.id})" style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary); flex-shrink: 0;" />
          <span style="flex: 1; ${item.completed ? "text-decoration: line-through; opacity: 0.6;" : ""} font-size: 0.94em;">${item.text}</span>
        </div>
      `;
    });
    html += `</div>`;
  });

  container.innerHTML = html;
}

function getCategoryIcon(category) {
  const icons = { 證件: "📄", 金錢: "💰", 電子: "🔌", 衣物: "👕", 藥品: "💊", 其他: "📦", 自訂: "✏️" };
  return icons[category] || "📌";
}
