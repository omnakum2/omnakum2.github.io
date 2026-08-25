// Shared magnetic tilt + cursor light for [data-tilt] elements.
// Sets --mx/--my (consumed by the [data-tilt]::after cursor light in global.css)
// and a small 3D tilt transform toward the pointer. `data-tilt="6"` overrides the
// max tilt in degrees (default 4). Tilt is skipped under prefers-reduced-motion;
// the cursor light still tracks. Pointer events cover mouse, pen, and touch.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initTilt(): void {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt || '') || 4;

    el.addEventListener('pointermove', (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(1)}px`);
      el.style.setProperty('--my', `${(e.clientY - r.top).toFixed(1)}px`);
      if (reduce) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTilt, { once: true });
} else {
  initTilt();
}
