(() => {
  const carousels = document.querySelectorAll('.device-carousel');
  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    const slides = Array.from(
      viewport?.querySelectorAll('.carousel-slide') || []
    );
    if (!viewport || slides.length === 0) return;

    viewport.setAttribute('tabindex', '0');
    viewport.setAttribute('role', 'group');
    viewport.setAttribute('aria-label', '画像カルーセル。左右キーで切り替えられます。');

    const footer = document.createElement('div');
    footer.className = 'carousel-footer';

    const caption = document.createElement('p');
    caption.className = 'carousel-caption';

    const controls = document.createElement('div');
    controls.className = 'carousel-progress';

    const counter = document.createElement('span');
    counter.className = 'carousel-count';

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';

    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `${idx + 1}枚目を表示`);
      dot.addEventListener('click', () => show(idx));
      dots.appendChild(dot);
    });

    controls.append(counter, dots);
    footer.append(caption, controls);
    viewport.insertAdjacentElement('afterend', footer);

    let index = 0;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, idx) =>
        s.classList.toggle('is-active', idx === index)
      );
      const activeSlide = slides[index];
      const activeImage = activeSlide.querySelector('img');
      const activeCaption = activeSlide.querySelector('figcaption');
      caption.textContent =
        activeCaption?.textContent?.trim() ||
        activeImage?.getAttribute('alt') ||
        '';
      counter.textContent = `${index + 1} / ${slides.length}`;
      Array.from(dots.children).forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === index);
        dot.setAttribute('aria-current', idx === index ? 'true' : 'false');
      });
    };

    const buttons = carousel.querySelectorAll('.carousel-btn');
    buttons.forEach((btn) =>
      btn.addEventListener('click', () => {
        const dir = Number(btn.dataset.dir || 1);
        show(index + dir);
      })
    );

    viewport.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show(index - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        show(index + 1);
      }
    });

    show(0);
  });
})();

(() => {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const navLinks = Array.from(document.querySelectorAll('.section-nav a'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  let ticking = false;

  const updateScrollUi = () => {
    const scrollTop = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    let activeId = sections[0]?.id || '';
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.35) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'is-active',
        link.getAttribute('href') === `#${activeId}`
      );
    });

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollUi);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateScrollUi();
})();
