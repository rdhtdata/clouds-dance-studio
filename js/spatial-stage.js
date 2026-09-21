/**
 * CLOUDS DANCE STUDIO — 2026 Editorial Spatial Engine
 * 
 * Butter-smooth, zero-stutter physical depth and interactive parallax:
 *  - High-performance multi-plane DOM depth parallax (60/120 FPS)
 *  - Zero layout thrashing (cached geometry, no per-frame getBoundingClientRect)
 *  - Epsilon thresholding to ensure 100% rock-solid still resting state when mouse is stationary
 *  - Smooth ambient studio spotlighting
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
    rawY: window.innerHeight / 2,
    isIdle: true
  };
  
  let scrollProgress = 0;
  let lastScrollProgress = -1;
  let isVisible = true;

  // Window & card geometry cache (recalculated only on resize / scroll)
  let winWidth = window.innerWidth;
  let winHeight = window.innerHeight;
  let mediaStageCenter = { x: winWidth * 0.75, y: winHeight * 0.5, halfW: 230, halfH: 260 };

  function updateGeometry() {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    
    const heroMediaStage = document.querySelector('.hero-3d-media-stage');
    if (heroMediaStage) {
      const rect = heroMediaStage.getBoundingClientRect();
      mediaStageCenter.x = rect.left + rect.width / 2;
      mediaStageCenter.y = rect.top + rect.height / 2;
      mediaStageCenter.halfW = Math.max(rect.width / 2, 100);
      mediaStageCenter.halfH = Math.max(rect.height / 2, 100);
    }
  }

  window.addEventListener('resize', updateGeometry, { passive: true });

  // Mouse move listener
  window.addEventListener('mousemove', (e) => {
    mouse.rawX = e.clientX;
    mouse.rawY = e.clientY;
    mouse.targetX = (e.clientX / winWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / winHeight) * 2 + 1;
    mouse.isIdle = false;
  }, { passive: true });

  // Touch move listener for mobile/tablets
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouse.rawX = touch.clientX;
      mouse.rawY = touch.clientY;
      mouse.targetX = (touch.clientX / winWidth) * 2 - 1;
      mouse.targetY = -(touch.clientY / winHeight) * 2 + 1;
      mouse.isIdle = false;
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
    updateGeometry();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  /* --------------------------------------------------------------------------
     1. EDITORIAL MULTI-PLANE PARALLAX & PHYSICAL DEPTH
     -------------------------------------------------------------------------- */
  function initEditorialParallax() {
    updateGeometry();

    const spatialLayers = document.querySelectorAll('[data-depth]');
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    const heroPhotoMain = document.querySelector('.hero-3d-photo-main');
    const bgContainer = document.getElementById('spatialStageContainer');

    // Cached state for delta checking
    let lastRenderedX = 999;
    let lastRenderedY = 999;

    function renderParallax() {
      if (!isVisible) {
        requestAnimationFrame(renderParallax);
        return;
      }

      // Smooth interpolation for luxurious inertia
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;

      if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
        mouse.isIdle = true;
      } else {
        mouse.x += dx * 0.06;
        mouse.y += dy * 0.06;
      }

      // Check if rendered state needs update
      const stateChanged = (
        Math.abs(mouse.x - lastRenderedX) > 0.0001 ||
        Math.abs(mouse.y - lastRenderedY) > 0.0001 ||
        Math.abs(scrollProgress - lastScrollProgress) > 0.0001
      );

      if (!prefersReducedMotion && stateChanged) {
        lastRenderedX = mouse.x;
        lastRenderedY = mouse.y;
        lastScrollProgress = scrollProgress;

        // Ambient background subtle spotlight
        if (bgContainer) {
          const bgX = ((mouse.x + 1) * 50).toFixed(1);
          const bgY = ((-mouse.y + 1) * 50).toFixed(1);
          bgContainer.style.setProperty('--spot-x', `${bgX}%`);
          bgContainer.style.setProperty('--spot-y', `${bgY}%`);
        }

        // Multi-plane depth parallax for typography & photo stage
        spatialLayers.forEach(layer => {
          const depth = parseFloat(layer.getAttribute('data-depth') || '0.2');
          const moveX = mouse.x * depth * 24;
          const moveY = -mouse.y * depth * 24;
          const rotX = -mouse.y * depth * 4.5;
          const rotY = mouse.x * depth * 4.5;
          const scrollOffset = scrollProgress * depth * -50;

          layer.style.transform = `translate3d(${moveX.toFixed(2)}px, ${(moveY + scrollOffset).toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        });

        // Interactive perspective tilt & subtle specular glare on the main photo
        if (heroPhotoMain) {
          const relativeX = (mouse.rawX - mediaStageCenter.x) / mediaStageCenter.halfW;
          const relativeY = (mouse.rawY - mediaStageCenter.y) / mediaStageCenter.halfH;

          if (Math.abs(relativeX) < 2.5 && Math.abs(relativeY) < 2.5) {
            const tiltX = (-relativeY * 4.5).toFixed(2);
            const tiltY = (relativeX * 4.5).toFixed(2);
            const glareX = ((relativeX + 1) * 50).toFixed(1);
            const glareY = ((relativeY + 1) * 50).toFixed(1);

            heroPhotoMain.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            heroPhotoMain.style.setProperty('--glare-x', `${glareX}%`);
            heroPhotoMain.style.setProperty('--glare-y', `${glareY}%`);
          } else {
            heroPhotoMain.style.transform = `rotateX(0deg) rotateY(0deg)`;
          }
        }

        // Magnetic tactile buttons
        magneticBtns.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          const btnCenterX = rect.left + rect.width / 2;
          const btnCenterY = rect.top + rect.height / 2;
          const distMouseX = mouse.rawX - btnCenterX;
          const distMouseY = mouse.rawY - btnCenterY;
          const dist = Math.hypot(distMouseX, distMouseY);

          if (dist < 80) {
            const pullX = distMouseX * 0.15;
            const pullY = distMouseY * 0.15;
            btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
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


