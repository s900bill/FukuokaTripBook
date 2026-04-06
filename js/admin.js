/**
 * admin.js – Admin panel tools (export, import, AI prompt)
 */

function exportJSON() {
  const blob = new Blob([JSON.stringify(tripData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trip_export.json";
  a.click();
}

function copyPrompt() {
  const text = `我正在規劃${tripData.meta.title}。目前行程：${JSON.stringify(tripData.overview)}。請幫我優化這份行程，特別考慮${tripData.meta.foodLimit}，並提供更多在${tripData.stay.name}附近的宵夜建議。`;
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  alert("Prompt 已複製到剪貼簿，可貼給 AI 使用。");
}
