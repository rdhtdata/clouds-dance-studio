/**
 * CLOUDS DANCE STUDIO — Main Application Script
 * Interactive behaviors, filtering, timetable tabs, gallery lightbox, and smooth reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. STICKY HEADER & SCROLL BEHAVIOR
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const scrollThreshold = 40;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = (forceState) => {
    const shouldOpen = forceState !== undefined ? forceState : !mobileDrawer?.classList.contains('is-open');
    if (shouldOpen) {
      mobileDrawer?.classList.add('is-open');
      mobileToggle?.classList.add('is-active');
      mobileToggle?.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer?.classList.remove('is-open');
      mobileToggle?.classList.remove('is-active');
      mobileToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  mobileToggle?.addEventListener('click', () => toggleMobileNav());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  /* --------------------------------------------------------------------------
     3. CLASS CATEGORY FILTERING
     -------------------------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab, .filter-btn');
  const classCards = document.querySelectorAll('.class-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const category = this.getAttribute('data-filter') || 'all';

      // Update active button state
      filterTabs.forEach(t => t.classList.remove('is-active'));
      this.classList.add('is-active');

      // Filter Cards
      classCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCategory.includes(category)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 150);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. TIMETABLE / SCHEDULE TABS
     -------------------------------------------------------------------------- */
  const scheduleTabs = document.querySelectorAll('.schedule-tab-btn');
  const scheduleTables = document.querySelectorAll('.schedule-table-wrap, .timetable-container');

  scheduleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetSchedule = this.getAttribute('data-target');

      scheduleTabs.forEach(t => t.classList.remove('is-active'));
      this.classList.add('is-active');

      scheduleTables.forEach(table => {
        if (table.id === targetSchedule) {
          table.classList.add('is-active');
        } else {
          table.classList.remove('is-active');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     5. LIGHTBOX GALLERY
     -------------------------------------------------------------------------- */
  const galleryCards = document.querySelectorAll('.gallery-photo-card, .gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryCards.forEach(card => {
    card.addEventListener('click', function () {
      const img = this.querySelector('.gallery-photo-img, .gallery-item-img, img');
      const caption = this.querySelector('.gallery-caption-overlay, .gallery-caption')?.textContent || 'Clouds Dance Studio';

      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || caption;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('is-active')) {
      closeLightbox();
    }
  });

  /* --------------------------------------------------------------------------
     6. INTERSECTION OBSERVER - SCROLL REVEALS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* --------------------------------------------------------------------------
     7. ACTIVE NAV HIGHLIGHT ON SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    desktopLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

});
