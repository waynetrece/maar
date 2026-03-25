/* ═══════════════════════════════════════════
   MAAR PROPOSAL — Slider + Animations
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const track    = document.getElementById('track');
  const slides   = Array.from(track.children);
  const dotsWrap = document.getElementById('dots');
  const counter  = document.getElementById('counter');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const navBtns  = document.querySelectorAll('.topnav__btn[data-nav]');
  const total    = slides.length;

  let current = 0;
  let isAnimating = false;
  let animatedSlides = new Set();

  /* ── Section mapping ── */
  const sectionMap = {
    about:     [],
    diagnosis: [],
    optimize:  [],
    portfolio: [],
    trust:     []
  };
  slides.forEach((s, i) => {
    const sec = s.dataset.section;
    if (sec && sectionMap[sec]) sectionMap[sec].push(i);
  });

  /* ── Build dots ── */
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'controls__dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  /* ── Navigation ── */
  function goTo(index) {
    if (isAnimating || index === current || index < 0 || index >= total) return;
    isAnimating = true;
    current = index;
    track.style.transform = `translateX(-${current * 100}vw)`;
    updateUI();
    setTimeout(() => {
      isAnimating = false;
      animateSlide(current);
    }, 750);
  }

  function updateUI() {
    /* dots */
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    /* counter */
    const num = String(current + 1).padStart(2, '0');
    counter.textContent = `${num} / ${String(total).padStart(2, '0')}`;
    /* arrows */
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    /* nav highlight */
    const sec = slides[current].dataset.section;
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.nav === sec));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ── Fullscreen ── */
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        document.body.classList.add('fullscreen');
      });
    } else {
      document.exitFullscreen().then(() => {
        document.body.classList.remove('fullscreen');
      });
    }
  }

  fullscreenBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove('fullscreen');
    }
  });

  /* keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === 'Escape' && document.body.classList.contains('fullscreen')) {
      document.body.classList.remove('fullscreen');
    }
  });

  /* nav buttons */
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.dataset.nav;
      if (sectionMap[sec] && sectionMap[sec].length) goTo(sectionMap[sec][0]);
    });
  });

  /* touch/swipe */
  let touchStartX = 0;
  let touchStartY = 0;
  let compareIsDragging = false;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (compareIsDragging) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
    }
  }, { passive: true });

  /* ═══ SLIDE ANIMATIONS ═══ */

  function animateSlide(index) {
    if (animatedSlides.has(index)) return;
    animatedSlides.add(index);
    const slide = slides[index];

    switch (index) {
      case 0: animateCover(slide); break;
      case 1: animateAbout(slide); break;
      case 2: animateCards(slide, 0.12); break;
      case 3: animateCards(slide, 0.08); break;
      case 4: animateProblems(slide); break;
      case 5: animateDeepCards(slide); break;
      case 6: animateArchitecture(slide); break;
      case 15:
      case 16: animatePortfolio(slide); break;
      case 17: animateFlow(slide); break;
      default: animateGeneric(slide); break;
    }
  }

  /* ── Cover (slide 0) ── */
  function animateCover(slide) {
    const title = slide.querySelector('.cover__title');
    const chars = title.textContent.split('');
    title.innerHTML = chars.map(ch =>
      ch === '\n' ? '<br>' : `<span class="char">${ch}</span>`
    ).join('');

    const charEls = slide.querySelectorAll('.char');
    const tl = gsap.timeline();

    tl.to(slide.querySelector('.cover__label'), {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
    });

    charEls.forEach((ch, i) => {
      tl.to(ch, {
        opacity: 1, y: 0,
        duration: 0.04,
        ease: 'power1.out'
      }, 0.4 + i * 0.035);
    });

    tl.to(slide.querySelector('.cover__divider'), {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.3');
    tl.to(slide.querySelector('.cover__subtitle'), {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.3');
    tl.to(slide.querySelector('.cover__contact'), {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.2');
    tl.to(slide.querySelector('.cover__footer'), {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
    }, '-=0.3');
  }

  /* ── About (slide 1) — countUp ── */
  function animateAbout(slide) {
    const stats = slide.querySelectorAll('.stat');
    gsap.to(stats, {
      opacity: 1, y: 0,
      duration: 0.6, stagger: 0.12,
      ease: 'power2.out',
      onStart: () => {
        slide.querySelectorAll('.stat__number').forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          countUp(el, target, suffix);
        });
      }
    });
  }

  function countUp(el, target, suffix) {
    const duration = target > 100 ? 2000 : 1200;
    const start = Date.now();
    const step = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ── Cards stagger ── */
  function animateCards(slide, stagger) {
    const items = slide.querySelectorAll('.card, .badge');
    gsap.to(items, {
      opacity: 1, y: 0,
      duration: 0.5, stagger: stagger,
      ease: 'power2.out'
    });
  }

  /* ── Problems (slide 4) ── */
  function animateProblems(slide) {
    const problems = slide.querySelectorAll('.problem');
    gsap.to(problems, {
      opacity: 1, y: 0,
      duration: 0.5, stagger: 0.15,
      ease: 'power2.out',
      onComplete: () => {
        slide.querySelectorAll('.problem__fill').forEach(bar => {
          const w = bar.dataset.width;
          bar.style.width = w + '%';
        });
      }
    });
  }

  /* ── Deep Cards (slide 5) ── */
  function animateDeepCards(slide) {
    const cards = slide.querySelectorAll('.deep-card');
    gsap.to(cards, {
      opacity: 1, y: 0,
      duration: 0.5, stagger: 0.1,
      ease: 'power2.out'
    });
  }

  /* ── Architecture (slide 6) ── */
  function animateArchitecture(slide) {
    const tl = gsap.timeline();
    tl.to(slide.querySelector('.arch-root'), {
      opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'
    });
    tl.to(slide.querySelectorAll('.arch-branch'), {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.1');
    tl.to(slide.querySelector('.arch-legend'), {
      opacity: 1, duration: 0.4
    });
  }

  /* ── Portfolio ── */
  function animatePortfolio(slide) {
    const cards = slide.querySelectorAll('.portfolio-card');
    gsap.fromTo(cards,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
    );
    const more = slide.querySelector('.portfolio-more');
    if (more) {
      gsap.fromTo(more,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.6 }
      );
    }
  }

  /* ── Flow (slide 16) ── */
  function animateFlow(slide) {
    const items = slide.querySelectorAll('.flow__step, .flow__line');
    gsap.to(items, {
      opacity: 1, y: 0,
      duration: 0.5, stagger: 0.12,
      ease: 'power2.out'
    });
  }

  /* ── Generic (split slides, tech, priority, etc.) ── */
  function animateGeneric(slide) {
    const items = slide.querySelectorAll(
      '.split__problem, .split__solution, .opt-list li, .feat-list li, ' +
      '.ref-card, .tech-card, .priority-card, .split__dual-item, ' +
      '.card, .badge, .flow__step, .flow__line, ' +
      '.diagram__root, .diagram__branch, .compare'
    );
    if (items.length) {
      gsap.to(items, {
        opacity: 1, y: 0,
        duration: 0.45, stagger: 0.06,
        ease: 'power2.out'
      });
    }
  }

  /* ── Init first slide ── */
  updateUI();
  setTimeout(() => animateSlide(0), 300);

  /* ═══ BEFORE/AFTER COMPARE SLIDERS ═══ */

  function initCompareSliders() {
    document.querySelectorAll('[data-compare]').forEach(container => {
      const handle   = container.querySelector('.compare__handle');
      const divider  = container.querySelector('.compare__divider');
      const before   = container.querySelector('.compare__before');
      let isDragging = false;

      function setPosition(pct) {
        pct = Math.max(5, Math.min(95, pct));
        before.style.clipPath    = `inset(0 ${100 - pct}% 0 0)`;
        divider.style.left       = pct + '%';
        handle.style.left        = pct + '%';
      }

      function getPercent(clientX) {
        const rect  = container.getBoundingClientRect();
        const x     = clientX - rect.left;
        return (x / rect.width) * 100;
      }

      /* Initialise at 50% */
      setPosition(50);

      /* Mouse events */
      handle.addEventListener('mousedown', e => {
        isDragging = true;
        e.preventDefault();
      });

      document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        setPosition(getPercent(e.clientX));
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      /* Touch events */
      handle.addEventListener('touchstart', e => {
        isDragging = true;
        compareIsDragging = true;
        e.preventDefault();
      }, { passive: false });

      document.addEventListener('touchmove', e => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition(getPercent(e.touches[0].clientX));
      }, { passive: false });

      document.addEventListener('touchend', () => {
        isDragging = false;
        compareIsDragging = false;
      });

      /* Click anywhere on the container to jump */
      container.addEventListener('click', e => {
        if (e.target === handle) return;
        setPosition(getPercent(e.clientX));
      });
    });
  }

  initCompareSliders();

  /* ═══ LIGHTBOX ═══ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  document.querySelectorAll('.problem__img').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      const label = el.querySelector('.problem__img-label');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = label ? label.textContent : '';
      lightbox.classList.add('active');
    });
  });

  /* ref-compare images → lightbox */
  document.querySelectorAll('.ref-compare__img[data-lightbox]').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      const item = el.closest('.ref-compare__item');
      const badge = item ? item.querySelector('.ref-compare__badge') : null;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCaption.textContent = badge ? badge.textContent : (img.alt || '');
      lightbox.classList.add('active');
    });
  });

  /* evidence buttons on deep-cards */
  document.querySelectorAll('.deep-card__evidence').forEach(el => {
    el.addEventListener('click', () => {
      lightboxImg.src = el.dataset.evidence;
      lightboxImg.alt = el.dataset.caption || '';
      lightboxCaption.textContent = el.dataset.caption || '';
      lightbox.classList.add('active');
    });
  });

  /* compare labels → lightbox compare mode */
  const lbCompare     = document.getElementById('lightboxCompare');
  const lbBefore      = document.getElementById('lbCompareBefore');
  const lbAfter       = document.getElementById('lbCompareAfter');
  const lbDivider     = document.getElementById('lbCompareDivider');
  const lbHandle      = document.getElementById('lbCompareHandle');
  let lbDragging      = false;

  function openCompareLightbox(beforeSrc, afterSrc) {
    lbBefore.querySelector('img').src = beforeSrc;
    lbAfter.querySelector('img').src  = afterSrc;
    lightbox.classList.add('active', 'lightbox--compare');
    setLbPosition(50);
  }

  function setLbPosition(pct) {
    pct = Math.max(5, Math.min(95, pct));
    lbBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    lbDivider.style.left    = pct + '%';
    lbHandle.style.left     = pct + '%';
  }

  function getLbPercent(clientX) {
    const rect = lbCompare.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  lbHandle.addEventListener('mousedown', e => { lbDragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (lbDragging) setLbPosition(getLbPercent(e.clientX)); });
  document.addEventListener('mouseup', () => { lbDragging = false; });
  lbHandle.addEventListener('touchstart', e => { lbDragging = true; e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove', e => { if (lbDragging) { e.preventDefault(); setLbPosition(getLbPercent(e.touches[0].clientX)); }}, { passive: false });
  document.addEventListener('touchend', () => { lbDragging = false; });
  lbCompare.addEventListener('click', e => { if (e.target !== lbHandle && !lbHandle.contains(e.target)) setLbPosition(getLbPercent(e.clientX)); });

  document.querySelectorAll('.compare__label').forEach(label => {
    label.addEventListener('click', e => {
      e.stopPropagation();
      const container = label.closest('[data-compare]');
      const beforeImg = container.querySelector('.compare__before img');
      const afterImg  = container.querySelector('.compare__after img');
      if (beforeImg && afterImg) openCompareLightbox(beforeImg.src, afterImg.src);
    });
  });

  /* compare thumbnails → lightbox (skip if clicking the link) */
  document.querySelectorAll('.compare__thumb[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let link navigate normally
      const img = el.querySelector('img');
      const label = el.querySelector('.compare__thumb-label');
      const site = el.querySelector('.compare__thumb-site');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCaption.textContent = (label ? label.textContent : '') + (site ? ' — ' + site.textContent : '');
      lightbox.classList.add('active');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active', 'lightbox--compare');
    lbDragging = false;
  }
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

})();
