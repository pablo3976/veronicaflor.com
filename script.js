/* ============================================================
   VERÓNICA FLOR — Abogada
   Main JavaScript · Scroll · Navigation · Form Validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- 0. Initialize EmailJS ----- */
  // Reemplazar 'YOUR_PUBLIC_KEY' con tu llave pública de EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init('i6DS-n3Oiv3Cjl1QR');
  }

  /* ----- 1. Sticky Header Scroll Effect ----- */
  const header = document.getElementById('header');
  const SCROLL_THRESHOLD = 50;

  const handleHeaderScroll = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on load


  /* ----- 2. Smooth Scroll Navigation ----- */
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Close mobile menu if open
      const nav = document.getElementById('nav');
      if (nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }

      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL hash without jumping
      history.pushState(null, '', targetId);
    });
  });


  /* ----- 3. Mobile Menu Toggle ----- */
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }


  /* ----- 4. Active Nav Link on Scroll ----- */
  const sections = document.querySelectorAll('section[id]');

  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.header__link[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavLink, { passive: true });
  highlightNavLink();


  /* ----- 5. Contact Form Validation ----- */
  const form = document.getElementById('contact-form');

  if (form) {
    const fields = {
      name: {
        el: document.getElementById('contact-name'),
        error: document.getElementById('error-name'),
        validate(value) {
          if (!value.trim()) return 'El nombre es obligatorio.';
          if (value.trim().length < 2) return 'Ingresá al menos 2 caracteres.';
          return '';
        }
      },
      email: {
        el: document.getElementById('contact-email'),
        error: document.getElementById('error-email'),
        validate(value) {
          if (!value.trim()) return 'El email es obligatorio.';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return 'Ingresá un email válido.';
          return '';
        }
      },
      phone: {
        el: document.getElementById('contact-phone'),
        error: document.getElementById('error-phone'),
        validate(value) {
          if (value.trim() && !/^[\d\s\-+()]{7,20}$/.test(value)) {
            return 'Ingresá un teléfono válido.';
          }
          return '';
        }
      },
      message: {
        el: document.getElementById('contact-message'),
        error: document.getElementById('error-message'),
        validate(value) {
          if (!value.trim()) return 'El mensaje es obligatorio.';
          if (value.trim().length < 10) return 'Escribí al menos 10 caracteres.';
          return '';
        }
      }
    };

    // Real-time validation on blur
    Object.values(fields).forEach(field => {
      if (field.el) {
        field.el.addEventListener('blur', () => {
          const msg = field.validate(field.el.value);
          setFieldError(field, msg);
        });

        // Clear error on input
        field.el.addEventListener('input', () => {
          if (field.el.classList.contains('is-invalid')) {
            const msg = field.validate(field.el.value);
            setFieldError(field, msg);
          }
        });
      }
    });

    function setFieldError(field, message) {
      if (message) {
        field.el.classList.add('is-invalid');
        field.el.classList.remove('is-valid');
        field.error.textContent = message;
      } else {
        field.el.classList.remove('is-invalid');
        field.el.classList.add('is-valid');
        field.error.textContent = '';
      }
    }

    // Submit handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      Object.values(fields).forEach(field => {
        const msg = field.validate(field.el.value);
        setFieldError(field, msg);
        if (msg) isValid = false;
      });

      if (!isValid) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Success feedback & EmailJS Sending
      const submitBtn = document.getElementById('contact-submit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      // EmailJS Logic
      // Reemplazar 'YOUR_SERVICE_ID' y 'YOUR_TEMPLATE_ID' con tus IDs de EmailJS
      emailjs.sendForm('service_ynz99pv', 'template_10rh26r', form)
        .then(() => {
          submitBtn.textContent = '¡Enviado con éxito!';
          submitBtn.classList.add('btn--success');

          setTimeout(() => {
            form.reset();
            resetSubmitBtn();
          }, 3000);
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          submitBtn.textContent = 'Error al enviar';
          submitBtn.style.backgroundColor = '#e74c3c';

          setTimeout(() => {
            resetSubmitBtn();
            submitBtn.style.backgroundColor = '';
          }, 3000);
        });

      function resetSubmitBtn() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn--success');
        Object.values(fields).forEach(field => {
          field.el.classList.remove('is-valid', 'is-invalid');
          field.error.textContent = '';
        });
      }
    });
  }


  /* ----- 6. Scroll Reveal Animation ----- */
  const revealElements = document.querySelectorAll(
    '.service-card, .value-card, .about__content, .about__image-wrapper, .contact__form, .contact__info'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

});
