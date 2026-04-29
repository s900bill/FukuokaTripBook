/**
 * converter.js – JPY/TWD currency converter tab logic
 */

let exchangeRate = 0.22;
let isJpyToTwd = true;

const couponList = [
  {
    file: "日本BicCamera Coupon.webp",
    name: "日本BicCamera",
    keywords: ["biccamera", "bic camera"],
  },
  {
    file: "唐吉軻德Coupon.webp",
    name: "唐吉軻德",
    keywords: ["donki", "don quijote", "donquijote"],
  },
  {
    file: "福岡機場Coupon.webp",
    name: "福岡機場",
    keywords: ["fukuoka airport", "fuk"],
  },
  {
    file: "日本松本清 Coupon.webp",
    name: "日本松本清",
    keywords: ["matsumoto kiyoshi", "matsukiyo", "matsumoto"],
  },
  {
    file: "札幌藥妝 Coupon.webp",
    name: "札幌藥妝",
    keywords: ["sapporo", "satudora"],
  },
  {
    file: "福岡藥妝店 Drug Eleven.webp",
    name: "福岡藥妝店 Drug Eleven",
    keywords: ["drug eleven"],
  },
  {
    file: "大丸百貨、松阪屋百貨 Coupon.webp",
    name: "大丸百貨、松阪屋百貨",
    keywords: ["daimaru", "matsuzakaya"],
  },
  {
    file: "西武百貨、SOGO百貨 Coupon.webp",
    name: "西武百貨、SOGO百貨",
    keywords: ["seibu", "sogo"],
  },
  { file: "SUGI藥局 Coupon.webp", name: "SUGI藥局", keywords: ["sugi"] },
  {
    file: "COSMOS科摩思 Coupon.webp",
    name: "COSMOS科摩思",
    keywords: ["cosmos"],
  },
  {
    file: "Cocokara Fine Coupon.webp",
    name: "Cocokara Fine",
    keywords: ["cocokara"],
  },
  {
    file: "JUNGLE 密林玩具店 Coupon.webp",
    name: "JUNGLE 密林玩具店",
    keywords: ["jungle"],
  },
  { file: "Laox Coupon.webp", name: "Laox", keywords: ["laox"] },
  {
    file: "Paris Miki 巴黎三城眼鏡.webp",
    name: "Paris Miki 巴黎三城眼鏡",
    keywords: ["paris", "miki"],
  },
  {
    file: "YAMADA 山田家電 Coupon.webp",
    name: "YAMADA 山田家電",
    keywords: ["yamada"],
  },
  { file: "snow peak Coupon.webp", name: "snow peak", keywords: ["snow peak"] },
  { file: "大賀藥局 Coupon.webp", name: "大賀藥局", keywords: ["ohga"] },
  {
    file: "日本Edion 愛電王 Coupon.webp",
    name: "日本Edion 愛電王",
    keywords: ["edion"],
  },
  {
    file: "日本Sundrug尚都樂客 Coupon.webp",
    name: "日本Sundrug尚都樂客",
    keywords: ["sundrug"],
  },
  {
    file: "東京 京王百貨新宿店 Coupon.webp",
    name: "東京 京王百貨新宿店",
    keywords: ["keio"],
  },
  {
    file: "東京 東武百貨池袋本店 Coupon.webp",
    name: "東京 東武百貨池袋本店",
    keywords: ["tobu"],
  },
  {
    file: "機能包 BRIEFING Coupon.webp",
    name: "機能包 BRIEFING",
    keywords: ["briefing"],
  },
  { file: "洋服の青山 Coupon.webp", name: "洋服の青山", keywords: ["aoyama"] },
  { file: "福太郎藥妝店.webp", name: "福太郎藥妝店", keywords: ["fukutaro"] },
  {
    file: "運動用品 Alpen Group 愛蓬體育 Coupon.webp",
    name: "運動用品 Alpen Group 愛蓬體育",
    keywords: ["alpen"],
  },
  {
    file: "運動用品 Victoria Coupon.webp",
    name: "運動用品 Victoria",
    keywords: ["victoria"],
  },
  {
    file: "靜岡 杏林堂藥局 Coupon.webp",
    name: "靜岡 杏林堂藥局",
    keywords: ["kyorindo"],
  },
  { file: "鶴羽藥妝 Coupon.webp", name: "鶴羽藥妝", keywords: ["tsuruha"] },
];

function initConverter() {
  const savedRate = localStorage.getItem("fukuoka-rate");
  if (savedRate) {
    exchangeRate = parseFloat(savedRate);
    document.getElementById("exchange-rate").value = exchangeRate;
  }

  const inputTop = document.getElementById("input-top");
  const inputBottom = document.getElementById("input-bottom");

  if (inputTop && inputBottom) {
    inputTop.addEventListener("input", function () {
      const val = parseFloat(this.value);
      if (!isNaN(val)) {
        inputBottom.value = isJpyToTwd
          ? Math.round(val * exchangeRate)
          : Math.round(val / exchangeRate);
      } else {
        inputBottom.value = "";
      }
    });

    inputBottom.addEventListener("input", function () {
      const val = parseFloat(this.value);
      if (!isNaN(val)) {
        inputTop.value = isJpyToTwd
          ? Math.round(val / exchangeRate)
          : Math.round(val * exchangeRate);
      } else {
        inputTop.value = "";
      }
    });
  }
  updateConverterUI();

  // Coupon Init
  const couponFilter = document.getElementById("coupon-filter");
  if (couponFilter) {
    couponFilter.addEventListener("input", (e) => {
      renderCoupons(e.target.value);
    });
  }
  renderCoupons("");
}

function swapCurrencies() {
  isJpyToTwd = !isJpyToTwd;
  const inputTop = document.getElementById("input-top");
  const inputBottom = document.getElementById("input-bottom");
  const topVal = inputTop.value;
  inputTop.value = inputBottom.value;
  inputBottom.value = topVal;
  updateConverterUI();
}

function updateConverterUI() {
  const labelTop = document.getElementById("label-top");
  const labelBottom = document.getElementById("label-bottom");
  const symbolTop = document.getElementById("symbol-top");
  const symbolBottom = document.getElementById("symbol-bottom");
  const inputTop = document.getElementById("input-top");
  const inputBottom = document.getElementById("input-bottom");

  if (isJpyToTwd) {
    labelTop.textContent = "日幣 (JPY)";
    symbolTop.textContent = "¥";
    inputTop.placeholder = "輸入日幣";
    labelBottom.textContent = "台幣 (TWD)";
    symbolBottom.textContent = "NT$";
    inputBottom.placeholder = "輸入台幣";
  } else {
    labelTop.textContent = "台幣 (TWD)";
    symbolTop.textContent = "NT$";
    inputTop.placeholder = "輸入台幣";
    labelBottom.textContent = "日幣 (JPY)";
    symbolBottom.textContent = "¥";
    inputBottom.placeholder = "輸入日幣";
  }
}

async function fetchExchangeRate(silent = false) {
  try {
    const btn = document.querySelector('button[onclick="fetchExchangeRate()"]');
    let originalText = "";
    if (btn) {
      originalText = btn.innerHTML;
      btn.innerHTML = "⏳...";
      btn.disabled = true;
    }

    const res = await fetch("https://api.exchangerate-api.com/v4/latest/JPY");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    const rate = data.rates.TWD;

    if (rate) {
      document.getElementById("exchange-rate").value = rate;
      updateRate(false);
      if (!silent) alert(`匯率已更新為 ${rate} (來源: exchangerate-api)`);
    } else {
      throw new Error("Rate not found");
    }

    if (btn) {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  } catch (e) {
    console.error(e);
    if (!silent) alert("無法取得即時匯率，請檢查網路連線。");
    const btn = document.querySelector('button[onclick="fetchExchangeRate()"]');
    if (btn) {
      btn.innerHTML = "☁️ Auto";
      btn.disabled = false;
    }
  }
}

function updateRate(showMsg = true) {
  const rateInput = document.getElementById("exchange-rate");
  const newRate = parseFloat(rateInput.value);
  if (!isNaN(newRate) && newRate > 0) {
    exchangeRate = newRate;
    localStorage.setItem("fukuoka-rate", newRate);
    const inputTop = document.getElementById("input-top");
    if (inputTop && inputTop.value) inputTop.dispatchEvent(new Event("input"));
    if (showMsg) alert("匯率已更新！");
  } else {
    alert("請輸入有效的匯率");
  }
}

function setJpy(amount) {
  if (isJpyToTwd) {
    const input = document.getElementById("input-top");
    input.value = amount;
    input.dispatchEvent(new Event("input"));
  } else {
    const input = document.getElementById("input-bottom");
    input.value = amount;
    input.dispatchEvent(new Event("input"));
  }
}

// ===== Coupon Features =====
function renderCoupons(filterText = "") {
  const grid = document.getElementById("coupon-grid");
  if (!grid) return;

  const keyword = filterText.toLowerCase().trim();
  const filtered = couponList.filter((c) => {
    const matchName = c.name.toLowerCase().includes(keyword);
    const matchKeywords =
      c.keywords && c.keywords.some((kw) => kw.toLowerCase().includes(keyword));
    return matchName || matchKeywords;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 20px;">找不到符合的優惠券</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((coupon) => {
      // Escape string for safety
      const safeFile = encodeURIComponent(coupon.file).replace(/'/g, "\\'");
      return `
      <div class="coupon-card" onclick="openCouponModal('coupon/${safeFile}')">
        <div class="coupon-img-container">
          <img src="coupon/${encodeURIComponent(coupon.file)}" loading="lazy" alt="${coupon.name}" />
        </div>
        <div class="coupon-title">${coupon.name}</div>
      </div>
    `;
    })
    .join("");
}

function openCouponModal(src) {
  const modal = document.getElementById("coupon-modal");
  const img = document.getElementById("coupon-modal-img");
  if (modal && img) {
    img.src = src;
    modal.classList.remove("hidden");
  }
}

function closeCouponModal() {
  const modal = document.getElementById("coupon-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// ===== Tax-Free Calculator Features =====
let taxFreeItems = [];

function addTaxFreeItem() {
  const inputEl = document.getElementById("taxfree-input");
  const typeEl = document.getElementById("taxfree-type");
  const nameEl = document.getElementById("taxfree-name");
  
  const val = parseFloat(inputEl.value);
  if (isNaN(val) || val <= 0) {
    alert("請輸入有效金額");
    return;
  }
  
  let itemName = nameEl ? nameEl.value.trim() : "";
  if (!itemName) {
    itemName = `商品${taxFreeItems.length + 1}`;
  }
  
  const isTaxed = typeEl.value === "taxed";
  // 10% tax rate
  const untaxedPrice = isTaxed ? Math.round(val / 1.1) : val;
  const taxedPrice = isTaxed ? val : Math.round(val * 1.1);
  
  taxFreeItems.push({
    name: itemName,
    untaxed: untaxedPrice,
    taxed: taxedPrice,
    original: val,
    isTaxed: isTaxed
  });
  
  inputEl.value = "";
  if (nameEl) nameEl.value = "";
  renderTaxFreeItems();
}

function removeTaxFreeItem(index) {
  taxFreeItems.splice(index, 1);
  renderTaxFreeItems();
}

function clearTaxFreeItems() {
  taxFreeItems = [];
  renderTaxFreeItems();
}

function renderTaxFreeItems() {
  const container = document.getElementById("taxfree-items");
  const totalEl = document.getElementById("taxfree-total");
  const progressEl = document.getElementById("taxfree-progress");
  const statusEl = document.getElementById("taxfree-status");
  const resultEl = document.getElementById("taxfree-result");
  const finalJpyEl = document.getElementById("taxfree-final-jpy");
  const finalTwdEl = document.getElementById("taxfree-final-twd");

  if (!container) return;

  if (taxFreeItems.length === 0) {
    container.innerHTML = "";
    totalEl.textContent = "¥0";
    progressEl.style.width = "0%";
    progressEl.style.background = "#ef4444";
    statusEl.textContent = "還差 ¥5000 免稅";
    statusEl.style.color = "#ef4444";
    resultEl.classList.add("hidden");
    return;
  }

  let totalUntaxed = 0;
  
  container.innerHTML = taxFreeItems.map((item, idx) => {
    totalUntaxed += item.untaxed;
    return `
      <div class="between" style="background: white; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0; font-size: 0.9em;">
        <div>
          <div style="font-weight: 700; color: var(--text); margin-bottom: 2px;">${item.name}</div>
          <span>¥${item.original} <small style="color: var(--text-light);">(${item.isTaxed ? '含稅' : '未稅'})</small></span>
          <span style="color: var(--primary); margin-left: 6px; font-size: 0.85em;"><small>未稅: ¥${item.untaxed}</small></span>
        </div>
        <button class="btn" style="padding: 4px 8px; color: #ef4444; background: #fee2e2;" onclick="removeTaxFreeItem(${idx})">刪除</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = `¥${totalUntaxed}`;
  
  let pct = (totalUntaxed / 5000) * 100;
  if (pct > 100) pct = 100;
  progressEl.style.width = `${pct}%`;
  
  if (totalUntaxed >= 5000) {
    progressEl.style.background = "#10b981";
    statusEl.textContent = "✅ 已達免稅門檻！";
    statusEl.style.color = "#10b981";
    
    resultEl.classList.remove("hidden");
    finalJpyEl.textContent = `¥${totalUntaxed}`;
    finalTwdEl.textContent = `NT$${Math.round(totalUntaxed * exchangeRate)}`;
  } else {
    progressEl.style.background = "#ef4444";
    statusEl.textContent = `還差 ¥${5000 - totalUntaxed} 免稅`;
    statusEl.style.color = "#ef4444";
    resultEl.classList.add("hidden");
  }
}

// 攔截並擴充 updateRate 以連動更新台幣估算
const originalUpdateRate = updateRate;
updateRate = function(showMsg) {
  originalUpdateRate(showMsg);
  if (taxFreeItems.length > 0) renderTaxFreeItems();
}
