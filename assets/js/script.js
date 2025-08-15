// Smooth scroll + header nav toggle + active link state
const qs = (s, x = document) => x.querySelector(s);
const qsa = (s, x = document) => [...x.querySelectorAll(s)];

// Year
qs('#y').textContent = new Date().getFullYear();

// Mobile nav
const toggle = qs('.nav__toggle');
const menu = qs('#menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.getAttribute('data-open') === 'true';
    menu.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
}

// Smooth scroll (no jank)
qsa('a[data-nav]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const el = qs(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile menu after selection
    if (menu) {
      menu.setAttribute('data-open', 'false');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// IntersectionObserver to highlight current section in nav
const sections = qsa('main.section, section.section');
const navLinks = new Map(qsa('a[data-nav]').map(a => [a.getAttribute('href'), a]));
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = `#${entry.target.id}`;
      navLinks.forEach(link => link.classList.remove('is-active'));
      navLinks.get(id)?.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

sections.forEach(s => io.observe(s));

// Keyboard focus styles for nav links
const style = document.createElement('style');
style.textContent = `
  .nav__list a.is-active { color: var(--accent-hi); text-shadow: 0 0 10px color-mix(in oklab, var(--accent-hi), transparent 60%); }
  .nav__list a:focus-visible { outline: 2px solid color-mix(in oklab, var(--accent), transparent 60%); outline-offset: 3px; border-radius: 6px; }
`;
document.head.append(style);

// Optional: reduce motion respect
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('*').forEach(el => el.style.scrollBehavior = 'auto');
}
