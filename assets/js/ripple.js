// ── 轨道方块 → one 涟漪 ──

const RIPPLE_DURATION = 3000;
const MAX_LIFT        = 4;
const SIGMA           = 32;

function initRipple() {
  const oneGroup = document.querySelector('.one-group');
  const track    = document.querySelector('.hero-track');
  if (!oneGroup || !track) return;

  const letters = [
    document.querySelector('.l-o'),
    document.querySelector('.l-n'),
    document.querySelector('.l-e'),
  ];
  if (letters.some(l => !l)) return;

  let startTime = null;

  function ease(dist, sigma) {
    return Math.exp(-(dist * dist) / (2 * sigma * sigma));
  }

  function tick(ts) {
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime) % RIPPLE_DURATION;
    const t = elapsed / RIPPLE_DURATION;

    const vw     = document.documentElement.clientWidth;
    const blockX = -14 + (vw + 14) * t;

    // ── one 涟漪 + 蓝光 ──
    letters.forEach(letter => {
      const rect   = letter.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist   = Math.abs(center - blockX);
      const k      = ease(dist, SIGMA);
      letter.style.top = (-MAX_LIFT * k) + 'px';
      letter.style.textShadow = k > 0.01
        ? `0 0 ${24 * k}px rgba(0,0,238,${0.6 * k})`
        : 'none';
    });

    requestAnimationFrame(tick);
  }

  // r 永远不动
  const r = document.querySelector('.l-r');
  if (r) r.style.top = '0px';

  requestAnimationFrame(tick);
}

export { initRipple };
