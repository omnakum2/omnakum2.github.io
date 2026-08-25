// Motion foundation, loaded once per page via BaseLayout.
//
// Provides: scroll reveals ([data-reveal]), count-up ([data-countup]), the
// reading-progress bar (#scroll-progress), and the back-to-top control
// (#back-to-top). Every effect gates on prefers-reduced-motion. The
// resting/native DOM state is always the final visible state, so the page
// degrades gracefully without JS.

const prefersReduced = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Scroll reveal ───────────────────────────────────────────────────────────
// Adds `.is-visible` when an element enters the viewport; CSS does the animation.
function initReveal(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (targets.length === 0) return;

  if (prefersReduced() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
  );
  targets.forEach((el) => io.observe(el));
}

// ── Count-up ────────────────────────────────────────────────────────────────
// Numbers tagged [data-countup] count from 0 to their printed value on first
// scroll-in. Keeps any prefix ($, £) and suffix (%, +, x). Skips anything that
// doesn't parse. The printed text is the source of truth.
function initCountUp(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-countup]'));
  if (els.length === 0 || prefersReduced() || !('IntersectionObserver' in window)) return;

  const animate = (el: HTMLElement): void => {
    const finalText = (el.textContent ?? '').trim();
    const match = finalText.match(/^([^\d-]*)(-?\d[\d,]*(?:\.\d+)?)(.*)$/s);
    if (!match || !match[2]) return;

    const prefix = match[1] ?? '';
    const numStr = match[2];
    const suffix = match[3] ?? '';
    const target = parseFloat(numStr.replace(/,/g, ''));
    if (!Number.isFinite(target)) return;

    const decimals = (numStr.split('.')[1] ?? '').length;
    const duration = target < 20 || decimals > 0 ? 1200 : 1800;
    let start: number | null = null;

    const tick = (now: number): void => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      if (progress < 1) {
        const current = eased * target;
        el.textContent =
          prefix +
          (decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString()) +
          suffix;
        requestAnimationFrame(tick);
      } else {
        el.textContent = finalText; // restore exact original formatting
      }
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          io.unobserve(entry.target);
          animate(entry.target as HTMLElement);
        }
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}

// ── Scroll progress ─────────────────────────────────────────────────────────
// Drives the site-wide reading-progress bar (#scroll-progress) by scaling it
// L→R from 0 to 1 across the document. A direct position indicator, not a
// decorative animation, so it stays active under reduced-motion. rAF-batched.
function initScrollProgress(): void {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let raf = 0;
  const update = (): void => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? Math.min(Math.max(doc.scrollTop / max, 0), 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  };
  const onScroll = (): void => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

// ── Back to top ─────────────────────────────────────────────────────────────
// Reveals the floating #back-to-top control once the user is past ~60% of the
// first viewport, and returns to the top on click (respecting reduced-motion).
function initBackToTop(): void {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = (): void => {
    btn.classList.toggle('is-shown', window.scrollY > window.innerHeight * 0.6);
  };
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

function init(): void {
  initReveal();
  initCountUp();
  initScrollProgress();
  initBackToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
