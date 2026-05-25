(function () {

  // Nav scroll effect
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Modal logic
  function openModal(id) {
    const backdrop = document.getElementById('modal-' + id);
    if (!backdrop) return;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    backdrop.querySelector('.modal-close').focus();
  }

  function closeModal(backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      openModal(trigger.dataset.modal);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.querySelector('.modal-close').addEventListener('click', () => closeModal(backdrop));
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
    }
  });

  // Contact form → Formspree
  // Sign up at formspree.io, create a form, and paste your form ID below.
  const FORMSPREE_ID = 'XXXXXXXX';

  document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (document.getElementById('hp-website').value) return;

    const btn = this.querySelector('.form-submit');
    const success = document.getElementById('form-success');
    const error = document.getElementById('form-error');

    error.style.display = 'none';
    btn.textContent = 'Wird gesendet…';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this),
      });

      if (!res.ok) throw new Error(res.status);

      success.style.display = 'block';
      btn.style.display = 'none';
      this.reset();
    } catch {
      btn.textContent = 'Nachricht senden';
      btn.disabled = false;
      error.style.display = 'block';
    }
  });

})();
