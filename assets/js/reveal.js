// Scroll reveal for content sections
// Lightweight scroll-triggered fade-in animations

export function initReveal() {
  var observed = document.querySelectorAll('[data-reveal]');
  if (!observed.length) {
    // Auto-apply to section-yintu children if no data-reveal attributes
    var sections = document.querySelectorAll('.section-yintu > *');
    for (var i = 0; i < sections.length; i++) {
      sections[i].setAttribute('data-reveal', '');
      sections[i].style.opacity = '0';
      sections[i].style.transform = 'translateY(20px)';
      sections[i].style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    observed = document.querySelectorAll('[data-reveal]');
  }

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    for (var i = 0; i < observed.length; i++) {
      observed[i].style.opacity = '1';
      observed[i].style.transform = 'none';
    }
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.style.opacity = '1';
        entries[i].target.style.transform = 'none';
        observer.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  for (var i = 0; i < observed.length; i++) {
    observer.observe(observed[i]);
  }
}
