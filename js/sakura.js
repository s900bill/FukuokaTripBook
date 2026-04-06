/**
 * sakura.js — 高性能 Canvas 櫻花飄落與累積效果
 * 基於使用者提供的範例優化，加入精緻路徑與底部堆積邏輯
 */

(function () {
  const canvas = document.getElementById("sakura-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let petals = [];
  let settledPetals = []; // 落地花瓣
  const MAX_PETALS = 60;
  const SETTLED_MAX = 100; // 底部最多累積數量

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 8 + 4;
      this.speedX = Math.random() * 1.5 - 0.5;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.rotation = Math.random() * 360;
      this.spin = Math.random() * 0.05 - 0.025;
      // 櫻花配色
      const pinks = ["#ffb7c5", "#ffc0cb", "#ffd1dc", "#ffc3d0"];
      this.color = pinks[Math.floor(Math.random() * pinks.length)];
      this.opacity = Math.random() * 0.5 + 0.4;
    }

    draw(targetCtx = ctx) {
      targetCtx.save();
      targetCtx.translate(this.x, this.y);
      targetCtx.rotate(this.rotation);
      targetCtx.globalAlpha = this.opacity;
      
      targetCtx.beginPath();
      targetCtx.moveTo(0, 0);
      // 繪製更精緻的花瓣 (Bezier 曲線)
      // 頂部 V 型缺口感
      targetCtx.bezierCurveTo(-this.size, -this.size, -this.size, this.size, 0, this.size);
      targetCtx.bezierCurveTo(this.size, this.size, this.size, -this.size, 0, 0);
      
      targetCtx.fillStyle = this.color;
      targetCtx.fill();
      targetCtx.restore();
    }

    update() {
      this.x += this.speedX + Math.sin(this.y / 50) * 0.5; // 加入一點左右擺動
      this.y += this.speedY;
      this.rotation += this.spin;

      // 檢查是否落地
      if (this.y > canvas.height - 5) {
        // 落地累積邏輯
        addSettledPetal(this.x, canvas.height - Math.random() * 5, this.size, this.rotation, this.color, this.opacity);
        this.reset();
      }
    }
  }

  function addSettledPetal(x, y, size, rotation, color, opacity) {
    settledPetals.push({ x, y, size, rotation, color, opacity });
    if (settledPetals.length > SETTLED_MAX) {
      settledPetals.shift(); // 移除最舊的
    }
  }

  function init() {
    resize();
    for (let i = 0; i < MAX_PETALS; i++) {
        petals.push(new Petal());
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 繪製已累積的花瓣
    settledPetals.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size, -p.size, -p.size, p.size, 0, p.size);
        ctx.bezierCurveTo(p.size, p.size, p.size, -p.size, 0, 0);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
    });

    // 繪製移動中的花瓣
    petals.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resize();
    settledPetals = []; // 視窗縮放時清除累積，避免座標偏移
  });
  
  init();
})();
