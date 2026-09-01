/**
 * ============================================
 * Samarthya — Dynamic Interactive Cursor Effect
 * Eye-soothing aura glow, smooth lerp trailing, magnetic hover,
 * click ripple particles, and accessibility-first responsive fallback.
 * ============================================
 */

(function () {
  'use strict';

  // Check if pointer/device supports fine cursor and user doesn't prefer reduced motion
  if (typeof window === 'undefined') return;

  const isTouchDevice = () =>
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches;

  if (isTouchDevice()) {
    return; // Keep clean native behavior on touchscreens
  }

  const CursorEffect = {
    dot: null,
    ring: null,
    trailCanvas: null,
    ctx: null,
    particles: [],

    mouse: { x: -100, y: -100 },
    ringPos: { x: -100, y: -100 },
    dotPos: { x: -100, y: -100 },

    targetScale: 1,
    currentScale: 1,
    isHovered: false,
    isInput: false,
    isMouseDown: false,
    isVisible: false,
    rafId: null,

    init() {
      if (document.getElementById('custom-cursor-dot')) return;

      this.createDOMElements();
      this.bindEvents();
      this.render();
    },

    createDOMElements() {
      // 1. Cursor Dot
      this.dot = document.createElement('div');
      this.dot.id = 'custom-cursor-dot';
      this.dot.className = 'custom-cursor-dot';

      // 2. Cursor Ring / Aura Glow
      this.ring = document.createElement('div');
      this.ring.id = 'custom-cursor-ring';
      this.ring.className = 'custom-cursor-ring';

      // 3. Canvas for click ripple particles and trailing energy
      this.trailCanvas = document.createElement('canvas');
      this.trailCanvas.id = 'custom-cursor-canvas';
      this.trailCanvas.className = 'custom-cursor-canvas';
      this.ctx = this.trailCanvas.getContext('2d');

      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      document.body.appendChild(this.trailCanvas);
      document.body.appendChild(this.ring);
      document.body.appendChild(this.dot);

      this.injectStyles();
    },

    resizeCanvas() {
      if (!this.trailCanvas) return;
      this.trailCanvas.width = window.innerWidth;
      this.trailCanvas.height = window.innerHeight;
    },

    injectStyles() {
      if (document.getElementById('custom-cursor-styles')) return;

      const style = document.createElement('style');
      style.id = 'custom-cursor-styles';
      style.textContent = `
        /* Interactive Custom Cursor Base */
        .custom-cursor-dot,
        .custom-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 999999;
          border-radius: 50%;
          will-change: transform, opacity, width, height, background-color, border-color;
          opacity: 0;
          transition: opacity 0.3s ease, border-color 0.25s ease, background-color 0.25s ease;
        }

        .custom-cursor-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 999998;
        }

        /* Inner Crisp Pinpoint */
        .custom-cursor-dot {
          width: 8px;
          height: 8px;
          margin-top: -4px;
          margin-left: -4px;
          background: #38bdf8;
          box-shadow: 0 0 10px #38bdf8, 0 0 20px rgba(56, 189, 248, 0.6);
        }

        /* Outer Aura Follower Ring */
        .custom-cursor-ring {
          width: 38px;
          height: 38px;
          margin-top: -19px;
          margin-left: -19px;
          border: 1.5px solid rgba(129, 140, 248, 0.65);
          background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(56, 189, 248, 0.05) 55%, transparent 80%);
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.35), inset 0 0 12px rgba(56, 189, 248, 0.25);
          backdrop-filter: blur(1px);
        }

        /* Visible States */
        body.cursor-active .custom-cursor-dot,
        body.cursor-active .custom-cursor-ring {
          opacity: 1;
        }

        /* Interactive Hover State */
        .custom-cursor-ring.cursor-hover {
          border-color: rgba(56, 189, 248, 0.95);
          background: radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.15) 60%, transparent 85%);
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.6), inset 0 0 18px rgba(129, 140, 248, 0.4);
        }

        .custom-cursor-dot.cursor-hover {
          background: #ffffff;
          box-shadow: 0 0 14px #ffffff, 0 0 24px #38bdf8;
          transform: scale(0.65);
        }

        /* Input / Text Fields Hover State */
        .custom-cursor-ring.cursor-input {
          width: 6px;
          height: 28px;
          margin-top: -14px;
          margin-left: -3px;
          border-radius: 4px;
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.4);
          box-shadow: 0 0 20px #38bdf8;
        }

        .custom-cursor-dot.cursor-input {
          opacity: 0;
        }

        /* Click / Mouse Down State */
        .custom-cursor-ring.cursor-down {
          transform: scale(0.8);
          border-color: #818cf8;
          background: radial-gradient(circle, rgba(129, 140, 248, 0.45) 0%, transparent 70%);
          box-shadow: 0 0 40px rgba(129, 140, 248, 0.8);
        }

        .custom-cursor-dot.cursor-down {
          transform: scale(1.4);
          background: #ffffff;
        }

        /* Accessibility: Disable when reduced motion is requested */
        @media (prefers-reduced-motion: reduce) {
          .custom-cursor-dot,
          .custom-cursor-ring,
          .custom-cursor-canvas {
            display: none !important;
          }
        }
        body.reduced-motion .custom-cursor-dot,
        body.reduced-motion .custom-cursor-ring,
        body.reduced-motion .custom-cursor-canvas {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    },

    bindEvents() {
      // Track mouse coordinates
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (!this.isVisible) {
          this.isVisible = true;
          document.body.classList.add('cursor-active');
          this.ringPos.x = e.clientX;
          this.ringPos.y = e.clientY;
          this.dotPos.x = e.clientX;
          this.dotPos.y = e.clientY;
        }

        // Check hovered elements dynamically
        this.checkHover(e.target);
      }, { passive: true });

      // Mouse leave window
      document.addEventListener('mouseleave', () => {
        this.isVisible = false;
        document.body.classList.remove('cursor-active');
      });

      // Mouse enter window
      document.addEventListener('mouseenter', () => {
        this.isVisible = true;
        document.body.classList.add('cursor-active');
      });

      // Mouse Down / Up
      window.addEventListener('mousedown', (e) => {
        this.isMouseDown = true;
        this.ring.classList.add('cursor-down');
        this.dot.classList.add('cursor-down');
        this.spawnClickSparks(e.clientX, e.clientY);
      });

      window.addEventListener('mouseup', () => {
        this.isMouseDown = false;
        this.ring.classList.remove('cursor-down');
        this.dot.classList.remove('cursor-down');
      });
    },

    checkHover(target) {
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, select, textarea, label, [role="button"], .btn, .btn-sm, .btn-primary, .btn-secondary, .scheme-card, .form-card, .voice-input-btn, .ai-floating-btn, .a11y-floating-btn, .a11y-toggle-btn, .badge, .tab-btn, .step-label, [onclick]'
      );

      const isInputField = target.closest('input[type="text"], input[type="number"], input[type="date"], textarea, .ai-input');

      if (isInputField) {
        this.isInput = true;
        this.isHovered = true;
        this.targetScale = 1;
        this.ring.classList.add('cursor-input');
        this.ring.classList.remove('cursor-hover');
        this.dot.classList.add('cursor-input');
      } else if (interactive) {
        this.isInput = false;
        this.isHovered = true;
        this.targetScale = 1.55;
        this.ring.classList.remove('cursor-input');
        this.ring.classList.add('cursor-hover');
        this.dot.classList.remove('cursor-input');
        this.dot.classList.add('cursor-hover');
      } else {
        this.isInput = false;
        this.isHovered = false;
        this.targetScale = 1;
        this.ring.classList.remove('cursor-input', 'cursor-hover');
        this.dot.classList.remove('cursor-input', 'cursor-hover');
      }
    },

    spawnClickSparks(x, y) {
      const colors = ['#38bdf8', '#818cf8', '#c084fc', '#ffffff', '#34d399'];
      const count = 10;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 1.8 + Math.random() * 3.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5 + Math.random() * 2.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.035 + Math.random() * 0.025
        });
      }
    },

    render() {
      // Smooth linear interpolation (lerp) for trailing ring
      const ringLerp = 0.18;
      const dotLerp = 0.85;

      this.ringPos.x += (this.mouse.x - this.ringPos.x) * ringLerp;
      this.ringPos.y += (this.mouse.y - this.ringPos.y) * ringLerp;

      this.dotPos.x += (this.mouse.x - this.dotPos.x) * dotLerp;
      this.dotPos.y += (this.mouse.y - this.dotPos.y) * dotLerp;

      this.currentScale += (this.targetScale - this.currentScale) * 0.15;

      // Transform DOM elements
      if (this.dot) {
        this.dot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0)`;
      }

      if (this.ring) {
        const scaleStr = this.isInput ? '' : ` scale(${this.currentScale})`;
        this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0)${scaleStr}`;
      }

      // Render Canvas click particles
      if (this.ctx && this.trailCanvas) {
        this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
            continue;
          }

          this.ctx.save();
          this.ctx.globalAlpha = p.alpha;
          this.ctx.fillStyle = p.color;
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }
      }

      this.rafId = requestAnimationFrame(() => this.render());
    }
  };

  // Initialize once DOM is loaded or immediately if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CursorEffect.init());
  } else {
    CursorEffect.init();
  }

  window.CursorEffect = CursorEffect;
})();
