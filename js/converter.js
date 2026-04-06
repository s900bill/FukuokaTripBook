/**
 * converter.js – JPY/TWD currency converter tab logic
 */

let exchangeRate = 0.22;
let isJpyToTwd = true;

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
        inputBottom.value = isJpyToTwd ? Math.round(val * exchangeRate) : Math.round(val / exchangeRate);
      } else {
        inputBottom.value = "";
      }
    });

    inputBottom.addEventListener("input", function () {
      const val = parseFloat(this.value);
      if (!isNaN(val)) {
        inputTop.value = isJpyToTwd ? Math.round(val / exchangeRate) : Math.round(val * exchangeRate);
      } else {
        inputTop.value = "";
      }
    });
  }
  updateConverterUI();
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
    labelTop.textContent = "日幣 (JPY)"; symbolTop.textContent = "¥"; inputTop.placeholder = "輸入日幣";
    labelBottom.textContent = "台幣 (TWD)"; symbolBottom.textContent = "NT$"; inputBottom.placeholder = "輸入台幣";
  } else {
    labelTop.textContent = "台幣 (TWD)"; symbolTop.textContent = "NT$"; inputTop.placeholder = "輸入台幣";
    labelBottom.textContent = "日幣 (JPY)"; symbolBottom.textContent = "¥"; inputBottom.placeholder = "輸入日幣";
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
    if (btn) { btn.innerHTML = "☁️ Auto"; btn.disabled = false; }
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
