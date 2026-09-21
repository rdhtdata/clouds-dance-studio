/**
 * CLOUDS DANCE STUDIO — Interactive Spatial Classes Selector
 * Provides a dynamic, spatial preview stage for dance disciplines.
 */

(function () {
  'use strict';

  const classesData = [
    {
      id: 'hiphop',
      index: '01',
      title: 'Hip Hop & Urban Choreography',
      tagline: 'Groove, isolations, musicality, and street choreography.',
      description: 'Master body isolations, popping basics, footwork speed, and high-energy urban routines. Built for both absolute beginners wanting groove confidence and experienced dancers pushing speed and musicality.',
      image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=1000&auto=format&fit=crop&q=85',
      level: 'All Levels',
      duration: '60 Mins',
      audience: 'Teens & Adults',
      schedule: 'Tue / Thu (Night Batch) & Sat / Sun (Afternoon)',
      instructor: 'Lead Urban Faculty'
    },
    {
      id: 'contemporary',
      index: '02',
      title: 'Contemporary & Lyrical Flow',
      tagline: 'Fluid floorwork, emotive expression, and controlled technique.',
      description: 'Connect emotion with physical movement through guided floor transitions, momentum leaps, and breath-aligned lyrical sequences. Nurtures flexibility, core strength, and artistic storytelling.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000&auto=format&fit=crop&q=85',
      level: 'Foundational to Int',
      duration: '75 Mins',
      audience: 'Teens & Adults',
      schedule: 'Sat & Sun · Morning Masterclass (09:00 AM)',
      instructor: 'Senior Contemporary Mentor'
    },
    {
      id: 'bollywood',
      index: '03',
      title: 'Bollywood Commercial & Filmi',
      tagline: 'High energy, theatrical expressions, and chart-topping fusion.',
      description: 'Celebrate Indian cinema with high-octane commercial choreography, semi-classical lyrical touches, and infectious folk fusion. A high-spirit class guaranteed to leave you smiling and sweating.',
      image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1000&auto=format&fit=crop&q=85',
      level: 'Beginner to Pro',
      duration: '60 Mins',
      audience: 'All Age Groups',
      schedule: 'Mon / Wed / Fri · Evening Batch (06:30 PM)',
      instructor: 'Senior Filmi Choreographer'
    },
    {
      id: 'zumba',
      index: '04',
      title: 'Zumba & Dance Fitness',
      tagline: 'Burn 600+ calories with cardio toning and infectious rhythms.',
      description: 'The ultimate mood-boosting workout combining Latin, pop, and Punjabi rhythms with interval training and full-body toning. Perfect for stress-busting and cardio stamina.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&auto=format&fit=crop&q=85',
      level: 'High Cardio',
      duration: '50 Mins',
      audience: 'Fitness Seekers',
      schedule: 'Mon / Wed / Fri · Morning Batch (08:00 AM)',
      instructor: 'Certified Zumba Coach'
    },
    {
      id: 'kathak',
      index: '05',
      title: 'Kathak Classical Foundations',
      tagline: 'Graceful tatkar footwork, mudras, chakkars, and abhinaya.',
      description: 'Immerse in one of India’s most revered classical disciplines. Learn intricate footwork patterns, expressive hand gestures, pirouettes, and traditional storytelling under disciplined gurus.',
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1000&auto=format&fit=crop&q=85',
      level: 'Classical Track',
      duration: '60 Mins',
      audience: 'Kids & Adults',
      schedule: 'Sat & Sun · Classical Batch (10:30 AM)',
      instructor: 'Kathak Guru'
    },
    {
      id: 'kids',
      index: '06',
      title: 'Kids Dance Academy (4–14 Yrs)',
      tagline: 'Rhythm, coordination, creative posture, and stage confidence.',
      description: 'A structured, joyful curriculum designed specifically for young movers. Develops motor skills, musicality, teamwork, and performance readiness for annual stage recitals.',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1000&auto=format&fit=crop&q=85',
      level: 'Ages 4–14',
      duration: '50 Mins',
      audience: 'Kids & Teens',
      schedule: 'Tue / Thu / Sat · After-School Batch (05:00 PM)',
      instructor: 'Child Movement Specialist'
    },
    {
      id: 'wedding',
      index: '07',
      title: 'Wedding & Sangeet Choreography',
      tagline: 'Custom couple entries, family flashmobs, and bespoke medleys.',
      description: 'Tailored private rehearsal sessions for brides, grooms, families, and friends. Includes personalized audio track mashups and step-by-step video tutorials for effortless home rehearsal.',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1000&auto=format&fit=crop&q=85',
      level: 'Custom Tailored',
      duration: 'Flexible Slots',
      audience: 'Couples & Families',
      schedule: 'Private Appointments (Morning / Evening)',
      instructor: 'Sangeet Choreography Team'
    }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('spatialClassesList');
    const stageImage = document.getElementById('spatialStageImg');
    const stageIndex = document.getElementById('spatialStageIndex');
    const stageLevel = document.getElementById('spatialStageLevel');
    const stageTitle = document.getElementById('spatialStageTitle');
    const stageTagline = document.getElementById('spatialStageTagline');
    const stageDesc = document.getElementById('spatialStageDesc');
    const stageMeta = document.getElementById('spatialStageMeta');
    const stageBookBtn = document.getElementById('spatialStageBookBtn');
    const stageWaBtn = document.getElementById('spatialStageWaBtn');
    const stageCard = document.getElementById('spatialStageCard');

    if (!listContainer) return;

    let activeIndex = 0;

    function renderClass(index) {
      const item = classesData[index];
      if (!item) return;

      // Highlight active list item
      const listItems = listContainer.querySelectorAll('.spatial-class-nav-item');
      listItems.forEach((el, idx) => {
        if (idx === index) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }
      });

      // Spatial depth transition
      if (stageCard) {
        stageCard.style.opacity = '0.4';
        stageCard.style.transform = 'perspective(1000px) translateZ(-40px) scale(0.96)';
      }

      setTimeout(() => {
        if (stageImage) stageImage.src = item.image;
        if (stageIndex) stageIndex.textContent = item.index;
        if (stageLevel) stageLevel.textContent = item.level;
        if (stageTitle) stageTitle.textContent = item.title;
        if (stageTagline) stageTagline.textContent = item.tagline;
        if (stageDesc) stageDesc.textContent = item.description;
        if (stageMeta) {
          stageMeta.innerHTML = `
            <span>⏱️ ${item.duration}</span>
            <span>·</span>
            <span>👥 ${item.audience}</span>
            <span>·</span>
            <span>🗓️ ${item.schedule}</span>
          `;
        }

        if (stageBookBtn) {
          stageBookBtn.setAttribute('data-class-name', item.title);
        }

        if (stageWaBtn) {
          stageWaBtn.onclick = () => window.triggerWhatsAppChat(item.title);
        }

        if (stageCard) {
          stageCard.style.opacity = '1';
          stageCard.style.transform = 'perspective(1000px) translateZ(0) scale(1)';
        }
      }, 140);
    }

    // Build Nav List
    listContainer.innerHTML = '';
    classesData.forEach((item, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `spatial-class-nav-item ${idx === 0 ? 'is-active' : ''}`;
      button.innerHTML = `
        <span class="nav-item-index">${item.index}</span>
        <span class="nav-item-name">${item.title}</span>
        <span class="nav-item-arrow">→</span>
      `;

      button.addEventListener('mouseenter', () => {
        if (activeIndex !== idx) {
          activeIndex = idx;
          renderClass(idx);
        }
      });

      button.addEventListener('click', () => {
        activeIndex = idx;
        renderClass(idx);
      });

      listContainer.appendChild(button);
    });

    // Initial render
    renderClass(0);
  });

})();
