/**
 * Sweet Crumbs Bakery - Main JavaScript
 * Version: 1.0
 * Author: Senior Frontend Developer
 */

'use strict';

/* =========================================
   LOADING SCREEN
   ========================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 1900);
});

/* =========================================
   NAVBAR – Sticky, Hamburger, Active Link
   ========================================= */
(function initNavbar() {
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!navbar) return;

  // Scroll → add .scrolled
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateScrollTopBtn();
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active link based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* =========================================
   SCROLL-TO-TOP BUTTON
   ========================================= */
function updateScrollTopBtn() {
  const btn = document.getElementById('scroll-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
}

const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* =========================================
   SCROLL REVEAL ANIMATION
   ========================================= */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* =========================================
   TESTIMONIALS CAROUSEL
   ========================================= */
(function initTestimonials() {
  const track  = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  if (!track || !slides.length) return;

  let current = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  // Swipe support
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
  });

  goTo(0);
  startAuto();
})();

/* =========================================
   PRODUCT / MENU FILTER (menu.html)
   ========================================= */
(function initFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const menuItems  = document.querySelectorAll('.menu-item');
  if (!filterTabs.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.filter;
      menuItems.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hidden', !match);
        if (match) {
          item.style.animation = 'none';
          requestAnimationFrame(() => { item.style.animation = ''; });
        }
      });
    });
  });
})();

/* =========================================
   GALLERY LIGHTBOX
   ========================================= */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content  = document.querySelector('.lightbox-content');
  const closeBtn = document.querySelector('.lightbox-close');
  const items    = document.querySelectorAll('.gallery-item');
  if (!lightbox) return;

  function openLightbox(emoji) {
    content.innerHTML = emoji;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const em = item.dataset.emoji || item.querySelector('span')?.textContent || '🍰';
      openLightbox(em);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* =========================================
   SMOOTH SCROLLING (for anchor links)
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =========================================
   CONTACT FORM VALIDATION
   ========================================= */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name  = form.querySelector('#c-name');
    const email = form.querySelector('#c-email');
    const msg   = form.querySelector('#c-message');

    [name, email, msg].forEach(el => {
      const err = el.parentElement.querySelector('.form-error');
      el.classList.remove('error');
      if (err) err.classList.remove('visible');
    });

    if (!name.value.trim()) {
      showError(name, 'Please enter your name.');
      valid = false;
    }
    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
      showError(email, 'Please enter a valid email.');
      valid = false;
    }
    if (!msg.value.trim() || msg.value.length < 10) {
      showError(msg, 'Message must be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      const successEl = document.querySelector('.form-success');
      if (successEl) successEl.classList.add('visible');
      form.reset();
      setTimeout(() => successEl && successEl.classList.remove('visible'), 5000);
    }
  });
})();

/* =========================================
   ORDER FORM VALIDATION (order.html)
   ========================================= */
(function initOrderForm() {
  const form = document.getElementById('order-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);
    let valid = true;

    const fields = [
      { id: 'o-name',    rule: v => v.trim().length >= 2, msg: 'Please enter your full name.' },
      { id: 'o-phone',   rule: v => /^[\d\s\-\+]{8,}$/.test(v), msg: 'Enter a valid phone number.' },
      { id: 'o-email',   rule: v => /\S+@\S+\.\S+/.test(v), msg: 'Enter a valid email address.' },
      { id: 'o-flavor',  rule: v => v !== '', msg: 'Please select a cake flavor.' },
      { id: 'o-size',    rule: v => v !== '', msg: 'Please select a cake size.' },
      { id: 'o-date',    rule: v => v !== '', msg: 'Please select a delivery date.' },
    ];

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (el && !f.rule(el.value)) {
        showError(el, f.msg);
        valid = false;
      }
    });

    if (valid) {
      const successEl = document.querySelector('.form-success');
      if (successEl) successEl.classList.add('visible');
      form.reset();
      window.scrollTo({ top: successEl?.offsetTop - 100, behavior: 'smooth' });
      setTimeout(() => successEl && successEl.classList.remove('visible'), 6000);
    }
  });
})();

/* =========================================
   NEWSLETTER FORM
   ========================================= */
(function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (!input) return;
      if (!/\S+@\S+\.\S+/.test(input.value)) {
        input.style.borderColor = '#e74c3c';
        input.placeholder = 'Please enter a valid email!';
        setTimeout(() => { input.style.borderColor = ''; input.placeholder = 'Your email address'; }, 2500);
        return;
      }
      const btn = form.querySelector('button');
      if (btn) { btn.textContent = '🎉 Subscribed!'; btn.disabled = true; }
      input.value = '';
      setTimeout(() => {
        if (btn) { btn.textContent = 'Subscribe'; btn.disabled = false; }
      }, 3500);
    });
  });
})();

/* =========================================
   HELPER: showError / clearErrors
   ========================================= */
function showError(input, message) {
  input.classList.add('error');
  let err = input.parentElement.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error';
    input.parentElement.appendChild(err);
  }
  err.textContent = message;
  err.classList.add('visible');
}

function clearErrors(form) {
  form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
}

/* =========================================
   COUNTER ANIMATION (stats)
   ========================================= */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* =========================================
   MARQUEE – clone items for seamless loop
   ========================================= */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  const clone = track.innerHTML;
  track.innerHTML += clone; // duplicate for loop
})();

/* =========================================
   ACTIVE NAV LINK ON SCROLL (index.html)
   ========================================= */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* =========================================
   CATEGORY CARD HOVER EFFECT
   ========================================= */
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', function () {
    const filter = this.dataset.filter;
    if (filter && window.location.pathname.includes('menu')) {
      const tab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
      if (tab) tab.click();
    } else if (filter) {
      window.location.href = `menu.html?cat=${filter}`;
    }
  });
});

/* =========================================
   URL PARAM → AUTO FILTER (menu.html)
   ========================================= */
(function initUrlFilter() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (!cat) return;
  const tab = document.querySelector(`.filter-tab[data-filter="${cat}"]`);
  if (tab) { tab.click(); window.scrollTo({ top: 0 }); }
})();
