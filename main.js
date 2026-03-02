(() => {
  const carousels = document.querySelectorAll('.device-carousel');
  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    const slides = Array.from(
      viewport?.querySelectorAll('.carousel-slide') || []
    );
    let index = 0;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, idx) =>
        s.classList.toggle('is-active', idx === index)
      );
    };

    const buttons = carousel.querySelectorAll('.carousel-btn');
    buttons.forEach((btn) =>
      btn.addEventListener('click', () => {
        const dir = Number(btn.dataset.dir || 1);
        show(index + dir);
      })
    );

    show(0);
  });
})();
