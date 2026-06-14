// Shared navigation — fully JS-driven
(function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    {
      label: 'Why Legacy Land?',
      children: [
        { label: 'About', href: 'about.html' },
        { label: 'Leadership', href: 'leadership.html' },
        { label: 'FAQ', href: 'faq.html' },
      ]
    },
    {
      label: 'Education & Care',
      children: [
        { label: 'Programs', href: 'programs.html' },
        { label: 'Curriculum', href: 'curriculum.html' },
        { label: 'Gallery', href: 'gallery.html' },
        { label: 'Policies', href: 'policies.html' },
      ]
    },
    {
      label: 'Enrollment',
      children: [
        { label: 'Request Info', href: 'request-info.html' },
        { label: 'Enrollment', href: 'enrollment.html' },
      ]
    },
    {
      label: 'Contact Us',
      href: 'contact.html'
    }
  ];

  // Build nav DOM
  const nav = document.createElement('nav');
  nav.id = 'site-nav';

  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'nav-logo';
  logo.innerHTML = '<img src="images/logo.png" alt="Legacy Land Academy">';
  nav.appendChild(logo);

  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation menu');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(toggle);

  const ul = document.createElement('ul');
  ul.className = 'nav-links';

  navItems.forEach(item => {
    const li = document.createElement('li');

    if (item.href) {
      // Direct link — no dropdown
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'nav-parent';
      a.textContent = item.label;
      a.style.cssText = 'cursor:pointer;';
      if (item.href === currentPath) a.classList.add('active');
      li.appendChild(a);
    } else {
      // Dropdown item
      li.className = 'has-dropdown';

      const parent = document.createElement('a');
      parent.href = '#';
      parent.className = 'nav-parent';
      parent.textContent = item.label;
      parent.setAttribute('aria-expanded', 'false');
      parent.setAttribute('aria-haspopup', 'true');

      const dropdown = document.createElement('ul');
      dropdown.className = 'dropdown';
      dropdown.setAttribute('aria-hidden', 'true');

      item.children.forEach(child => {
        const childLi = document.createElement('li');
        const a = document.createElement('a');
        a.href = child.href;
        a.textContent = child.label;
        if (child.href === currentPath) {
          a.classList.add('active');
          parent.classList.add('active');
        }
        childLi.appendChild(a);
        dropdown.appendChild(childLi);
      });

      li.appendChild(parent);
      li.appendChild(dropdown);
    }

    ul.appendChild(li);
  });

  nav.appendChild(ul);
  document.body.insertAdjacentElement('afterbegin', nav);

  // ── Dropdown logic ──
  const allParents = nav.querySelectorAll('.nav-parent');
  const closeTimers = new Map();

  function openDropdown(parent) {
    if (closeTimers.has(parent)) {
      clearTimeout(closeTimers.get(parent));
      closeTimers.delete(parent);
    }
    parent.setAttribute('aria-expanded', 'true');
    parent.nextElementSibling.setAttribute('aria-hidden', 'false');
    parent.closest('.has-dropdown').classList.add('open');
  }

  function closeDropdown(parent, delay = 120) {
    const timer = setTimeout(() => {
      parent.setAttribute('aria-expanded', 'false');
      parent.nextElementSibling.setAttribute('aria-hidden', 'true');
      parent.closest('.has-dropdown').classList.remove('open');
      closeTimers.delete(parent);
    }, delay);
    closeTimers.set(parent, timer);
  }

  function closeAll() {
    allParents.forEach(p => closeDropdown(p, 0));
  }

  allParents.forEach(parent => {
    const li = parent.closest('.has-dropdown');

    li.addEventListener('mouseenter', () => openDropdown(parent));
    li.addEventListener('mouseleave', () => closeDropdown(parent));

    // Toggle on click (touch / keyboard)
    parent.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = parent.getAttribute('aria-expanded') === 'true';
      closeAll();
      if (!isOpen) openDropdown(parent);
    });
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeAll();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });

  // ── Mobile menu toggle ──
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    toggle.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-lock', isOpen);
    if (!isOpen) closeAll();
  });

  // Close mobile menu when a direct link is clicked
  ul.querySelectorAll('li > a.nav-parent[href]:not([href="#"])').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.classList.remove('active');
      document.body.classList.remove('nav-lock');
    });
  });

  ul.querySelectorAll('.dropdown a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.classList.remove('active');
      document.body.classList.remove('nav-lock');
    });
  });
})();
