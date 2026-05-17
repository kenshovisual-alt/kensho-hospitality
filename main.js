/**
 * main.js - Kensho
 * Shared across all pages.
 */

// ── Shared header/footer ─────────────────────────────────────────────────────
(function initSharedChrome() {
  const header = document.getElementById('header');
  const footer = document.querySelector('footer');
  if (!header && !footer) return;

  const path = window.location.pathname || '';
  const isEnglish = /\/en(\/|$)/.test(path);
  const normalizedPath = path.replace(/\/+$/, '');
  const basename = normalizedPath.split('/').pop() || 'index.html';
  const isRootPath = basename === '' || basename === '/';
  const pageKey = isRootPath ? 'home' : basename;

  const href = (file) => isEnglish ? `../${file}` : file;
  const legalHref = (file) => isEnglish ? `../${file}` : file;
  const assetHref = (file) => isEnglish ? `../${file}` : file;
  const homeHref = isEnglish ? 'index.html' : 'index.html';
  const logoHref = isEnglish ? 'index.html' : 'index.html';
  const englishHref = isEnglish ? '../index.html' : 'en/';
  const logoSrc = assetHref('assets/logo_kensho/Logo Kensho Hospitality.png');
  const currentYear = new Date().getFullYear();

  const pageState = {
    home: pageKey === 'home' || pageKey === 'index.html',
    servicios: pageKey === 'servicios.html',
    proyectos: pageKey === 'proyectos.html' || pageKey === 'caso-estudio-formacion-restaurante.html',
    planes: pageKey === 'precios.html' || pageKey === 'planes.html',
  };

  const desktopNavItems = isEnglish
    ? [
        { href: '#servicios', label: 'Services', active: false },
        { href: href('proyectos.html'), label: 'Projects', active: false },
      ]
    : [
        { href: href('servicios.html'), label: 'Servicios', active: pageState.servicios },
        { href: href('proyectos.html'), label: 'Proyectos', active: pageState.proyectos },
        { href: href('precios.html'), label: 'Precios', active: pageState.planes },
      ];

  const mobileNavGroups = isEnglish
    ? [
        {
          label: '',
          items: [
            { href: homeHref, label: 'Home', active: pageState.home },
            { href: '#servicios', label: 'Services', active: false },
            { href: href('proyectos.html'), label: 'Projects', active: false },
            { href: href('precios.html'), label: 'Plans', active: false },
            { href: href('recursos.html'), label: 'Resources', active: false },
            { href: href('blog.html'), label: 'Blog', active: false },
          ],
        },
      ]
    : [
        {
          label: '',
          items: [
            { href: homeHref, label: 'Home', active: pageState.home },
            { href: href('servicios.html'), label: 'Servicios', active: pageState.servicios },
            { href: href('proyectos.html'), label: 'Proyectos', active: pageState.proyectos },
            { href: href('precios.html'), label: 'Precios', active: pageState.planes },
            { href: href('recursos.html'), label: 'Recursos', active: false },
            { href: href('blog.html'), label: 'Blog', active: false },
          ],
        },
      ];

  const cta = isEnglish
    ? {
        label: 'Request your free audit',
        desktopHref: '#contacto',
        mobileHref: '#contacto',
        footerHref: '#contacto',
        desktopOnclick: '',
        mobileOnclick: 'closeMobileMenu()',
        footerOnclick: '',
      }
    : {
        label: 'Solicita tu auditoría gratuita',
        desktopHref: '#audit-modal',
        mobileHref:  '#audit-modal',
        footerHref:  '#audit-modal',
        desktopOnclick: 'openAuditModal(); return false;',
        mobileOnclick:  'closeMobileMenu(); openAuditModal(); return false;',
        footerOnclick:  'openAuditModal(); return false;',
      };

  const navClass = (active) => [
    'nav-link',
    'font-sans',
    'text-[0.8125rem]',
    'tracking-normal',
    active ? 'active' : '',
  ].filter(Boolean).join(' ');

  const mobileLinkClass = (active) => [
    'font-sans',
    'mobile-menu-link',
    active ? 'is-active' : 'text-charcoal hover:text-brown transition-colors',
  ].join(' ');

  if (header) {
    header.className = 'absolute top-0 left-0 right-0 z-50 h-16 px-4 md:px-10 lg:px-16';
    header.innerHTML = `
    <div class="max-w-7xl mx-auto flex items-center justify-between md:grid md:grid-cols-3 h-full">
      <div class="flex items-center">
        <a id="header-logo-mobile" href="${logoHref}" aria-label="Kensho" class="md:hidden inline-flex items-center select-none" style="position: relative; z-index: 70;">
          <img src="${logoSrc}" alt="" class="h-[2.5rem] w-auto" />
        </a>
        <nav class="hidden md:flex items-center gap-8" aria-label="${isEnglish ? 'Main navigation' : 'Navegación principal'}">
          ${desktopNavItems.map((item) => `<a href="${item.href}" class="${navClass(item.active)}">${item.label}</a>`).join('')}
        </nav>
      </div>

      <div class="hidden md:flex justify-center">
        <a id="header-logo-desktop" href="${logoHref}" aria-label="Kensho" class="inline-flex items-center select-none">
          <img src="${logoSrc}" alt="" class="h-[2.6rem] w-auto" />
        </a>
      </div>

      <div class="flex justify-end items-center">
        <div class="hidden md:flex items-center gap-4">
<a href="${cta.desktopHref}" class="btn-gradient btn-home-cinematic" ${cta.desktopOnclick ? `onclick="${cta.desktopOnclick}"` : ''}>
            ${cta.label}
          </a>
        </div>
        <button id="hamburger" aria-label="${isEnglish ? 'Open menu' : 'Abrir menú'}" aria-expanded="false" aria-controls="mobile-menu"
                class="md:hidden flex flex-col justify-center items-end w-9 h-9 gap-[5px]" style="position: relative; z-index: 70;">
          <span id="hline-t" class="hline block w-6 h-px bg-white"></span>
          <span id="hline-m" class="hline block w-6 h-px bg-white"></span>
          <span id="hline-b" class="hline block w-4 h-px bg-white"></span>
        </button>
      </div>
    </div>

    <div id="mobile-menu" class="md:hidden hidden">
      <nav class="mobile-menu-panel" aria-label="${isEnglish ? 'Mobile navigation' : 'Navegación móvil'}">
        <div class="mobile-menu-groups">
          ${mobileNavGroups.map((group) => `
            <div class="mobile-menu-group">
              ${group.label ? `<p class="mobile-menu-label">${group.label}</p>` : ''}
              <div class="mobile-menu-links">
                ${group.items.map((item) => `<a href="${item.href}" class="${mobileLinkClass(item.active)}" onclick="closeMobileMenu()">${item.label}</a>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="mobile-menu-actions">
          <a href="https://cal.com/sergio-kensho-visual-marketing-ai-hy0f7h/15min" class="btn-mobile-outline btn-home-cinematic text-center" onclick="closeMobileMenu()" target="_blank" rel="noopener">
            ${isEnglish ? 'Book a call' : 'Agendar llamada'}
          </a>
          <a href="${cta.mobileHref}" class="btn-gradient btn-home-cinematic text-center" ${cta.mobileOnclick ? `onclick="${cta.mobileOnclick}"` : ''}>
            ${cta.label}
          </a>
        </div>
      </nav>
    </div>`;
  }

  if (footer) {
    footer.className = 'px-6 md:px-10 lg:px-16';
    footer.style.background = '#001B3A';
    footer.style.borderTop = 'none';
    footer.style.paddingTop = '4rem';
    footer.style.paddingBottom = '3.5rem';
    footer.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <div class="mb-10 md:mb-12">
        <a href="${logoHref}" class="inline-flex items-center leading-none">
          <img src="${assetHref('assets/logo_kensho/KenshoRLogoWhite.webp')}" alt="Kensho" style="height:2.65rem; width:auto; display:block;" />
        </a>
        <p class="font-sans font-light text-sm mt-3" style="color:rgba(255,255,255,0.72);">${isEnglish ? 'We help your business grow in the digital world.' : 'Hacemos crecer tu negocio en el mundo digital.'}</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
        <div>
          <p class="font-sans text-xs tracking-widest uppercase mb-4" style="color:rgba(255,255,255,0.9);">${isEnglish ? 'NAVIGATE' : 'NAVEGAR'}</p>
          <ul class="space-y-3">
            <li><a href="${homeHref}" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);">Home</a></li>
            <li><a href="${isEnglish ? '#servicios' : href('servicios.html')}" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);">${isEnglish ? 'Services' : 'Servicios'}</a></li>
            <li><a href="${isEnglish ? '#planes' : href('precios.html')}" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);">${isEnglish ? 'Plans' : 'Precios'}</a></li>
          </ul>
        </div>
        <div>
          <p class="font-sans text-xs tracking-widest uppercase mb-4" style="color:rgba(255,255,255,0.9);">${isEnglish ? 'EXPLORE' : 'EXPLORAR'}</p>
          <ul class="space-y-3">
            <li><a href="${href('recursos.html')}" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);">${isEnglish ? 'Resources' : 'Recursos'}</a></li>
            <li><a href="${href('blog.html')}" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);">Blog</a></li>
            <li><a href="${href('proyectos.html')}" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);">${isEnglish ? 'Projects' : 'Proyectos'}</a></li>
          </ul>
        </div>
        <div>
          <p class="font-sans text-xs tracking-widest uppercase mb-4" style="color:rgba(255,255,255,0.9);">${isEnglish ? 'CONTACT' : 'CONTACTO'}</p>
          <ul class="space-y-3">
            <li><a href="https://cal.com/sergio-kensho-visual-marketing-ai-hy0f7h/15min" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);" target="_blank" rel="noopener">${isEnglish ? 'Book a call' : 'Agendar llamada'}</a></li>
            <li><a href="https://www.linkedin.com/in/sergio-alonso-35584894/" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="mailto:sergio@kenshovisual.com" class="font-sans text-sm transition-colors" style="color:rgba(255,255,255,0.72);">Email</a></li>
          </ul>
        </div>
        <div class="hidden md:block">
          <a href="${cta.footerHref}" class="btn-primary btn-gradient text-sm inline-flex" ${cta.footerOnclick ? `onclick="${cta.footerOnclick}"` : ''}>${cta.label}</a>
        </div>
      </div>
      <div class="pt-4 md:pt-5 -mb-6 md:-mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between" style="border-top:1px solid rgba(255,255,255,0.14);">
        <p class="font-sans text-xs" style="color:rgba(255,255,255,0.56);">© ${currentYear} Kensho. ${isEnglish ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
        <div class="flex flex-wrap items-center gap-4 md:gap-6">
          <a href="${legalHref('aviso-legal.html')}" class="font-sans text-xs transition-colors" style="color:rgba(255,255,255,0.56);">${isEnglish ? 'Legal notice' : 'Aviso legal'}</a>
          <a href="${legalHref('privacidad.html')}" class="font-sans text-xs transition-colors" style="color:rgba(255,255,255,0.56);">${isEnglish ? 'Privacy' : 'Privacidad'}</a>
          <a href="${legalHref('cookies.html')}" class="font-sans text-xs transition-colors" style="color:rgba(255,255,255,0.56);">Cookies</a>
        </div>
      </div>
    </div>`;
  }
})();

// ── Mobile menu ───────────────────────────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu      = document.getElementById('mobile-menu');
  const hlineT    = document.getElementById('hline-t');
  const hlineM    = document.getElementById('hline-m');
  const hlineB    = document.getElementById('hline-b');
  if (!hamburger || !menu) return;

  let isOpen = false;
  const overlay = document.createElement('div');
  overlay.id = 'mobile-menu-overlay';
  document.body.appendChild(overlay);

  overlay.addEventListener('click', closeMenu);

  function openMenu() {
    isOpen = true;
    document.body.style.overflow = 'hidden';
    overlay.classList.add('open');
    menu.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
    hamburger.setAttribute('aria-expanded', 'true');
    if (hlineT) hlineT.style.transform = 'translateY(6px) rotate(45deg)';
    if (hlineM) hlineM.style.opacity   = '0';
    if (hlineB) { hlineB.style.transform = 'translateY(-6px) rotate(-45deg)'; hlineB.style.width = '24px'; }
  }

  function closeMenu() {
    isOpen = false;
    document.body.style.overflow = '';
    overlay.classList.remove('open');
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (hlineT) hlineT.style.transform = '';
    if (hlineM) hlineM.style.opacity   = '';
    if (hlineB) { hlineB.style.transform = ''; hlineB.style.width = ''; }
    setTimeout(() => { if (!isOpen) menu.classList.add('hidden'); }, 560);
  }

  window.closeMobileMenu = closeMenu;
  hamburger.addEventListener('click', () => isOpen ? closeMenu() : openMenu());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeMenu(); });
})();


// ── Hero: staggered fade-up on load ──────────────────────────────────────────
(function initHeroAnimations() {
  [
    { id: 'hero-badge', delay:   0 },
    { id: 'hero-h1',    delay: 150 },
    { id: 'hero-sub',   delay: 300 },
    { id: 'hero-ctas',  delay: 450 },
  ].forEach(({ id, delay }) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTimeout(() => el.classList.add('visible'), delay);
  });
})();


// ── Video autoplay: improve mobile/iOS inline playback ──────────────────────
(function initVideoAutoplay() {
  const videos = Array.from(document.querySelectorAll('video'));
  if (!videos.length) return;

  const autoplayStyle = document.createElement('style');
  autoplayStyle.textContent = `
    video::-webkit-media-controls-start-playback-button { display: none !important; -webkit-appearance: none; }
    video::-webkit-media-controls-play-button { display: none !important; -webkit-appearance: none; }
    video::-webkit-media-controls-overlay-play-button { display: none !important; -webkit-appearance: none; }
  `;
  document.head.appendChild(autoplayStyle);

  function tryPlay(video) {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = video.hasAttribute('loop') || video.loop;
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.controls = false;
    video.preload = 'auto';
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.setAttribute('x5-video-player-type', 'h5');
    video.setAttribute('x5-video-player-fullscreen', 'false');
    video.setAttribute('controlslist', 'nofullscreen nodownload noplaybackrate noremoteplayback');
    video.setAttribute('disablepictureinpicture', '');
    video.removeAttribute('controls');

    if (video.preload !== 'auto') video.preload = 'auto';
    if (video.readyState === 0) {
      try { video.load(); } catch (_) {}
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  videos.forEach(video => {
    tryPlay(video);
    video.addEventListener('loadedmetadata', () => tryPlay(video), { passive: true });
    video.addEventListener('canplay', () => tryPlay(video), { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    videos.forEach(tryPlay);
  });

  const kickstart = () => {
    videos.forEach(tryPlay);
    document.removeEventListener('touchstart', kickstart);
    document.removeEventListener('click', kickstart);
  };
  document.addEventListener('touchstart', kickstart, { passive: true });
  document.addEventListener('click', kickstart, { passive: true });

  window.addEventListener('pageshow', () => {
    videos.forEach(tryPlay);
  }, { passive: true });
})();


// ── Scroll reveal: .reveal → .in-view ────────────────────────────────────────
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();


// ── Process tabs ──────────────────────────────────────────────────────────────
(function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panels
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();



// ── Bottom blur glass overlay ─────────────────────────────────────────────────
(function initBottomGlass() {
  const wrapper = document.createElement('div');
  wrapper.id = 'bottom-glass-overlay';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.setAttribute(
    'style',
    'position:fixed;bottom:0;left:0;right:0;height:70px;pointer-events:none;z-index:40;overflow:hidden;opacity:1;transition:opacity 220ms ease;'
  );
  wrapper.innerHTML =
    '<div style="position:absolute;inset:0;z-index:1;backdrop-filter:blur(0.234375px);-webkit-backdrop-filter:blur(0.234375px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 12.5%,rgba(0,0,0,1) 25%,rgba(0,0,0,0) 37.5%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 12.5%,rgba(0,0,0,1) 25%,rgba(0,0,0,0) 37.5%);"></div>' +
    '<div style="position:absolute;inset:0;z-index:2;backdrop-filter:blur(0.46875px);-webkit-backdrop-filter:blur(0.46875px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 12.5%,rgba(0,0,0,1) 25%,rgba(0,0,0,1) 37.5%,rgba(0,0,0,0) 50%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 12.5%,rgba(0,0,0,1) 25%,rgba(0,0,0,1) 37.5%,rgba(0,0,0,0) 50%);"></div>' +
    '<div style="position:absolute;inset:0;z-index:3;backdrop-filter:blur(0.9375px);-webkit-backdrop-filter:blur(0.9375px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 25%,rgba(0,0,0,1) 37.5%,rgba(0,0,0,1) 50%,rgba(0,0,0,0) 62.5%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 25%,rgba(0,0,0,1) 37.5%,rgba(0,0,0,1) 50%,rgba(0,0,0,0) 62.5%);"></div>' +
    '<div style="position:absolute;inset:0;z-index:4;backdrop-filter:blur(1.875px);-webkit-backdrop-filter:blur(1.875px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 37.5%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 62.5%,rgba(0,0,0,0) 75%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 37.5%,rgba(0,0,0,1) 50%,rgba(0,0,0,1) 62.5%,rgba(0,0,0,0) 75%);"></div>' +
    '<div style="position:absolute;inset:0;z-index:5;backdrop-filter:blur(3.75px);-webkit-backdrop-filter:blur(3.75px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 50%,rgba(0,0,0,1) 62.5%,rgba(0,0,0,1) 75%,rgba(0,0,0,0) 87.5%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 50%,rgba(0,0,0,1) 62.5%,rgba(0,0,0,1) 75%,rgba(0,0,0,0) 87.5%);"></div>' +
    '<div style="position:absolute;inset:0;z-index:6;backdrop-filter:blur(7.5px);-webkit-backdrop-filter:blur(7.5px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 62.5%,rgba(0,0,0,1) 75%,rgba(0,0,0,1) 87.5%,rgba(0,0,0,0) 100%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 62.5%,rgba(0,0,0,1) 75%,rgba(0,0,0,1) 87.5%,rgba(0,0,0,0) 100%);"></div>' +
    '<div style="position:absolute;inset:0;z-index:7;backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 75%,rgba(0,0,0,1) 87.5%,rgba(0,0,0,1) 100%,rgba(0,0,0,0) 112.5%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 75%,rgba(0,0,0,1) 87.5%,rgba(0,0,0,1) 100%,rgba(0,0,0,0) 112.5%);"></div>' +
    '<div style="position:absolute;inset:0;z-index:8;backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);-webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 87.5%,rgba(0,0,0,1) 100%,rgba(0,0,0,1) 112.5%,rgba(0,0,0,0) 125%);mask-image:linear-gradient(to bottom,rgba(0,0,0,0) 87.5%,rgba(0,0,0,1) 100%,rgba(0,0,0,1) 112.5%,rgba(0,0,0,0) 125%);"></div>';
  document.body.appendChild(wrapper);

  function updateBottomGlassMetrics() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      wrapper.style.display = 'none';
      return;
    }
    wrapper.style.display = '';
    wrapper.style.height = '70px';
  }

  const scheduleBottomGlassUpdate = () => {
    requestAnimationFrame(updateBottomGlassMetrics);
  };

  updateBottomGlassMetrics();
  window.addEventListener('resize', scheduleBottomGlassUpdate, { passive: true });
  window.addEventListener('orientationchange', scheduleBottomGlassUpdate, { passive: true });
  window.addEventListener('load', scheduleBottomGlassUpdate, { passive: true });
  window.addEventListener('pageshow', scheduleBottomGlassUpdate, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleBottomGlassUpdate, { passive: true });
  }

  const footer = document.querySelector('footer');
  if (!footer || typeof IntersectionObserver === 'undefined') return;

  const footerObserver = new IntersectionObserver((entries) => {
    const footerVisible = entries.some((entry) => entry.isIntersecting);
    wrapper.style.opacity = footerVisible ? '0' : '1';
  }, {
    threshold: 0.01,
    rootMargin: '0px 0px -12px 0px'
  });

  footerObserver.observe(footer);
})();


// ── Audit modal ───────────────────────────────────────────────────────────────
(function initAuditModal() {
  const modal   = document.getElementById('audit-modal');
  const form    = document.getElementById('audit-form');
  if (!modal || !form) return;

  const presenceIds = ['f-web', 'f-ig', 'f-fb', 'f-tiktok', 'f-gmaps'];
  const defaultFromName = 'Kensho Website';
  const fieldMap = [
    { id: 'f-negocio', key: 'Negocio' },
    { id: 'f-ciudad', key: 'Ciudad' },
    { id: 'f-email', key: 'Email' },
    { id: 'f-web', key: 'Website' },
    { id: 'f-ig', key: 'Instagram' },
    { id: 'f-fb', key: 'Facebook' },
    { id: 'f-tiktok', key: 'TikTok' },
    { id: 'f-gmaps', key: 'Google Business Profile' },
    { id: 'f-sector', key: 'Sector' },
    { id: 'f-facturacion', key: 'Facturación aproximada' },
    { id: 'f-phone', key: 'Teléfono / WhatsApp' },
    { id: 'f-objetivo', key: 'Objetivo' },
    { id: 'f-problema', key: 'Problema' },
    { id: 'f-comentarios', key: 'Comentarios' },
    { id: 'f-consent', key: 'Consentimiento auditoría' },
  ];

  // Open / close helpers
  window.openAuditModal = function () {
    resetFormUi();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Focus first input after animation
    setTimeout(() => {
      const first = modal.querySelector('.audit-input');
      if (first) first.focus();
    }, 260);
  };

  window.closeAuditModal = function () {
    resetFormUi();
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (window.location.hash === '#audit-modal') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  function syncAuditModalWithHash() {
    if (window.location.hash === '#audit-modal') {
      window.openAuditModal();
    }
  }

  window.addEventListener('hashchange', syncAuditModalWithHash);
  syncAuditModalWithHash();

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeAuditModal();
  });

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearErrors();
    hideSuccess();

    let valid = true;

    // Validate required fields
    ['f-negocio', 'f-ciudad', 'f-email'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        markError(el);
        valid = false;
      }
    });

    // Validate email format
    const emailEl = document.getElementById('f-email');
    if (emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      markError(emailEl);
      valid = false;
    }

    // At least one presence field
    const hasPresence = presenceIds.some(id => {
      const el = document.getElementById(id);
      return el && el.value.trim();
    });
    if (!hasPresence) {
      presenceIds.forEach(id => markError(document.getElementById(id)));
      showError('Rellena al menos uno de los campos de presencia online (web, redes o Google Maps).');
      valid = false;
    }

    const consentEl = document.getElementById('f-consent');
    const consentWrap = document.getElementById('audit-consent-wrap');
    if (!consentEl || !consentEl.checked) {
      if (consentWrap) consentWrap.classList.add('error');
      showError('Debes aceptar el uso de tus datos para enviarte la auditoría gratuita.');
      valid = false;
    }

    if (!valid) return;

    // Loading state
    setLoading(true);

    try {
      const rawFormData = new FormData(form);
      const email = ((rawFormData.get('email') || '').toString()).trim();
      const negocio = ((rawFormData.get('negocio') || '').toString()).trim();
      const formData = new FormData();

      formData.append('access_key', (rawFormData.get('access_key') || '').toString());
      formData.append('subject', 'Nueva solicitud de auditoría - Web Kensho');
      formData.append('from_name', negocio || defaultFromName);
      formData.append('botcheck', (rawFormData.get('botcheck') || '').toString());
      formData.append('replyto', email);

      fieldMap.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const value = el.type === 'checkbox' ? (el.checked ? 'Sí' : '') : el.value.trim();
        if (!value) return;
        formData.append(key, value);
      });

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        form.reset();
        clearErrors();
        showSuccess();
        return;
      }

      showError(data.message || 'Hubo un error al enviar la solicitud. Inténtalo de nuevo.');
    } catch (error) {
      showError('No se pudo enviar la solicitud. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  });

  function markError(el) {
    if (el) el.classList.add('error');
  }

  function clearErrors() {
    form.querySelectorAll('.audit-input').forEach(el => el.classList.remove('error'));
    const consentWrap = document.getElementById('audit-consent-wrap');
    if (consentWrap) consentWrap.classList.remove('error');
    const errEl = document.getElementById('form-error');
    if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
  }

  function showError(msg) {
    const errEl = document.getElementById('form-error');
    if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
  }

  function setLoading(on) {
    const btn     = document.getElementById('audit-submit');
    const label   = document.getElementById('submit-label');
    const spinner = document.getElementById('submit-spinner');
    if (!btn) return;
    btn.disabled = on;
    btn.style.opacity = on ? '0.7' : '';
    if (label)   label.textContent = on ? 'Enviando...' : 'Enviar';
    if (spinner) spinner.classList.toggle('hidden', !on);
  }

  function showSuccess() {
    const formContent = document.getElementById('audit-form-content');
    const header = document.getElementById('audit-form-header');
    const successEl = document.getElementById('form-success');
    if (header) header.classList.add('hidden');
    if (formContent) formContent.classList.add('hidden');
    if (successEl) successEl.classList.remove('hidden');
    if (successEl) successEl.classList.add('flex');
  }

  function hideSuccess() {
    const formContent = document.getElementById('audit-form-content');
    const header = document.getElementById('audit-form-header');
    const successEl = document.getElementById('form-success');
    if (header) header.classList.remove('hidden');
    if (formContent) formContent.classList.remove('hidden');
    if (successEl) successEl.classList.add('hidden');
    if (successEl) successEl.classList.remove('flex');
  }

  function resetFormUi() {
    clearErrors();
    hideSuccess();
    setLoading(false);
  }
})();


// ── Cookies banner ───────────────────────────────────────────────────────────
(function initCookieBanner() {
  const STORAGE_KEY = 'kensho_cookie_consent';
  const currentChoice = localStorage.getItem(STORAGE_KEY);
  const isEnglish = /\/en(\/|$)/.test(window.location.pathname || '');
  const cookieIconSrc = isEnglish ? '../assets/cookie.webp' : 'assets/cookie.webp';

  if (currentChoice) {
    document.documentElement.dataset.cookieConsent = currentChoice;
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    #cookie-banner {
      position: fixed;
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
      z-index: 80;
      margin: 0 auto;
      background: rgba(250, 249, 246, 0.96);
      border: 1px solid rgba(139, 115, 85, 0.16);
      border-radius: 0.875rem;
      box-shadow: 0 10px 28px rgba(26, 26, 31, 0.08);
      backdrop-filter: blur(14px) saturate(1.2);
      -webkit-backdrop-filter: blur(14px) saturate(1.2);
      padding: 0.7rem 1.25rem;
    }
    #cookie-banner-inner {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    #cookie-banner-copy {
      display: flex;
      align-items: flex-start;
      gap: 0.7rem;
      color: #5c4e42;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.875rem;
      font-weight: 300;
      line-height: 1.5;
      letter-spacing: -0.01em;
      margin: 0;
    }
    .cookie-copy-icon {
      width: 1.15rem;
      height: 1.15rem;
      flex-shrink: 0;
      margin-top: 0.08rem;
      object-fit: contain;
    }
    .cookie-copy-text {
      display: block;
    }
    #cookie-banner-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
    .cookie-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.65rem;
      padding: 0.45rem 0.95rem;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      text-decoration: none;
      border: 1px solid transparent;
      cursor: pointer;
      transition: opacity 220ms ease, border-color 220ms ease, background-color 220ms ease;
    }
    .cookie-btn:hover { opacity: 0.86; }
    .cookie-btn-accept {
      background: #8B7355;
      color: #fff;
    }
    .cookie-btn-reject {
      background: #F5F0EA;
      color: #5c4e42;
      border-color: #E5DCD0;
    }
    .cookie-link {
      color: #8B7355;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.8rem;
      font-weight: 400;
      text-decoration: none;
      white-space: nowrap;
    }
    @media (min-width: 768px) {
      #cookie-banner-inner {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        flex-wrap: nowrap;
      }
      #cookie-banner-copy {
        flex: 1;
        align-items: center;
        min-width: 0;
      }
      .cookie-copy-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #cookie-banner-actions {
        justify-content: flex-end;
        flex-shrink: 0;
        flex-wrap: nowrap;
      }
    }
    @media (min-width: 1024px) {
      #cookie-banner {
        max-width: 880px;
      }
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = `
    <div id="cookie-banner-inner">
      <p id="cookie-banner-copy"><img class="cookie-copy-icon" src="${cookieIconSrc}" alt="" aria-hidden="true" /><span class="cookie-copy-text">Usamos cookies para mejorar la experiencia y analizar el uso de la web.</span></p>
      <div id="cookie-banner-actions">
        <a href="/cookies.html" class="cookie-link">Más información</a>
        <button type="button" class="cookie-btn cookie-btn-reject" data-cookie-choice="rejected">Rechazar</button>
        <button type="button" class="cookie-btn cookie-btn-accept" data-cookie-choice="accepted">Aceptar</button>
      </div>
    </div>
  `;

  function applyChoice(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    document.documentElement.dataset.cookieConsent = choice;
    document.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: { choice } }));
    banner.remove();
  }

  banner.querySelectorAll('[data-cookie-choice]').forEach(button => {
    button.addEventListener('click', function () {
      applyChoice(this.getAttribute('data-cookie-choice'));
    });
  });

  document.body.appendChild(banner);
})();


// ── FAQ accordion ─────────────────────────────────────────────────────────────
(function initFAQ() {
  const items = document.querySelectorAll('[data-faq]');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('button');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').classList.remove('open');
        i.querySelector('button').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


// ── Shared blog post metadata ────────────────────────────────────────────────
(function initBlogContentBindings() {
  const BLOG_POSTS = {
    'agents-ia': {
      href: 'blog-agentes-ia.html',
      image: 'assets/blog/agentai.webp',
      imageAlt: 'Tecnología e inteligencia artificial',
      category: 'IA & Automatización',
      title: 'La evolución de los agentes de IA personales: de asistentes a sistemas que trabajan por ti',
      excerpt: 'De Siri y Alexa a sistemas que investigan, ejecutan tareas y automatizan procesos reales dentro del marketing digital.',
      date: '10 abril 2026',
      metaTitle: 'La evolución de los agentes de IA personales: de asistentes a sistemas que trabajan por ti - Kensho',
      metaDescription: 'Descubre cómo han evolucionado los agentes de IA personales y por qué ya están automatizando marketing, procesos y tareas reales dentro de las empresas.'
    },
    'google-maps': {
      href: 'blog-google-maps.html',
      image: 'assets/blog/google-maps-perfil-blog.webp',
      imageAlt: 'Google Maps y perfil de empresa para SEO local',
      category: 'Google Maps',
      title: 'Cómo posicionar en Google Maps: qué es, cómo funciona y por qué es clave para tu negocio',
      excerpt: 'Descubre cómo funciona Google Maps y el Perfil de Empresa, y por qué es clave para posicionar tu negocio y conseguir más clientes.',
      date: '10 abril 2026',
      metaTitle: 'Cómo posicionar en Google Maps (Guía completa 2026) - Kensho',
      metaDescription: 'Descubre cómo funciona Google Maps y el Perfil de Empresa, cómo ha evolucionado y por qué es clave para posicionar tu negocio y conseguir más clientes.'
    }
  };

  document.querySelectorAll('[data-blog-card]').forEach(card => {
    const slug = card.getAttribute('data-blog-card');
    const post = BLOG_POSTS[slug];
    if (!post) return;

    if (card.tagName === 'A') {
      card.setAttribute('href', post.href);
    } else {
      const anchor = card.querySelector('a');
      if (anchor) anchor.setAttribute('href', post.href);
    }

    const image = card.querySelector('[data-blog-image]');
    if (image) {
      image.setAttribute('src', post.image);
      image.setAttribute('alt', post.imageAlt);
    }

    const category = card.querySelector('[data-blog-category]');
    if (category) category.textContent = post.category;

    const title = card.querySelector('[data-blog-title]');
    if (title) title.textContent = post.title;

    const excerpt = card.querySelector('[data-blog-excerpt]');
    if (excerpt) excerpt.textContent = post.excerpt;

    const date = card.querySelector('[data-blog-date]');
    if (date) date.textContent = post.date;
  });

  const pageSlug = document.body ? document.body.getAttribute('data-blog-page') : null;
  const currentPost = pageSlug ? BLOG_POSTS[pageSlug] : null;
  if (!currentPost) return;

  const heroImage = document.querySelector('[data-blog-hero-image]');
  if (heroImage) {
    heroImage.setAttribute('src', currentPost.image);
    heroImage.setAttribute('alt', currentPost.imageAlt);
  }

  const heroCategory = document.querySelector('[data-blog-hero-category]');
  if (heroCategory) heroCategory.textContent = currentPost.category;

  const heroTitle = document.querySelector('[data-blog-hero-title]');
  if (heroTitle) heroTitle.textContent = currentPost.title;

  document.title = currentPost.metaTitle;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute('content', currentPost.metaDescription);
})();

// ── Reviews marquee - CMS-driven ─────────────────────────────────────────────
(function initReviewsMarquee() {
  const set1 = document.getElementById('reviews-set-1');
  const set2 = document.getElementById('reviews-set-2');
  if (!set1 || !set2) return;

  // Derive two-letter initials from a full name.
  function initials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Build a single review card's HTML, identical to the original structure.
  function buildCard(review) {
    const escaped = {
      text:    review.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      name:    review.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      company: review.company.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      initials: initials(review.name),
    };
    return '<article class="review-card">' +
      '<div class="review-stars" aria-label="5 estrellas">\u2605\u2605\u2605\u2605\u2605</div>' +
      '<p class="review-copy">' + escaped.text + '</p>' +
      '<div class="review-meta">' +
        '<span class="review-avatar">' + escaped.initials + '</span>' +
        '<div>' +
          '<p class="font-sans text-sm font-medium text-white" style="margin:0 0 .15rem;">' + escaped.name + '</p>' +
          '<p class="font-sans text-xs text-[#8B7355]" style="margin:0;">' + escaped.company + '</p>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function doFetch() {
    fetch('/content/reviews/index.json')
      .then(function (res) { return res.ok ? res.json() : {}; })
      .catch(function () { return {}; })
      .then(function (data) {
        var reviews = Array.isArray(data.reviews) ? data.reviews : [];
        if (reviews.length === 0) return;
        reviews.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
        const html = reviews.map(buildCard).join('');
        set1.innerHTML = html;
        set2.innerHTML = html;
      });
  }

  // Defer fetch until the section is near the viewport.
  var section = set1.closest('section') || set1.parentElement;
  if (!section || !('IntersectionObserver' in window)) { doFetch(); return; }
  var obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) { obs.disconnect(); doFetch(); }
  }, { rootMargin: '300px' });
  obs.observe(section);
})();

// ── Planes grid - CMS-driven ──────────────────────────────────────────────────
(function initPlanesGrid() {
  var grid = document.getElementById('planes-grid');
  if (!grid) return;

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildFeaturedCard(plan, idx) {
    var revealClass = idx === 0 ? 'reveal' : idx === 1 ? 'reveal reveal-delay-1' : 'reveal reveal-delay-2'; // idx is position in sorted array
    var featureItems = plan.features.map(function(f) {
      var text = esc(f);
      // First item in featured plan is always bold (inherited pattern)
      return '<li>' + (f.indexOf('más:') !== -1 ? '<strong>' + text + '</strong>' : text) + '</li>';
    }).join('');

    return '<div class="' + revealClass + '" style="position:relative;border-radius:1rem;padding:2px;background:transparent;overflow:hidden;box-shadow:0 0 60px rgba(139,115,85,0.25),0 0 120px rgba(139,115,85,0.1);">' +
      '<div class="animated-border"></div>' +
      '<div class="plan-card" style="position:relative;z-index:1;background:#FAF9F6;border-radius:calc(1rem - 2px);border:none;height:100%;">' +
        '<div style="position:absolute;top:18px;right:-28px;width:110px;background:#8B7355;color:#fff;font-size:9px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;text-align:center;padding:6px 0;transform:rotate(45deg);overflow:hidden;">' +
          '<span>Más popular</span>' +
          '<div class="ribbon-shimmer"></div>' +
        '</div>' +
        '<div>' +
          '<p class="font-sans text-xs text-brown tracking-widest uppercase mb-3">' + esc(plan.label) + '</p>' +
          '<h2 class="font-serif font-normal text-charcoal text-2xl mb-2">' + esc(plan.title) + '</h2>' +
          '<p class="font-sans font-light text-[#5c4e42] text-sm leading-relaxed">' + esc(plan.description) + '</p>' +
        '</div>' +
        '<div>' +
          '<p data-plan-strike class="font-sans" style="display:none;font-size:0.9rem;color:#9C9287;text-decoration:line-through;margin-bottom:0.25rem;">' + esc(plan.strike_text) + '</p>' +
          '<p data-plan-saving class="font-sans" style="display:none;margin-bottom:0.5rem;background:#527c84;color:#fff;border-radius:2rem;padding:4px 14px;font-size:0.8125rem;font-weight:500;width:fit-content;">' + esc(plan.saving_text) + '</p>' +
          '<p class="font-serif font-normal text-charcoal" style="font-size:clamp(1.75rem,3vw,2.25rem);">' +
            'desde <span data-price-monthly="' + esc(plan.price_monthly) + '" data-price-yearly="' + esc(plan.price_yearly) + '">' + esc(plan.price_monthly) + '</span>' +
            '<span class="font-sans text-base font-light text-[#9C9287]">/mes</span>' +
          '</p>' +
        '</div>' +
        '<ul class="plan-includes flex flex-col gap-2">' + featureItems + '</ul>' +
        '<p data-plan-note class="font-sans text-xs text-[#9C9287]">' + esc(plan.note) + '</p>' +
        '<a href="' + esc(plan.cta_link) + '" class="btn-primary text-sm text-center">' + esc(plan.cta_text) + '</a>' +
      '</div>' +
    '</div>';
  }

  function buildCard(plan, idx) {
    if (plan.featured) return buildFeaturedCard(plan, idx);

    var revealClass = idx === 0 ? 'plan-card reveal' : 'plan-card reveal reveal-delay-2';
    var featureItems = plan.features.map(function(f) {
      var text = esc(f);
      return '<li>' + (f.indexOf('más:') !== -1 ? '<strong>' + text + '</strong>' : text) + '</li>';
    }).join('');

    return '<div class="' + revealClass + '">' +
      '<div>' +
        '<p class="font-sans text-xs text-brown tracking-widest uppercase mb-3">' + esc(plan.label) + '</p>' +
        '<h2 class="font-serif font-normal text-charcoal text-2xl mb-2">' + esc(plan.title) + '</h2>' +
        '<p class="font-sans font-light text-[#5c4e42] text-sm leading-relaxed">' + esc(plan.description) + '</p>' +
      '</div>' +
      '<div>' +
        '<p data-plan-strike class="font-sans" style="display:none;font-size:0.9rem;color:#9C9287;text-decoration:line-through;margin-bottom:0.25rem;">' + esc(plan.strike_text) + '</p>' +
        '<p data-plan-saving class="font-sans" style="display:none;margin-bottom:0.5rem;background:#527c84;color:#fff;border-radius:2rem;padding:4px 14px;font-size:0.8125rem;font-weight:500;width:fit-content;">' + esc(plan.saving_text) + '</p>' +
        '<p class="font-serif font-normal text-charcoal" style="font-size:clamp(1.75rem,3vw,2.25rem);">' +
          'desde <span data-price-monthly="' + esc(plan.price_monthly) + '" data-price-yearly="' + esc(plan.price_yearly) + '">' + esc(plan.price_monthly) + '</span>' +
          '<span class="font-sans text-base font-light text-[#9C9287]">/mes</span>' +
        '</p>' +
      '</div>' +
      '<ul class="plan-includes flex flex-col gap-2">' + featureItems + '</ul>' +
      '<p data-plan-note class="font-sans text-xs text-[#9C9287]">' + esc(plan.note) + '</p>' +
      '<a href="' + esc(plan.cta_link) + '" class="btn-secondary text-sm text-center">' + esc(plan.cta_text) + '</a>' +
    '</div>';
  }

  fetch('/content/planes/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var planes = Array.isArray(data.planes) ? data.planes : [];
      if (planes.length === 0) return;

      planes.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });

      grid.innerHTML = planes.map(buildCard).join('');

      // Observe newly injected .reveal elements (initScrollReveal ran before these existed)
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      grid.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
      });

      // Re-apply current billing state after render
      if (typeof setBilling === 'function' && typeof currentBilling !== 'undefined') {
        setBilling(currentBilling);
      }
    });
})();

// ── Hero grid - CMS-driven ────────────────────────────────────────────────────
(function initHeroGrid() {
  var grid = document.getElementById('ksg-grid');
  if (!grid) return;

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  fetch('/content/hero-grid/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var images = Array.isArray(data.images) ? data.images : [];
      if (images.length === 0) return;

      // Derive layer + DOM order from column + row.
      //
      // CSS rules (nth-of-type within each layer):
      //   Layer 1: odd  → grid-column 1,  even → grid-column 5
      //   Layer 2: odd  → grid-column 2,  even → grid-column 4
      //   Layer 3: first → col 3 row 1,   last  → col 3 row 3
      //
      // Within layers 1 & 2 the DOM order must interleave col-left / col-right
      // row by row (row1-colL, row1-colR, row2-colL, row2-colR, row3-colL, row3-colR)
      // so that odd = left column and even = right column at every row.
      //
      // Sort key inside layer 1 & 2: (row * 2 - 1) for the left col, (row * 2) for right.
      // Layer 3: row 1 first, row 3 last (first/last of-type).

      var COL_TO_LAYER = { 1: 1, 5: 1, 2: 2, 4: 2, 3: 3 };
      // Within a layer, is this column the "odd" (left) slot or "even" (right) slot?
      var COL_IS_ODD   = { 1: true, 5: false, 2: true, 4: false, 3: true };

      var layers = { 1: [], 2: [], 3: [] };
      images.forEach(function(img) {
        var col = img.column;
        var row = img.row;
        var l   = COL_TO_LAYER[col];
        if (!l) return; // ignore invalid columns
        // Compute sort key so DOM order matches original interleaved pattern
        var key = COL_IS_ODD[col] ? (row * 2 - 1) : (row * 2);
        var src  = img.media_src || img.image || '';   // media_src nuevo, image fallback
        var type = img.media_type === 'video' ? 'video' : 'image';
        layers[l].push({ media_src: src, media_type: type, key: key });
      });
      [1, 2, 3].forEach(function(l) {
        layers[l].sort(function(a, b) { return a.key - b.key; });
      });

      // Rebuild the 3 ksg-layer divs; keep ksg-center-cell intact
      var centerCell = grid.querySelector('.ksg-center-cell');
      grid.querySelectorAll('.ksg-layer').forEach(function(el) { el.remove(); });

      [1, 2, 3].forEach(function(l) {
        var items = layers[l] || [];
        var inner = items.map(function(item) {
          var s = esc(item.media_src);
          var media = item.media_type === 'video'
            ? '<video autoplay muted loop playsinline preload="auto" style="transform:scale(0)"><source src="' + s + '" type="video/mp4"></video>'
            : '<img src="' + s + '" alt="" loading="lazy" />';
          return '<div>' + media + '</div>';
        }).join('');
        var layerEl = document.createElement('div');
        layerEl.className = 'ksg-layer';
        layerEl.innerHTML = inner;
        grid.insertBefore(layerEl, centerCell);
      });

      // Signal animation module that layers are in the DOM.
      // If there are videos, wait for all of them to have data before signalling
      // so GSAP measures a fully-painted element (matches img behaviour).
      var videos = Array.from(grid.querySelectorAll('video'));
      if (videos.length === 0) {
        window.dispatchEvent(new CustomEvent('ksg-layers-ready'));
      } else {
        var pending = videos.length;
        function onReady() {
          pending -= 1;
          if (pending === 0) window.dispatchEvent(new CustomEvent('ksg-layers-ready'));
        }
        videos.forEach(function(v) {
          if (v.readyState >= 2) { // HAVE_CURRENT_DATA or better
            onReady();
          } else {
            v.addEventListener('loadeddata', onReady, { once: true });
            // Fallback: fire after 3 s max so animation never gets stuck
            setTimeout(onReady, 3000);
          }
        });
      }
    });
})();

// ── Proyectos grid - CMS-driven ───────────────────────────────────────────────
(function initProyectosGrid() {
  var grid = document.getElementById('projects-grid');
  if (!grid) return;

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var STATUS_CLASS = { green: 'status-green', amber: 'status-amber', grey: 'status-grey' };
  var REVEAL_CYCLE = ['reveal', 'reveal reveal-delay-1', 'reveal reveal-delay-2'];

  function buildMedia(project) {
    var src = esc(project.media_src);
    var alt = esc(project.title);
    if (project.media_type === 'video') {
      return '<video class="proj-card-img" autoplay muted loop playsinline preload="metadata">' +
        '<source src="' + src + '" type="video/mp4">' +
      '</video>';
    }
    return '<img class="proj-card-img" loading="lazy" src="' + src + '" alt="' + alt + '">';
  }

  function buildCard(project, idx) {
    var revealClass = REVEAL_CYCLE[idx % 3];
    var categoryEscaped = esc(project.category);
    var projectLink = project.link ? esc(project.link) : '';
    var pills = Array.isArray(project.pills) ? project.pills : [];
    var pillsHtml = pills.map(function(p) {
      return '<span class="proj-pill">' + esc(p) + '</span>';
    }).join('');
    var clientHtml = project.client
      ? '<p class="font-sans text-xs text-[#9C9287] mb-2">' + esc(project.client) + '</p>'
      : '';
    var statusClass = STATUS_CLASS[project.status_color] || 'status-grey';
    var cardStart = projectLink
      ? '<a href="' + projectLink + '" class="proj-card ' + revealClass + '" data-category="' + categoryEscaped + '" style="text-decoration:none;color:inherit;">'
      : '<div class="proj-card ' + revealClass + '" data-category="' + categoryEscaped + '">';
    var cardEnd = projectLink ? '</a>' : '</div>';

    return cardStart +
      '<div class="proj-card-img-wrap">' + buildMedia(project) + '</div>' +
      '<div class="proj-card-body">' +
        '<span class="category-tag">' + categoryEscaped + '</span>' +
        clientHtml +
        '<h3 class="font-serif font-normal text-charcoal leading-[1.2] mb-3" style="font-size:1.2rem;">' +
          esc(project.title) +
        '</h3>' +
        '<p class="font-sans font-light text-[#5c4e42] text-sm leading-relaxed mb-4" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">' +
          esc(project.description) +
        '</p>' +
        '<div class="flex flex-wrap gap-1.5 mb-4">' + pillsHtml + '</div>' +
        '<div class="flex items-center gap-1.5 mt-auto">' +
          '<span class="status-dot ' + statusClass + '"></span>' +
          '<span class="font-sans text-xs text-[#5c4e42]">' + esc(project.status) + '</span>' +
        '</div>' +
      '</div>' +
    cardEnd;
  }

  fetch('/content/proyectos/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var projects = Array.isArray(data.projects) ? data.projects : [];
      if (projects.length === 0) return;

      projects.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });

      grid.innerHTML = projects.map(buildCard).join('');

      // Observe newly injected .reveal elements
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      grid.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
      });
    });
})();

// ── Home cases carousel - CMS-driven ─────────────────────────────────────────
(function initCasesCarousel() {
  var strip = document.getElementById('cases-carousel-strip');
  if (!strip) return;

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildMedia(p) {
    var src = esc(p.hero_src || p.media_src);
    var alt = esc(p.title);
    if ((p.hero_type || p.media_type) === 'video') {
      return '<video class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" autoplay muted loop playsinline webkit-playsinline preload="auto" style="pointer-events:none;">' +
        '<source src="' + src + '" type="video/mp4">' +
        '</video>';
    }
    return '<img src="' + src + '" alt="' + alt + '" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" loading="lazy" />';
  }

  function buildCard(p) {
    var media = buildMedia(p);
    var category = esc(p.category);
    var title = esc(p.title);
    var link = p.link ? esc(p.link) : '/proyectos';
    return '<a href="' + link + '" class="case-card block group no-underline text-inherit">' +
      '<div class="rounded-xl overflow-hidden mb-4" style="height:184px;">' + media + '</div>' +
      '<span class="inline-flex items-center rounded-full px-3 py-1 mb-3 font-sans text-[0.65rem] font-medium tracking-[0.1em] uppercase" style="background:#E8DDD4;color:#8B7355;">' + category + '</span>' +
      '<p class="font-serif font-normal text-charcoal text-lg leading-tight">' + title + '</p>' +
      '</a>';
  }

  function doFetch() {
    fetch('/content/proyectos/index.json')
      .then(function(res) { return res.ok ? res.json() : {}; })
      .catch(function() { return {}; })
      .then(function(data) {
        var projects = Array.isArray(data.projects) ? data.projects : [];
        var carousel = projects
          .filter(function(p) { return p.carousel_order; })
          .sort(function(a, b) { return a.carousel_order - b.carousel_order; });
        if (carousel.length === 0) return;
        strip.innerHTML = carousel.map(buildCard).join('');
        setTimeout(function() {
          strip.querySelectorAll('video').forEach(function(v) {
            v.muted = true;
            v.play().catch(function() {});
          });
        }, 0);
      });
  }

  var section = strip.closest('section') || strip.parentElement;
  if (!section || !('IntersectionObserver' in window)) { doFetch(); return; }
  var obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) { obs.disconnect(); doFetch(); }
  }, { rootMargin: '300px' });
  obs.observe(section);
})();

// ── Related projects (caso-estudio pages) - CMS-driven ────────────────────────
(function initRelatedProjects() {
  var grid = document.getElementById('related-projects-grid');
  if (!grid) return;

  var currentSlug = document.documentElement.dataset.slug || '';

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildMedia(p) {
    var src = esc(p.hero_src || p.media_src);
    var alt = esc(p.title);
    if ((p.hero_type || p.media_type) === 'video') {
      return '<video class="proj-card-img" autoplay muted loop playsinline preload="none">' +
        '<source src="' + src + '" type="video/mp4">' +
        '</video>';
    }
    return '<img class="proj-card-img" loading="lazy" src="' + src + '" alt="' + alt + '">';
  }

  function buildCard(p) {
    var link = p.link ? esc(p.link) : '/proyectos';
    var pills = Array.isArray(p.pills) ? p.pills : [];
    var pillsHtml = pills.map(function(t) { return '<span class="proj-pill">' + esc(t) + '</span>'; }).join('');
    return '<a href="' + link + '" class="proj-card reveal visible">' +
      '<div class="proj-card-img-wrap">' + buildMedia(p) + '</div>' +
      '<div class="proj-card-body">' +
        '<span class="category-tag">' + esc(p.category) + '</span>' +
        '<h3 class="font-serif font-normal text-ink leading-[1.24] mb-3" style="font-size:0.98rem;">' + esc(p.title) + '</h3>' +
        '<p class="font-sans font-light text-[#5c4e42] text-sm leading-relaxed mb-4" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">' + esc(p.description) + '</p>' +
        '<div class="flex flex-wrap gap-1.5 mt-auto">' + pillsHtml + '</div>' +
      '</div>' +
      '</a>';
  }

  fetch('/content/proyectos/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var projects = Array.isArray(data.projects) ? data.projects : [];
      var current = projects.find(function(p) { return p.slug === currentSlug; });
      var currentCategory = current ? current.category : '';

      // 1st pass: same category, has link, not self
      var related = projects.filter(function(p) {
        return p.slug !== currentSlug && p.link && p.category === currentCategory;
      });

      // 2nd pass: any other linked project not already picked
      if (related.length < 3) {
        var picked = related.map(function(p) { return p.slug; });
        var others = projects.filter(function(p) {
          return p.slug !== currentSlug && p.link && picked.indexOf(p.slug) === -1;
        });
        related = related.concat(others);
      }

      related = related.slice(0, 3);
      if (related.length === 0) return;
      grid.innerHTML = related.map(buildCard).join('');
    });
})();

// ── Resources page - CMS-driven ───────────────────────────────────────────────
(function initResourcesGrid() {
  var grid = document.getElementById('resources-grid');
  if (!grid) return;

  var REVEAL_CYCLE = ['reveal', 'reveal reveal-delay-1', 'reveal reveal-delay-2'];

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildCard(resource, idx) {
    var revealClass = REVEAL_CYCLE[idx % 3];
    return '<article class="download-card ' + revealClass + '">' +
      '<span class="resource-pill">' + esc(resource.category) + '</span>' +
      '<h2 class="font-serif font-normal text-charcoal leading-[1.2] mb-3" style="font-size:1.55rem;">' + esc(resource.title) + '</h2>' +
      '<p class="font-sans font-light text-[#5c4e42] text-sm leading-relaxed mb-6">' + esc(resource.description) + '</p>' +
      '<a href="' + esc(resource.link) + '" class="btn-gradient">Descargar</a>' +
    '</article>';
  }

  fetch('/content/resources/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var resources = Array.isArray(data.resources) ? data.resources : [];
      if (resources.length === 0) return;

      resources.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });

      grid.innerHTML = resources.map(buildCard).join('');

      // Observe newly injected .reveal elements (initScrollReveal ran before these existed)
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      grid.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
      });
    });
})();

// ── Blog page - CMS-driven ────────────────────────────────────────────────────
(function initBlogGrid() {
  var grid = document.getElementById('blog-grid');
  if (!grid) return;

  var REVEAL_CYCLE = ['reveal', 'reveal reveal-delay-1', 'reveal reveal-delay-2'];

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildCard(post, idx) {
    var revealClass = REVEAL_CYCLE[idx % 3];
    return '<article class="post-card ' + revealClass + '">' +
      '<a href="' + esc(post.link) + '" class="contents">' +
        '<div class="post-card-media">' +
          '<img src="' + esc(post.image) + '" alt="' + esc(post.image_alt) + '" loading="lazy">' +
        '</div>' +
        '<div class="post-card-body">' +
          '<span class="post-pill">' + esc(post.keyword) + '</span>' +
          '<p class="font-sans text-xs text-[#9C9287]">' + esc(post.date) + '</p>' +
          '<h2 class="font-serif font-normal text-charcoal leading-[1.2]" style="font-size:1.45rem;">' + esc(post.title) + '</h2>' +
          '<p class="font-sans font-light text-[#5c4e42] text-sm leading-relaxed">' + esc(post.description) + '</p>' +
          '<span class="font-sans text-sm text-brown font-medium">Leer más</span>' +
        '</div>' +
      '</a>' +
    '</article>';
  }

  fetch('/content/blog/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var posts = Array.isArray(data.posts) ? data.posts : [];
      if (posts.length === 0) return;

      posts.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });

      grid.innerHTML = posts.map(buildCard).join('');

      // Observe newly injected .reveal elements (initScrollReveal ran before these existed)
      var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      grid.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
      });
    });
})();

// ── Blog post SEO - CMS-driven ────────────────────────────────────────────────
(function initBlogPostSEO() {
  // Only runs on individual blog post pages
  var slug = document.body.dataset.blogPage;
  if (!slug) return;

  var BASE_URL = 'https://kenshovisual.com';

  function setMeta(selector, attr, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) { el.setAttribute(attr, value); return; }
    // Create if missing
    el = document.createElement('meta');
    var parts = selector.replace(/\[|\]/g, ' ').trim().split(/\s+/);
    // e.g. 'meta[property="og:title"]' → set property + content
    if (parts[1] && parts[2]) el.setAttribute(parts[1], parts[2]);
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }

  function setOrCreate(tag, attrs, attr, value) {
    if (!value) return;
    var selector = tag + Object.keys(attrs).map(function(k) { return '[' + k + '="' + attrs[k] + '"]'; }).join('');
    var el = document.querySelector(selector);
    if (!el) {
      el = document.createElement(tag);
      Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }

  fetch('/content/blog/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var posts = Array.isArray(data.posts) ? data.posts : [];
      // Match by slug: body[data-blog-page] vs link filename without .html
      var post = null;
      for (var i = 0; i < posts.length; i++) {
        var linkSlug = posts[i].link.replace(/\.html$/, '');
        if (linkSlug === slug) { post = posts[i]; break; }
      }
      if (!post) return;

      var canonical = post.canonical_url || (BASE_URL + '/' + post.link);
      var ogTitle = post.og_title || post.title;
      var ogDesc = post.og_description || post.description;
      var ogImage = post.og_image || (post.image ? BASE_URL + '/' + post.image : '');

      // ── <title> ────────────────────────────────────────────────
      if (post.title) document.title = post.title + ' - Kensho';

      // ── <meta name="description"> ──────────────────────────────
      setOrCreate('meta', { name: 'description' }, 'content', post.description);

      // ── <link rel="canonical"> ─────────────────────────────────
      (function() {
        var el = document.querySelector('link[rel="canonical"]');
        if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el); }
        el.href = canonical;
      })();

      // ── Open Graph ─────────────────────────────────────────────
      setOrCreate('meta', { property: 'og:type' },        'content', 'article');
      setOrCreate('meta', { property: 'og:title' },       'content', ogTitle);
      setOrCreate('meta', { property: 'og:description' }, 'content', ogDesc);
      setOrCreate('meta', { property: 'og:url' },         'content', canonical);
      setOrCreate('meta', { property: 'og:image' },       'content', ogImage);
      setOrCreate('meta', { property: 'og:locale' },      'content', 'es_ES');
      setOrCreate('meta', { property: 'og:site_name' },   'content', 'Kensho');

      // ── Twitter Card ───────────────────────────────────────────
      setOrCreate('meta', { name: 'twitter:card' },        'content', 'summary_large_image');
      setOrCreate('meta', { name: 'twitter:title' },       'content', ogTitle);
      setOrCreate('meta', { name: 'twitter:description' }, 'content', ogDesc);
      setOrCreate('meta', { name: 'twitter:image' },       'content', ogImage);

      // ── Hero image ALT ─────────────────────────────────────────
      var heroImg = document.querySelector('[data-blog-hero-image]');
      if (heroImg && post.image_alt) heroImg.alt = post.image_alt;

      // ── JSON-LD BlogPosting ────────────────────────────────────
      var jsonld = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.description,
        'image': ogImage,
        'datePublished': post.date_published || '',
        'dateModified': post.date_modified || post.date_published || '',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonical
        },
        'author': {
          '@type': 'Organization',
          'name': 'Kensho',
          'url': BASE_URL
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Kensho',
          'url': BASE_URL
        }
      };

      // Remove existing JSON-LD script if present (avoid duplicates on re-run)
      var existing = document.querySelector('script[data-blog-jsonld]');
      if (existing) existing.remove();
      var script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.blogJsonld = '';
      script.textContent = JSON.stringify(jsonld);
      document.head.appendChild(script);
    });
})();

// ── Services page - CMS-driven ────────────────────────────────────────────────
(function initServicesPage() {
  // Only runs on servicios.html
  if (!document.getElementById('svc-overview-grid') && !document.getElementById('svc-sections-container')) return;

  var ICONS = {
    'monitor': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    'activity': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    'shopping-cart': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    'edit': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    'users': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'smartphone': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
    'trending-up': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'file-text': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    'map-pin': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'zap': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    'bar-chart-2': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    'radio': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>',
    'message-square': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    'link': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    'briefcase': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    'instagram': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5"/></svg>',
    'calendar': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'video': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    'globe': '<svg class="sub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  };

  var NAV_SVG_PREV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
  var NAV_SVG_NEXT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildOverviewCard(cat, idx) {
    var delayClass = idx === 0 ? 'reveal' : idx === 1 ? 'reveal reveal-delay-1' : idx === 2 ? 'reveal reveal-delay-2' : 'reveal reveal-delay-3';
    return '<article class="svc-card ' + delayClass + '">' +
      '<div class="svc-card-media">' +
        '<img src="' + esc(cat.image) + '" alt="' + esc(cat.image_alt) + '" loading="lazy">' +
      '</div>' +
      '<div class="svc-card-body">' +
        '<h3 class="svc-card-title">' + esc(cat.card_title) + '</h3>' +
        '<p class="svc-card-text">' + esc(cat.card_description) + '</p>' +
        '<a href="#' + esc(cat.section_id) + '" class="svc-card-link">Saber más &rarr;</a>' +
      '</div>' +
    '</article>';
  }

  function buildSubCard(svc) {
    var iconSvg = ICONS[svc.icon] || ICONS['activity'];
    return '<div class="sub-card">' +
      iconSvg +
      '<h4 style="font-size:.9375rem;font-weight:500;color:#1A1A1F;margin:0 0 .375rem">' + esc(svc.title) + '</h4>' +
      '<p style="font-size:.8125rem;color:#5c4e42;font-weight:300;line-height:1.6;margin:0">' + esc(svc.description) + '</p>' +
    '</div>';
  }

  function buildSection(cat) {
    var altClass = cat.alt_section ? ' alt' : '';
    var svcs = Array.isArray(cat.services) ? cat.services.slice().sort(function(a, b) { return (a.order || 0) - (b.order || 0); }) : [];
    return '<section id="' + esc(cat.section_id) + '" class="svc-section' + altClass + '">' +
      '<div class="max-w-7xl mx-auto px-6">' +
        '<div class="service-header">' +
          '<div class="service-media ' + esc(cat.media_class) + ' reveal">' +
            '<img src="' + esc(cat.image) + '" alt="">' +
          '</div>' +
          '<div class="service-main">' +
            '<div class="svc-num service-label reveal">' + esc(cat.number) + ' | ' + esc(cat.label) + '</div>' +
            '<h2 class="service-title reveal reveal-delay-1" style="font-family:\'Ovo\',Georgia,serif;font-size:clamp(2rem,4vw,3rem);letter-spacing:-.03em;line-height:1.1;color:#1A1A1F;">' + esc(cat.title) + '</h2>' +
          '</div>' +
          '<div class="service-description reveal reveal-delay-2">' +
            '<p style="font-size:clamp(.84rem,1.35vw,.96rem);color:#5c4e42;font-weight:300;line-height:1.58;max-width:31rem;margin:0 0 1.5rem">' + esc(cat.description) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="reveal reveal-delay-3">' +
          '<div class="svc-carousel-head">' +
            '<span class="svc-carousel-label">Qué incluye</span>' +
            '<div class="svc-carousel-nav" aria-label="' + esc(cat.carousel_label) + '">' +
              '<button type="button" class="svc-carousel-btn" data-carousel-prev aria-label="Anterior">' + NAV_SVG_PREV + '</button>' +
              '<button type="button" class="svc-carousel-btn" data-carousel-next aria-label="Siguiente">' + NAV_SVG_NEXT + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="strip-outer">' +
            '<div class="strip">' +
              svcs.map(buildSubCard).join('') +
              '<div class="sub-card-spacer"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function observeReveal(container) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    container.querySelectorAll('.reveal').forEach(function(el) {
      observer.observe(el);
    });
  }

  fetch('/content/services/index.json')
    .then(function(res) { return res.ok ? res.json() : {}; })
    .catch(function() { return {}; })
    .then(function(data) {
      var cats = Array.isArray(data.categories) ? data.categories : [];
      if (cats.length === 0) return;

      cats.sort(function(a, b) { return (a.order || 0) - (b.order || 0); });

      // Overview cards
      var overviewGrid = document.getElementById('svc-overview-grid');
      if (overviewGrid) {
        overviewGrid.innerHTML = cats.map(buildOverviewCard).join('');
        observeReveal(overviewGrid);
      }

      // Detail sections
      var sectionsContainer = document.getElementById('svc-sections-container');
      if (sectionsContainer) {
        sectionsContainer.innerHTML = cats.map(buildSection).join('');
        observeReveal(sectionsContainer);

        // Re-init carousels for newly rendered sections
        if (typeof window.initServiceCarousels === 'function') {
          window.initServiceCarousels(sectionsContainer);
        }
      }
    });
})();

document.addEventListener('contextmenu', e => e.preventDefault());
