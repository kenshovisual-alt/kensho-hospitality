/* Kensho Hospitality — interaction & motion
   GSAP + ScrollTrigger + Lenis. Everything degrades to a static,
   fully readable page when motion is reduced or the libraries fail to load. */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const motion = root.classList.contains('motion') && hasGSAP;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!motion) root.classList.remove('motion');
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ── Progressive frosted glass ─────────────────────────────────────── */
  // Eight backdrop-filter layers, each masked to a band, so blur ramps from
  // 0.5px to 64px across the element instead of stopping at a hard edge.
  const BLURS = [0.5, 1, 2, 4, 8, 16, 32, 64];
  $$('[data-pblur]').forEach((el) => {
    const dir = el.dataset.pblur === 'up' ? 'to top' : 'to bottom';
    const frag = document.createDocumentFragment();
    BLURS.forEach((b, k) => {
      const a = k * 12.5;
      const mask = k < 6
        ? `linear-gradient(${dir}, rgba(0,0,0,0) ${a}%, #000 ${a + 12.5}%, #000 ${a + 25}%, rgba(0,0,0,0) ${a + 37.5}%)`
        : `linear-gradient(${dir}, rgba(0,0,0,0) ${a}%, #000 ${a + 12.5}%)`;
      const layer = document.createElement('i');
      layer.className = 'pb';
      layer.style.cssText = `backdrop-filter:blur(${b}px);-webkit-backdrop-filter:blur(${b}px);mask-image:${mask};-webkit-mask-image:${mask};`;
      frag.appendChild(layer);
    });
    const tint = document.createElement('i');
    tint.className = 'pb-tint';
    tint.style.background = `linear-gradient(${dir}, rgba(9,11,10,0), rgba(9,11,10,${el.dataset.tint || .5}))`;
    frag.appendChild(tint);
    el.appendChild(frag);
  });

  /* ── Smooth scroll ─────────────────────────────────────────────────── */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (target === 0) window.scrollTo({ top: 0 });
    else target.scrollIntoView();
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#main') return; // skip link: native behaviour moves focus
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    closeDrawer(false);
    scrollToTarget(target);
  });

  /* ── Nav: solid when scrolled, tucks away on scroll down ───────────── */
  const nav = $('[data-nav]');
  let drawerOpen = false;
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (!drawerOpen) nav.classList.toggle('is-hidden', y > lastY && y > 480);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Drawer (mobile menu) ──────────────────────────────────────────── */
  const burger = $('.nav__burger');
  const drawer = $('#drawer');

  function openDrawer() {
    drawerOpen = true;
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    nav.classList.remove('is-hidden');
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    if (motion) {
      gsap.fromTo(drawer, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .7, ease: 'expo.out' });
      gsap.fromTo($$('.drawer__links a, .drawer__foot > *', drawer), { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .05, delay: .1 });
    }
    $('a', drawer)?.focus({ preventScroll: true });
  }
  function closeDrawer(returnFocus = true) {
    if (!drawerOpen) return;
    drawerOpen = false;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    lenis?.start();
    document.body.style.overflow = '';
    const done = () => { drawer.hidden = true; };
    if (motion) gsap.to(drawer, { clipPath: 'inset(0 0 100% 0)', duration: .45, ease: 'expo.inOut', onComplete: done });
    else done();
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', () => (drawerOpen ? closeDrawer() : openDrawer()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) closeDrawer(false); });

  /* ── Small details ─────────────────────────────────────────────────── */
  $$('[data-year]').forEach(n => { n.textContent = new Date().getFullYear(); });
  const clock = $('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick(); setInterval(tick, 30000);
  }

  /* ── Services stage: sticky visual that follows the text column ────── */
  const stageFrame = $('.stage__frame');
  const courses = $$('.course');
  const stageItems = [];
  let uid = 0;

  courses.forEach((course) => {
    const media = $('.course__media > .media', course);
    const item = document.createElement('div');
    item.className = 'stage__item';
    if (media) {
      const clone = media.cloneNode(true);
      // unique ids so SVG gradient references resolve inside the visible copy
      $$('[id]', clone).forEach((n) => {
        const oldId = n.id, newId = `${oldId}-s${uid++}`;
        n.id = newId;
        $$(`[fill="url(#${oldId})"]`, clone).forEach(p => p.setAttribute('fill', `url(#${newId})`));
      });
      $$('input, a, button', clone).forEach(n => n.setAttribute('tabindex', '-1'));
      $$('img', clone).forEach(n => n.setAttribute('alt', ''));
      item.appendChild(clone);
    }
    stageFrame?.appendChild(item);
    stageItems.push(item);
  });

  const typers = new WeakMap();
  function typeInto(el) {
    const text = el.dataset.type || '';
    const token = {};
    typers.set(el, token);
    el.textContent = '';
    let i = 0;
    const step = () => {
      if (typers.get(el) !== token) return;
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, 38 + Math.random() * 50);
    };
    setTimeout(step, 450);
  }

  const swept = new WeakSet();
  function goLive(media) {
    if (!media) return;
    media.classList.remove('is-live');
    void media.offsetWidth; // restart the choreography each time it comes back
    media.classList.add('is-live');
    $$('.typing[data-type]', media).forEach(typeInto);
    if (media.matches('[data-compare]') && !swept.has(media) && motion) {
      swept.add(media);
      const state = { p: 50 };
      gsap.timeline({ delay: .8 })
        .to(state, { p: 22, duration: 1.1, ease: 'expo.inOut', onUpdate: () => setPos(media, state.p) })
        .to(state, { p: 78, duration: 1.3, ease: 'expo.inOut', onUpdate: () => setPos(media, state.p) })
        .to(state, { p: 50, duration: 1, ease: 'expo.inOut', onUpdate: () => setPos(media, state.p) });
    }
  }

  const chapterLabel = $('.stage__chapter');
  const countLabel = $('.stage__count b');
  let current = -1;

  function setActive(i) {
    if (i === current || !stageItems[i]) return;
    // reset everything except the outgoing item instantly (no reverse wipe behind the scenes)
    stageItems.forEach((it, j) => {
      if (j === current || j === i) return;
      if (it.classList.contains('is-prev') || it.classList.contains('is-active')) {
        it.style.transition = 'none';
        it.classList.remove('is-prev', 'is-active');
        void it.offsetWidth;
        it.style.transition = '';
      }
    });
    if (current >= 0) {
      const out = stageItems[current];
      out.classList.remove('is-active');
      out.classList.add('is-prev');
    }
    stageItems[i].classList.add('is-active');
    goLive($('.media', stageItems[i]));

    const label = courses[i].dataset.chapter;
    const n = String(i + 1).padStart(2, '0');
    if (motion && current >= 0 && chapterLabel.textContent !== label) {
      gsap.fromTo(chapterLabel, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' });
    }
    chapterLabel.textContent = label;
    countLabel.textContent = n;
    current = i;
  }

  if (stageFrame && 'IntersectionObserver' in window) {
    // chapters pre-load the first course of their chapter
    const markers = $$('.courses__text > .chapter, .courses__text > .course');
    const indexFor = (el) => {
      if (el.classList.contains('course')) return courses.indexOf(el);
      let n = el.nextElementSibling;
      while (n && !n.classList.contains('course')) n = n.nextElementSibling;
      return courses.indexOf(n);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(indexFor(e.target)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    markers.forEach(m => io.observe(m));
    setActive(0);

    // on small screens each course carries its own visual
    const mobileIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) goLive($('.media', e.target)); });
    }, { threshold: .45 });
    $$('.course__media').forEach(m => mobileIO.observe(m));
  }

  /* ── Before / after comparison ─────────────────────────────────────── */
  function setPos(el, p) {
    el.style.setProperty('--pos', `${p}%`);
    const r = $('.compare__range', el);
    if (r) r.value = p;
  }
  $$('[data-compare]').forEach((el) => {
    const range = $('.compare__range', el);
    range?.addEventListener('input', () => setPos(el, range.value));
    if (finePointer && el.closest('.stage')) {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        setPos(el, Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)));
      });
    }
  });

  /* ── Carte: image preview that trails the cursor ───────────────────── */
  const preview = $('.carte__preview');
  const list = $('.carte__list');
  if (preview && list && finePointer) {
    const img = $('img', preview);
    const moveX = hasGSAP ? gsap.quickTo(preview, 'x', { duration: .7, ease: 'power3' }) : null;
    const moveY = hasGSAP ? gsap.quickTo(preview, 'y', { duration: .7, ease: 'power3' }) : null;
    $$('[data-preview]', list).forEach((a) => { const i = new Image(); i.src = a.dataset.preview; });
    list.addEventListener('pointermove', (e) => {
      const x = e.clientX + 28, y = e.clientY - preview.offsetHeight / 2;
      if (moveX) { moveX(x); moveY(y); } else preview.style.transform = `translate(${x}px, ${y}px)`;
    });
    $$('[data-preview]', list).forEach((a) => {
      a.addEventListener('pointerenter', () => {
        if (!img.src.endsWith(a.dataset.preview)) img.src = a.dataset.preview;
        preview.classList.add('is-on');
      });
    });
    list.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
  }

  /* ── FAQ: animated disclosure ──────────────────────────────────────── */
  $$('.qa').forEach((qa) => {
    const summary = $('summary', qa);
    const body = $('.qa__a', qa);
    let anim = null;
    summary.addEventListener('click', (e) => {
      if (!motion) return;
      e.preventDefault();
      anim?.cancel();
      if (!qa.open) {
        qa.open = true;
        const h = body.scrollHeight;
        anim = body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 480, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
        anim.onfinish = () => { anim = null; ScrollTrigger.refresh(); };
      } else {
        const h = body.offsetHeight;
        anim = body.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
        anim.onfinish = () => { qa.open = false; anim = null; ScrollTrigger.refresh(); };
      }
    });
  });

  /* ── Everything below is motion only ───────────────────────────────── */
  if (!motion) {
    $$('[data-count]').forEach(n => { n.textContent = n.dataset.count; });
    return;
  }

  const EXPO = 'expo.out';
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 1800))]);

  /* Hero entrance */
  function heroIn() {
    const tl = gsap.timeline();
    const title = $('[data-hero-title]');
    gsap.set(title, { visibility: 'visible' });
    tl.fromTo('.hero__media img', { scale: 1.18 }, { scale: 1, duration: 2.8, ease: 'expo.out' }, 0);
    tl.from(title.querySelectorAll('.line'), { opacity: 0, y: 36, duration: 1.6, ease: EXPO, stagger: .12 }, .15);
    tl.fromTo('[data-hero]', { opacity: 0, y: 24, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: EXPO, stagger: .1, clearProps: 'filter' }, .55);
    return tl;
  }

  const intro = $('.intro');
  const playIntro = !root.classList.contains('intro-seen') && intro;
  try { sessionStorage.setItem('kh-intro', '1'); } catch (e) {}

  fontsReady.then(() => {
    if (playIntro) {
      lenis?.stop();
      window.scrollTo(0, 0);
      const tl = gsap.timeline({
        onComplete: () => { intro.classList.add('is-done'); lenis?.start(); }
      });
      tl.to('.intro__mark img', { opacity: 1, duration: 1.1, ease: 'power2.out' }, .1)
        .to('.intro__line', { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, .3)
        .to('.intro__place', { opacity: 1, duration: .8, ease: 'power2.out' }, .65)
        .to('.intro__mark', { opacity: 0, y: -12, duration: .5, ease: 'power2.inOut' }, 1.55)
        .to('.intro__panel--l', { xPercent: -101, duration: 1.4, ease: 'expo.inOut' }, 1.75)
        .to('.intro__panel--r', { xPercent: 101, duration: 1.4, ease: 'expo.inOut' }, 1.75)
        .add(heroIn(), 2.05);
    } else {
      heroIn();
    }
    initScroll();
  });

  function initScroll() {
    /* Hero drifts away as you leave it */
    gsap.to('.hero__media img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__content', { yPercent: -12, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });

    /* Headlines: rise in whole, text never re-flows */
    $$('[data-split]').forEach((el) => {
      gsap.set(el, { visibility: 'visible' });
      gsap.from(el, { opacity: 0, y: 32, duration: 1.3, ease: EXPO, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    /* Soft reveals, batched so neighbours cascade */
    gsap.set('[data-reveal]', { y: 26, filter: 'blur(6px)' });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: EXPO, stagger: .08, clearProps: 'filter' }),
    });

    /* Manifesto: words come up to full ink as you read */
    $$('[data-words]').forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
      gsap.fromTo($$('.w', el), { opacity: .14 }, {
        opacity: 1, ease: 'none', stagger: .05,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: .6 },
      });
    });

    /* Counters */
    $$('[data-count]').forEach((n) => {
      const end = +n.dataset.count, s = { v: 0 };
      n.textContent = '0';
      gsap.to(s, { v: end, duration: 2, ease: 'expo.out', onUpdate: () => { n.textContent = Math.round(s.v); },
        scrollTrigger: { trigger: n, start: 'top 90%', once: true } });
    });

    /* Curtain reveals: images part from the centre like drapes */
    $$('[data-curtain]').forEach((el) => {
      const img = $('img', el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.6, ease: 'expo.inOut' }, 0);
      if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2.4, ease: EXPO }, .1);
    });

    /* Parallax */
    $$('[data-parallax]').forEach((img) => {
      const a = img.dataset.parallax === 'soft' ? 4.5 : 7;
      gsap.fromTo(img, { yPercent: -a }, { yPercent: a, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Method: rules draw across */
    ScrollTrigger.create({
      trigger: '.method__steps', start: 'top 85%', once: true,
      onEnter: () => gsap.to('.method__steps li', { '--draw': 1, duration: 1.6, ease: 'expo.inOut', stagger: .12 }),
    });

    /* Set menus: cards settle in quietly, one after another.
       Only opacity and a short rise, composited, so the frosted cards stay smooth. */
    gsap.set('[data-card]', { opacity: 0, y: 28, force3D: true });
    ScrollTrigger.create({
      trigger: '.menus__cards', start: 'top 82%', once: true,
      onEnter: () => gsap.to('[data-card]', {
        opacity: 1, y: 0, duration: 1.6, ease: 'power3.out', stagger: .16,
        clearProps: 'transform,opacity',
      }),
    });

    /* Footer wordmark rises */
    gsap.from('.footer__word', { yPercent: 40, opacity: 0, duration: 1.8, ease: EXPO,
      scrollTrigger: { trigger: '.footer__word', start: 'top 95%', once: true } });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
