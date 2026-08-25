document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("projects");
  if (!section) return;

  /* ── Tab switching ── */
  const tabButtons = Array.from(
    section.querySelectorAll<HTMLButtonElement>("[data-tab]"),
  );
  const tabPanels = Array.from(
    section.querySelectorAll<HTMLElement>("[data-panel]"),
  );

  const setActiveTab = (key: string) => {
    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === key;
      btn.classList.toggle("bg-surface", isActive);
      btn.classList.toggle("text-accent", isActive);
      btn.classList.toggle("text-muted", !isActive);
      const icon = btn.querySelector<HTMLElement>("[data-tab-icon]");
      if (icon) icon.classList.toggle("text-accent", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
    tabPanels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== key;
    });
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.tab;
      if (key) setActiveTab(key);
    });
  });

  /* ── Crossfade carousels (one per panel, independent) ── */
  const carousels = Array.from(
    section.querySelectorAll<HTMLElement>("[data-carousel]"),
  );

  const ACTIVE_DOT = "w-6 h-1.5 rounded-full bg-accent";
  const IDLE_DOT = "w-1.5 h-1.5 rounded-full bg-ink/25";

  carousels.forEach((carousel) => {
    const slides = Array.from(
      carousel.querySelectorAll<HTMLElement>(".pslide"),
    );
    const dots = Array.from(
      carousel.querySelectorAll<HTMLButtonElement>("[data-dot]"),
    );
    const prevButtons = Array.from(
      carousel.querySelectorAll<HTMLButtonElement>("[data-prev]"),
    );
    const nextButtons = Array.from(
      carousel.querySelectorAll<HTMLButtonElement>("[data-next]"),
    );
    const viewport = carousel.querySelector<HTMLElement>("[data-swipe]");
    if (!slides.length) return;

    const total = slides.length;
    let index = 0;

    const update = () => {
      index = Math.max(0, Math.min(index, total - 1));
      slides.forEach((slide, si) =>
        slide.classList.toggle("is-active", si === index),
      );
      dots.forEach((dot, di) => {
        dot.className =
          "transition-all press " + (di === index ? ACTIVE_DOT : IDLE_DOT);
      });
    };

    const goNext = () => {
      index += 1;
      update();
    };
    const goPrev = () => {
      index -= 1;
      update();
    };

    prevButtons.forEach((btn) => btn.addEventListener("click", goPrev));
    nextButtons.forEach((btn) => btn.addEventListener("click", goNext));
    dots.forEach((dot, di) => {
      dot.addEventListener("click", () => {
        index = di;
        update();
      });
    });

    /* ── Swipe / pointer-drag (crossfade → act on release) ── */
    const THRESHOLD = 40;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let lastSwipe = 0;

    const onStart = (x: number, y: number) => {
      startX = x;
      startY = y;
      tracking = true;
    };

    const onEnd = (x: number, y: number) => {
      if (!tracking) return;
      tracking = false;
      const dx = x - startX;
      const dy = y - startY;
      // Ignore taps and mostly-vertical gestures.
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;
      // Dedupe overlapping pointer + touch events from one gesture.
      const now = Date.now();
      if (now - lastSwipe < 400) return;
      lastSwipe = now;
      if (dx < 0) goNext();
      else goPrev();
    };

    if (viewport) {
      // Pointer events (mouse / pen / touch where supported).
      viewport.addEventListener("pointerdown", (e) =>
        onStart(e.clientX, e.clientY),
      );
      viewport.addEventListener("pointermove", (e) => {
        if (!tracking) return;
        // Prevent text selection while dragging horizontally.
        if (Math.abs(e.clientX - startX) > Math.abs(e.clientY - startY)) {
          e.preventDefault();
        }
      });
      viewport.addEventListener("pointerup", (e) =>
        onEnd(e.clientX, e.clientY),
      );
      viewport.addEventListener("pointercancel", () => {
        tracking = false;
      });

      // Touch events fallback.
      viewport.addEventListener(
        "touchstart",
        (e) => {
          const t = e.changedTouches[0];
          if (t) onStart(t.clientX, t.clientY);
        },
        { passive: true },
      );
      viewport.addEventListener("touchend", (e) => {
        const t = e.changedTouches[0];
        if (t) onEnd(t.clientX, t.clientY);
      });
      viewport.addEventListener("touchcancel", () => {
        tracking = false;
      });
    }

    update();
  });
});
