// Shared page scripts

// Scroll reveal
(function () {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// Nav shrink on scroll
(function () {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  function update() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // run on load in case page is already scrolled
})();
