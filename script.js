/**
 * Annam Dental Clinic — Global JavaScript
 * Vanilla JS only — no frameworks, no jQuery
 */

(function () {
  'use strict';

  /* ── Hamburger Menu ─────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ── Active Nav Link ────────────────────────────────────── */
  // Mark the current page link as active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ── Contact Form Validation ────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // Only intercept for mailto fallback (not Formspree)
      if (contactForm.action && contactForm.action.includes('formspree')) {
        return; // Let Formspree handle it
      }
      e.preventDefault();

      const name = document.getElementById('fieldName');
      const phone = document.getElementById('fieldPhone');
      const message = document.getElementById('fieldMessage');
      let valid = true;

      [name, phone, message].forEach(function (field) {
        if (!field || !field.value.trim()) {
          field && field.classList.add('field-error');
          valid = false;
        } else {
          field && field.classList.remove('field-error');
        }
      });

      if (valid && successMsg) {
        contactForm.reset();
        successMsg.classList.add('visible');
        setTimeout(function () {
          successMsg.classList.remove('visible');
        }, 6000);
      }
    });

    // Remove error highlight on input
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('field-error');
      });
    });
  }

  /* ── Formspree AJAX submission ──────────────────────────── */
  if (contactForm && contactForm.action && contactForm.action.includes('formspree')) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(contactForm);
      fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          contactForm.reset();
          if (successMsg) successMsg.classList.add('visible');
          setTimeout(function () {
            if (successMsg) successMsg.classList.remove('visible');
          }, 6000);
        }
      }).catch(function () {
        // Silent fail — fallback to normal submit
        contactForm.submit();
      });
    });
  }

  /* ── Animated Star Ratings — IntersectionObserver ───────── */
  const starGroups = document.querySelectorAll('.stars');
  if (starGroups.length > 0 && 'IntersectionObserver' in window) {
    const starObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          starObserver.unobserve(entry.target); // animate once only
        }
      });
    }, { threshold: 0.5 });

    starGroups.forEach(function (group) {
      starObserver.observe(group);
    });
  } else {
    // Fallback: animate immediately if observer not supported
    starGroups.forEach(function (group) {
      group.classList.add('animate');
    });
  }

  /* ── Testimonials Carousel ───────────────────────────────── */
  const carousel = document.getElementById('testimonialsCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dots = document.querySelectorAll('.testimonials-dot');
  const cards = carousel ? carousel.querySelectorAll('.testimonial-card') : [];

  if (carousel && cards.length > 0) {
    var currentIndex = 0;

    function getCardWidth() {
      return cards[0].offsetWidth + 24; // card width + gap
    }

    function scrollToCard(index) {
      if (index < 0) index = 0;
      if (index >= cards.length) index = cards.length - 1;
      currentIndex = index;
      carousel.scrollTo({ left: getCardWidth() * index, behavior: 'smooth' });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        scrollToCard(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        scrollToCard(currentIndex + 1);
      });
    }

    // Dot click navigation
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        scrollToCard(parseInt(dot.getAttribute('data-index'), 10));
      });
    });

    // Sync dots with scroll position (covers swipe on mobile)
    carousel.addEventListener('scroll', function () {
      var scrollLeft = carousel.scrollLeft;
      var idx = Math.round(scrollLeft / getCardWidth());
      if (idx !== currentIndex) {
        currentIndex = idx;
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }, { passive: true });
  }

})();
