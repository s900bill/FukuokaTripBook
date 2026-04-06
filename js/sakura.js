/**
 * sakura.js — 漂浮櫻花花瓣效果
 * 建立 CSS 動畫驅動的花瓣，效能開銷低
 */

(function () {
  const PETAL_COUNT = 18;        // 最大花瓣數
  const RESPAWN_INTERVAL = 1200; // 每幾ms生一片

  // SVG 花瓣形狀（橢圓花瓣）
  function createPetalSVG(color, size) {
    return `<svg width="${size}" height="${size * 1.2}" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="10" cy="12" rx="7" ry="11" fill="${color}" opacity="0.85" transform="rotate(-15 10 12)"/>
      <ellipse cx="10" cy="12" rx="5" ry="9" fill="${color}" opacity="0.5" transform="rotate(15 10 12)"/>
    </svg>`;
  }

  const COLORS = ['#F4A7B9', '#F7C5D2', '#FFAABB', '#F9C4D0', '#FBAFC0'];

  function spawnPetal() {
    const container = document.getElementById('sakura-container');
    if (!container) return;

    // 限制最大數量
    if (container.children.length >= PETAL_COUNT) {
      container.removeChild(container.firstChild);
    }

    const petal = document.createElement('div');
    petal.className = 'sakura-petal';

    const size = 10 + Math.random() * 10;          // 10~20px
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const startX = Math.random() * 100;            // 0~100vw
    const duration = 6 + Math.random() * 8;        // 6~14秒飄落
    const swayDuration = 2 + Math.random() * 3;   // 搖擺週期
    const delay = Math.random() * -4;              // 隨機起始相位（負delay讓它從中途開始）
    const swayAmount = 30 + Math.random() * 60;   // 左右搖擺幅度

    petal.innerHTML = createPetalSVG(color, size);
    petal.style.cssText = `
      left: ${startX}vw;
      width: ${size}px;
      height: ${size * 1.2}px;
      animation:
        sakura-fall ${duration}s ${delay}s linear forwards,
        sakura-sway ${swayDuration}s ${delay}s ease-in-out infinite alternate;
      --sway: ${swayAmount}px;
    `;

    container.appendChild(petal);

    // 飄落結束後移除
    setTimeout(() => {
      if (petal.parentNode) petal.parentNode.removeChild(petal);
    }, (duration + Math.abs(delay)) * 1000 + 200);
  }

  // 初始化：先撒一批，再定時補發
  function init() {
    // 第一批提前撒（用負delay讓畫面一開始就有花瓣）
    for (let i = 0; i < 10; i++) {
      setTimeout(spawnPetal, i * 200);
    }
    // 之後持續補充
    setInterval(spawnPetal, RESPAWN_INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
