(function(){
  const body = document.body;
  const docEl = document.documentElement;
  const navToggle = document.querySelector('[data-toggle-nav]');
  const menu = document.getElementById('primary-menu');

  const closeNav = () => {
    if (!body.classList.contains('nav-open')) return;
    body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
      const isOpen = body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.tagName === 'A') {
        closeNav();
      }
    });

    document.addEventListener('click', (event) => {
      if (!body.classList.contains('nav-open')) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menu.contains(target) && target !== navToggle) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeNav();
      }
    });
  }

  const themeToggle = document.querySelector('[data-toggle-theme]');
  const labelEl = themeToggle?.querySelector('span');
  const storageKey = 'theme';

  const applyTheme = (theme) => {
    const value = theme === 'dark' ? 'dark' : 'light';
    docEl.setAttribute('data-theme', value);
    if (labelEl) {
      labelEl.textContent = value === 'dark' ? 'Clair' : 'Sombre';
    }
    if (themeToggle) {
      const title = value === 'dark' ? 'Revenir au mode clair' : 'Basculer en mode sombre';
      themeToggle.setAttribute('aria-label', title);
      themeToggle.setAttribute('aria-pressed', value === 'dark' ? 'true' : 'false');
    }
  };

  const storedTheme = localStorage.getItem(storageKey);
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const initial = docEl.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
    applyTheme(initial);
    prefersDark.addEventListener('change', (event) => {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  themeToggle?.addEventListener('click', () => {
    const next = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(storageKey, next);
  });
})();
