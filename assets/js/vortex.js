export function initVortex() {
  var canvas = document.getElementById('vortexCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var bgCanvas = document.createElement('canvas');
  var bgCtx = bgCanvas.getContext('2d');
  var W, H, cx, cy, R;
  var seed = Date.now();
  var bgReady = false;

  var DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var beatIndex = 0;        // 当前跳动下标 (0-11)
  var lastBeat = 0;         // 上次跳动时间
  var BEAT_INTERVAL = 3000;  // 毫秒

  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  var PENCIL = '#b8a488';

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;
    bgCtx.scale(dpr, dpr);

    cx = W / 2;
    cy = H / 2;
    R = Math.min(W, H) * 0.34;
    bgReady = false;
  }

  function jitter(val, amount) {
    return val + (seededRandom() - 0.5) * amount;
  }

  // ── 圆圈（心跳），12 字（心跳），在 animate 中逐帧绘制
  // 静态 bg 不再包含主圆和 12 字，仅保留纸纹、放射线、波纹圈

  // ── 纸纹理 ──
  function drawPaperTexture() {
    ctx.save();
    for (var i = 0; i < 2000; i++) {
      var x = seededRandom() * W;
      var y = seededRandom() * H;
      var s = 0.5 + seededRandom() * 1.5;
      ctx.globalAlpha = 0.015 + seededRandom() * 0.02;
      ctx.fillStyle = seededRandom() > 0.5 ? '#d4be9a' : '#c4a882';
      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── 圆圈 + 放射线（仅保留手绘波纹圈和放射线，主圆在 animate 中逐帧绘制）
  function drawCircleAndRadials() {
    ctx.save();

    ctx.globalAlpha = 0.08;
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    for (var a = 0; a < Math.PI * 2; a += 0.02) {
      var rr = R + Math.sin(a * 3) * 2;
      var x = cx + Math.cos(a) * rr;
      var y = cy + Math.sin(a) * rr;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = PENCIL;
    ctx.lineWidth = 0.4;
    for (var i = 0; i < 12; i++) {
      var a = (i / 12) * Math.PI * 2 + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(jitter(cx, 4), jitter(cy, 4));
      ctx.lineTo(cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 1.25);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ── 跳动数字 ──
  function drawActiveNumber(activeIdx, pulse) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var a = (activeIdx / 12) * Math.PI * 2 + Math.PI / 2;
    var x = cx + Math.cos(a) * R * 1.08;
    var y = cy + Math.sin(a) * R * 1.08;
    var label = DIZHI[activeIdx];

    // 数字光晕
    var glowR = 14 + pulse * 8;
    var gradG = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    gradG.addColorStop(0, 'rgba(255,255,255,' + (0.04 + pulse * 0.02) + ')');
    gradG.addColorStop(0.5, 'rgba(255,255,255,0.01)');
    gradG.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradG;
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.06 + pulse * 0.02;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Georgia", "Inter", serif';
    ctx.fillText(label, x, y);

    ctx.restore();
  }

  function drawStaticBg() {
    seed = Date.now();
    var realCtx = ctx;
    ctx = bgCtx;
    drawPaperTexture();
    drawCircleAndRadials();
    ctx = realCtx;
    bgReady = true;
  }

  function animate(now) {
    // 更新节拍
    if (now - lastBeat > BEAT_INTERVAL) {
      beatIndex = (beatIndex + 1) % 12;
      lastBeat = now;
    }

    // 脉冲相位
    var pulsePhase = (now - lastBeat) / BEAT_INTERVAL;
    var pulse = Math.sin(pulsePhase * Math.PI);

    // 同步大字呼吸
    document.documentElement.style.setProperty('--pulse', 0.7 + pulse * 0.3);

    // 绘制缓存背景（只绘制一次）
    if (!bgReady) {
      bgCtx.clearRect(0, 0, W, H);
      drawStaticBg();
    }
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(bgCanvas, 0, 0, W, H);

    // 只重新绘制跳动数字
    drawActiveNumber(beatIndex, pulse);

    // ── 心跳圆圈（蓝品红渐变，与 oner 呼应）──
    var heartScale = 1;
    var heartR = R * heartScale;
    ctx.save();
    ctx.globalAlpha = 0.065 * pulse;
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, heartR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // ── 12 字心跳缩放 ──
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var labelR = R * 1.08;
    var charScale = 1;
    for (var n = 1; n <= 12; n++) {
      var a = ((n - 1) / 12) * Math.PI * 2 + Math.PI / 2;
      var px = cx + Math.cos(a) * labelR * charScale;
      var py = cy + Math.sin(a) * labelR * charScale;
      ctx.globalAlpha = 0.12 * pulse;
      ctx.fillStyle = '#e8d0b8';
      ctx.font = Math.round(15 * charScale) + 'px "Georgia", "Inter", serif';
      ctx.fillText(DIZHI[n - 1], px, py);
    }
    ctx.restore();

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', function () { resize(); });
  resize();
  requestAnimationFrame(animate);
}
