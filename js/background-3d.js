/**
 * Samarthya — Ultra-Smooth 60FPS Cinematic Aurora Waves (Zero Lag Engine)
 * GPU-friendly bezier wave ribbons + ambient celestial glow.
 */

(function () {
  'use strict';

  let canvas, ctx;
  let width, height;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0, targetScrollY = 0;
  let time = 0;

  // Lightweight particle dust (only 25 particles for zero CPU overhead)
  const PARTICLES = [];
  const PARTICLE_COUNT = 28;

  function init() {
    canvas = document.getElementById('bg3d-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'bg3d-canvas';
      canvas.className = 'bg3d-canvas';
      document.body.prepend(canvas);
    }

    ctx = canvas.getContext('2d', { alpha: true });
    resize();

    // Initialize celestial particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      PARTICLES.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    targetMouseX = width / 2;
    targetMouseY = height / 2;
    mouseX = targetMouseX;
    mouseY = targetMouseY;

    animate();
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function animate() {
    time += 0.008;

    // Smooth camera inertia
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    scrollY += (targetScrollY - scrollY) * 0.06;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw 3 Flowing Aurora Ribbon Waves (Ultra Lightweight Bezier)
    drawAuroraRibbon(height * 0.75, 55, 0.002, 'rgba(99, 102, 241, 0.15)', 'rgba(56, 189, 248, 0.08)', 1);
    drawAuroraRibbon(height * 0.82, 45, 0.0025, 'rgba(139, 92, 246, 0.12)', 'rgba(52, 211, 153, 0.06)', -1);
    drawAuroraRibbon(height * 0.88, 35, 0.0018, 'rgba(56, 189, 248, 0.14)', 'rgba(99, 102, 241, 0.05)', 1.5);

    // 2. Draw Gentle Ambient Floating Star Dust
    ctx.fillStyle = '#38BDF8';
    for (let i = 0; i < PARTICLES.length; i++) {
      const p = PARTICLES[i];
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha * 0.4})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  function drawAuroraRibbon(baseY, amplitude, freq, colorStart, colorEnd, direction) {
    const scrollOffset = scrollY * 0.15;
    const mouseInfluence = ((mouseY - height / 2) / height) * 30;

    const grad = ctx.createLinearGradient(0, baseY - 100, width, height);
    grad.addColorStop(0, colorStart);
    grad.addColorStop(1, colorEnd);

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, baseY);

    const segments = 8;
    const step = width / segments;

    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const wave = Math.sin(x * freq + (time * 2 * direction) + (scrollOffset * 0.002)) * amplitude;
      const wave2 = Math.cos(x * freq * 0.5 - time) * (amplitude * 0.5);
      const y = baseY + wave + wave2 + mouseInfluence;

      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        const prevX = (i - 1) * step;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, y - 20, cpX, y + 20, x, y);
      }
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
