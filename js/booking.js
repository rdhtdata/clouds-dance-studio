/**
 * CLOUDS DANCE STUDIO — Booking & WhatsApp Dispatch System
 * Handles modal lifecycle, pre-fill logic, input validation, and WhatsApp message compilation.
 */

(function () {
  'use strict';

  const STUDIO_WHATSAPP_NUMBER = '918971982221'; // Primary WhatsApp (+91 8971982221)
  const BACKUP_WHATSAPP_NUMBER = '919900903012'; // Secondary (+91 9900903012)

  // Open Modal Functions
  window.openBookingModal = function (preferredClass = '') {
    const modalBackdrop = document.getElementById('bookingModal');
    const classSelect = document.getElementById('bookingClass');
    const formContent = document.getElementById('modalFormContent');
    const formSuccess = document.getElementById('modalSuccessState');

    if (!modalBackdrop) return;

    if (preferredClass && classSelect) {
      // Find matching option
      for (let i = 0; i < classSelect.options.length; i++) {
        if (classSelect.options[i].value.toLowerCase() === preferredClass.toLowerCase() ||
            classSelect.options[i].text.toLowerCase().includes(preferredClass.toLowerCase()) ||
            preferredClass.toLowerCase().includes(classSelect.options[i].value.toLowerCase())) {
          classSelect.selectedIndex = i;
          break;
        }
      }
    }

    modalBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Reset view if previously submitted
    if (formContent && formSuccess) {
      formContent.style.display = 'block';
      formSuccess.classList.remove('is-active');
    }
  };

  window.closeBookingModal = function () {
    const modalBackdrop = document.getElementById('bookingModal');
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  // Event Listeners for Open Triggers
  document.addEventListener('DOMContentLoaded', function () {
    const modalBackdrop = document.getElementById('bookingModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const bookingForm = document.getElementById('bookingForm');
    const formContent = document.getElementById('modalFormContent');
    const formSuccess = document.getElementById('modalSuccessState');
    const classSelect = document.getElementById('bookingClass');
    const whatsappDirectBtn = document.getElementById('whatsappDirectSubmit');
    const successWhatsappLink = document.getElementById('successWhatsappLink');

    const triggerButtons = document.querySelectorAll('[data-open-modal="booking"], .btn-book-trigger');
    triggerButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const specificClass = this.getAttribute('data-class-name') || '';
        window.openBookingModal(specificClass);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', window.closeBookingModal);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) {
          window.closeBookingModal();
        }
      });
    }

    // Keyboard Escape to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-active')) {
        window.closeBookingModal();
      }
    });

    // Form Submission Handler
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('bookingName')?.value.trim() || 'Dancer';
        const phone = document.getElementById('bookingPhone')?.value.trim() || '';
        const email = document.getElementById('bookingEmail')?.value.trim() || 'Not provided';
        const branch = document.getElementById('bookingBranch')?.value || 'Haralur Road (Main Studio)';
        const selectedClass = classSelect ? classSelect.options[classSelect.selectedIndex].text : 'General Inquiry';
        const batch = document.getElementById('bookingBatch')?.value || 'Flexible';
        const level = document.getElementById('bookingLevel')?.value || 'Beginner';
        const note = document.getElementById('bookingNote')?.value.trim() || '';

        // Validation
        if (!phone || phone.length < 8) {
          alert('Please enter a valid phone or WhatsApp number so we can confirm your slot.');
          return;
        }

        // Generate WhatsApp Message Payload
        let waText = `👋 Hi Clouds Dance Studio! I would like to book a Trial Class / Enquiry.\n\n`;
        waText += `👤 *Name:* ${name}\n`;
        waText += `📞 *Phone:* ${phone}\n`;
        waText += `📍 *Preferred Branch:* ${branch}\n`;
        waText += `💃 *Dance Style:* ${selectedClass}\n`;
        waText += `🗓️ *Preferred Batch:* ${batch}\n`;
        waText += `🌟 *Experience Level:* ${level}\n`;
        if (email && email !== 'Not provided') {
          waText += `📧 *Email:* ${email}\n`;
        }
        if (note) {
          waText += `💬 *Note:* ${note}\n`;
        }
        waText += `\n📍 Clouds Dance Studio · Bengaluru`;

        const encodedWaUrl = `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

        // Show Success UI
        if (formContent && formSuccess) {
          formContent.style.display = 'none';
          formSuccess.classList.add('is-active');
          if (successWhatsappLink) {
            successWhatsappLink.href = encodedWaUrl;
          }
        }

        // Open WhatsApp automatically
        setTimeout(() => {
          window.open(encodedWaUrl, '_blank');
        }, 350);
      });
    }

    // Direct Quick WhatsApp button in Modal
    if (whatsappDirectBtn) {
      whatsappDirectBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const selectedClass = classSelect ? classSelect.options[classSelect.selectedIndex].text : 'Dance Classes';
        const waMsg = `Hi Clouds Dance Studio! I am interested in joining ${selectedClass} at your Haralur / HSR studio. Could you please share the current schedule, batch timings, and trial class details?`;
        const url = `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
        window.open(url, '_blank');
      });
    }
  });

  // Global helper for direct WhatsApp CTAs across the site
  window.triggerWhatsAppChat = function (customSubject = 'dance classes') {
    const text = `Hi Clouds Dance Studio! I'm interested in joining ${customSubject}. I'd love to know more about the available batches and book a trial class.`;
    window.open(`https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

})();
