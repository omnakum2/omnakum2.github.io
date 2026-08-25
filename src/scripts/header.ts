// ── Mobile menu toggle ────────────────────────────────────────────────
const toggle = document.getElementById("mobile-menu-toggle");
const menu = document.getElementById("mobile-menu");
const iconOpen = toggle?.querySelector<SVGElement>("[data-menu-open]");
const iconClose = toggle?.querySelector<SVGElement>("[data-menu-close]");

function setMenu(open: boolean): void {
  menu?.classList.toggle("hidden", !open);
  iconOpen?.classList.toggle("hidden", open);
  iconClose?.classList.toggle("hidden", !open);
  toggle?.setAttribute("aria-expanded", String(open));
}

toggle?.addEventListener("click", () => {
  // If the menu is currently hidden, this click opens it.
  setMenu(menu?.classList.contains("hidden") ?? false);
});

menu
  ?.querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => setMenu(false)));

// ── Scroll-spy: highlight the desktop link for the section in view ─────
const navLinks = Array.from(
  document.querySelectorAll<HTMLAnchorElement>("[data-nav]"),
);
const sections = navLinks
  .map((link) => {
    const id = link.getAttribute("data-nav");
    const el = id ? document.querySelector<HTMLElement>(id) : null;
    return el && id ? { id, el } : null;
  })
  .filter((s): s is { id: string; el: HTMLElement } => s !== null);

function setActive(activeId: string): void {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("data-nav") === activeId;
    link.classList.toggle("text-accent", isActive);
    link.classList.toggle("bg-accent/10", isActive);
    link.classList.toggle("text-ink", !isActive);
  });
}

let ticking = false;
function onScroll(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    // The last section whose top has scrolled above the ~100px offset wins;
    // defaults to the first nav target (#home) while pinned at the top.
    let current = sections.length ? sections[0].id : "#home";
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top <= 100) current = s.id;
    }
    setActive(current);
    ticking = false;
  });
}

if (sections.length) {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}
