/**
 * CLOUDS DANCE STUDIO — 2026 Editorial Spatial Engine
 * 
 * Elegant, restrained physical depth and interactive parallax:
 *  - Multi-plane DOM depth parallax (interpolated with smooth easing)
 *  - Subtle photographic card perspective & specular lighting
 *  - Micro-magnetic button tactile feedback
 *  - Ultra-clean ambient studio lighting tracking cursor
 *  - Zero particle clutter, zero 3D grid floors, zero neon gimmicks
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Global cursor & scroll tracking state
  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    rawX: window.innerWidth / 2,
    rawY: window.innerHeight / 2
  };
  
  let scrollProgress = 0;
  let isVisible = true;

  // Window resize debouncing
  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;

  window.addEventListener('resize', () => {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
  }, { passive: true });

  // Mouse move listener
  window.addEventListener('mousemove', (e) => {
    mouse.rawX = e.clientX;
    mouse.rawY = e.clientY;
    mouse.targetX = (e.clientX / winWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / winHeight) * 2 + 1;
  }, { passive: true });

  // Touch move listener for mobile/tablets
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouse.rawX = touch.clientX;
      mouse.rawY = touch.clientY;
      mouse.targetX = (touch.clientX / winWidth) * 2 - 1;
      mouse.targetY = -(touch.clientY / winHeight) * 2 + 1;
    }
  }, { passive: true });

  // Scroll tracking
  window.addEventListener('scroll', () => {
    const heroEl = document.getElementById('home');
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      const heroHeight = rect.height || winHeight;
      scrollProgress = Math.max(0, Math.min(1, -rect.top / heroHeight));
    }
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  /* --------------------------------------------------------------------------
     1. EDITORIAL MULTI-PLANE PARALLAX & PHYSICAL DEPTH
     -------------------------------------------------------------------------- */
  function initEditorialParallax() {
    const spatialLayers = document.querySelectorAll('[data-depth]');
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    const heroMediaStage = document.querySelector('.hero-3d-media-stage');
    const bgContainer = document.getElementById('spatialStageContainer');

    function renderParallax() {
      if (!isVisible) {
        requestAnimationFrame(renderParallax);
        return;
      }

      // Smooth interpolation for luxurious inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.065;
      mouse.y += (mouse.targetY - mouse.y) * 0.065;

      if (!prefersReducedMotion) {
        // Update ambient background light position smoothly
        if (bgContainer) {
          const bgX = ((mouse.x + 1) * 50).toFixed(1);
          const bgY = ((-mouse.y + 1) * 50).toFixed(1);
          bgContainer.style.setProperty('--spot-x', `${bgX}%`);
          bgContainer.style.setProperty('--spot-y', `${bgY}%`);
        }

        // Multi-plane depth parallax for typography, prints, accents
        spatialLayers.forEach(layer => {
          const depth = parseFloat(layer.getAttribute('data-depth') || '0.2');
          // Classy, subtle amplitudes (3px - 22px max)
          const moveX = mouse.x * depth * 28;
          const moveY = -mouse.y * depth * 28;
          const rotX = -mouse.y * depth * 6;
          const rotY = mouse.x * depth * 6;
          const scrollOffset = scrollProgress * depth * -60;

          layer.style.transform = `translate3d(${moveX.toFixed(2)}px, ${(moveY + scrollOffset).toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        });

        // Interactive subtle perspective tilt on the Hero Photography Stage
        if (heroMediaStage) {
          const rect = heroMediaStage.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;
          const relativeX = (mouse.rawX - cardCenterX) / (rect.width / 2);
          const relativeY = (mouse.rawY - cardCenterY) / (rect.height / 2);

          if (Math.abs(relativeX) < 2.0 && Math.abs(relativeY) < 2.0) {
            heroMediaStage.style.setProperty('--glare-x', `${((relativeX + 1) * 50).toFixed(1)}%`);
            heroMediaStage.style.setProperty('--glare-y', `${((relativeY + 1) * 50).toFixed(1)}%`);
            heroMediaStage.style.setProperty('--card-tilt-x', `${(-relativeY * 5.5).toFixed(2)}deg`);
            heroMediaStage.style.setProperty('--card-tilt-y', `${(relativeX * 5.5).toFixed(2)}deg`);
          }
        }

        // Magnetic tactile buttons
        magneticBtns.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          const btnCenterX = rect.left + rect.width / 2;
          const btnCenterY = rect.top + rect.height / 2;
          const distX = mouse.rawX - btnCenterX;
          const distY = mouse.rawY - btnCenterY;
          const dist = Math.hypot(distX, distY);

          if (dist < 90) {
            const pullX = distX * 0.18;
            const pullY = distY * 0.18;
            btn.style.transform = `translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0)`;
          } else {
            btn.style.transform = `translate3d(0, 0, 0)`;
          }
        });
      }

      requestAnimationFrame(renderParallax);
    }

    requestAnimationFrame(renderParallax);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditorialParallax);
  } else {
    initEditorialParallax();
  }

})();

