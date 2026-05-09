/* ============================================================
   UV HOME — FAREWELL WEBSITE JAVASCRIPT
   Features: Splash, Countdown, Nav, Scroll Reveal, Gallery,
             Form Submission to Google Sheets, Back-to-Top
============================================================ */

'use strict';

/* ── CONFIG ─────────────────────────────────────────────────── */
const CONFIG = {
  splashDuration: 4000,           // ms before splash hides
  eventDateTime: new Date('2026-05-09T19:15:00+05:30'), // IST 7:15 PM

  // 👉 Replace this with your Google Apps Script web app URL after deploying
  googleScriptURL: 'https://script.google.com/macros/s/AKfycbyeu3wcgRy3rUXaujwIbTfRRZ-SaV3xVeglyILwLgY_0h9eGAzFUfJkrn3BMHhrReQ8/exec',
};

/* ── SPLASH SCREEN ──────────────────────────────────────────── */
(function initSplash() {
  const splash = document.getElementById('splash');
  const main   = document.getElementById('main');

  if (!splash || !main) return;

  setTimeout(() => {
    splash.classList.add('hide-splash');
    setTimeout(() => {
      splash.style.display = 'none';
      main.classList.remove('hidden');
      main.style.animation = 'fadeIn 0.5s ease';
    }, 800);
  }, CONFIG.splashDuration);
})();

/* ── LIVE CLOCK (IST) ───────────────────────────────────────── */
function updateClock() {
  const now = new Date();

  // IST = UTC+5:30
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60 * 1000);

  const dateEl = document.getElementById('todayDate');
  const timeEl = document.getElementById('istTime');

  if (dateEl) {
    dateEl.textContent = ist.toLocaleDateString('en-IN', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    });
  }

  if (timeEl) {
    timeEl.textContent = '🕐 IST ' + ist.toLocaleTimeString('en-IN', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}

setInterval(updateClock, 1000);
updateClock();

/* ── COUNTDOWN TIMER ────────────────────────────────────────── */
function updateCountdown() {
  const now  = new Date();
  const diff = CONFIG.eventDateTime - now;

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  if (!cdDays) return;

  if (diff <= 0) {
    // Event has started / passed
    cdDays.textContent  = '00';
    cdHours.textContent = '00';
    cdMins.textContent  = '00';
    cdSecs.textContent  = '🎉';
    const label = document.querySelector('.event-label');
    if (label) label.textContent = '🌟 The event is happening NOW!';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  cdDays.textContent  = String(days).padStart(2, '0');
  cdHours.textContent = String(hours).padStart(2, '0');
  cdMins.textContent  = String(mins).padStart(2, '0');
  cdSecs.textContent  = String(secs).padStart(2, '0');

  // Animate seconds box on change
  const cdSecs_box = cdSecs.parentElement;
  cdSecs_box.classList.remove('tick');
  void cdSecs_box.offsetWidth; // reflow
  cdSecs_box.classList.add('tick');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Add tick animation style dynamically
(function addTickStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .cd-box.tick span {
      animation: tickFlip 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes tickFlip {
      0%   { transform: scaleY(1); }
      30%  { transform: scaleY(0.85); color: var(--gold-light); }
      100% { transform: scaleY(1); }
    }
  `;
  document.head.appendChild(style);
})();

/* ── MOBILE NAV TOGGLE ──────────────────────────────────────── */
(function initNav() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.textContent = isOpen ? '✕' : '☰';
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.textContent = '☰';
    });
  });

  // Shrink nav on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.padding = '10px 20px';
    } else {
      navbar.style.padding = '14px 20px';
    }
  }, { passive: true });
})();

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger each item slightly
        const delay = (i % 4) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  items.forEach(item => observer.observe(item));
})();

/* ── GALLERY LIGHTBOX ───────────────────────────────────────── */
(function initGallery() {
  const items    = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbClose  = document.getElementById('lbClose');

  if (!lightbox || !lbImg) return;

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || 'Gallery Image';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const src = item.dataset.src || (img ? img.src : '');
      const alt = img ? img.alt : '';
      if (src) openLightbox(src, alt);
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();

/* ── MESSAGE FORM SUBMISSION ────────────────────────────────── */
(function initForm() {
  const form      = document.getElementById('msgForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = document.getElementById('btnText');
  const formMsg   = document.getElementById('formMsg');

  if (!form) return;

  function showMsg(text, type) {
    formMsg.textContent = text;
    formMsg.className = `form-feedback ${type}`;
    formMsg.classList.remove('hidden');
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.textContent = loading ? '⏳ Sending...' : '📤 Send Message';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name      = document.getElementById('fname').value.trim();
    const attending = form.querySelector('input[name="attending"]:checked');
    const comment   = document.getElementById('fcomment').value.trim();

    // Validation
    if (!name) {
      showMsg('⚠️ Please enter your name.', 'error');
      document.getElementById('fname').focus();
      return;
    }
    if (!attending) {
      showMsg('⚠️ Please select Yes or No.', 'error');
      return;
    }

    // Check if Google Script URL is configured
    if (CONFIG.googleScriptURL === 'https://script.google.com/macros/s/AKfycbyeu3wcgRy3rUXaujwIbTfRRZ-SaV3xVeglyILwLgY_0h9eGAzFUfJkrn3BMHhrReQ8/exec') {
      // Demo mode — show success without actually submitting
      setLoading(true);
      await delay(1500);
      setLoading(false);
      showMsg('✅ Message sent!  🌙 (Demo mode — connect Google Sheets to save)', 'success');
      form.reset();
      return;
    }

    setLoading(true);
    formMsg.classList.add('hidden');

    try {
      const data = new FormData();
      data.append('name',      name);
      data.append('attending', attending.value);
      data.append('comment',   comment);
      data.append('timestamp', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

      // Using no-cors because Google Apps Script Web Apps don't support CORS by default
      await fetch(CONFIG.googleScriptURL, {
        method: 'POST',
        body:   data,
        mode:   'no-cors',
      });

      // no-cors gives opaque response — assume success
      showMsg('✅ Message sent successfully !🌙', 'success');
      form.reset();

    } catch (err) {
      console.error('Form submission error:', err);
      showMsg('❌ Something went wrong. Please try again or call us directly!', 'error');
    } finally {
      setLoading(false);
    }
  });

  // Real-time validation styling
  document.getElementById('fname').addEventListener('input', function () {
    this.style.borderColor = this.value.trim() ? 'var(--green)' : '';
  });
})();

/* ── BACK TO TOP ────────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
      btn.classList.remove('hidden');
    } else {
      btn.classList.remove('show');
      btn.classList.add('hidden');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── ACTIVE NAV HIGHLIGHT ON SCROLL ────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--gold-light)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
})();

/* ── UTILITY ────────────────────────────────────────────────── */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── CONSOLE GREETING ───────────────────────────────────────── */
console.log('%c🌙 UV Home — Farewell & Home Tour', 'color:#c8a44a;font-size:18px;font-weight:bold;');
console.log('%cDate: 09 May 2026 | Time: 7:15 PM IST', 'color:#2a8c56;font-size:12px;');
console.log('%cVettikkattiri, Pandikkad, Malappuram 📍', 'color:#2a8c56;font-size:12px;');