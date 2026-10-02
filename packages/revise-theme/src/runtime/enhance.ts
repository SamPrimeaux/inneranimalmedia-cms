import { OverlayManager } from "./overlay-manager.js";

export interface ReviseEnhancement {
  overlays: OverlayManager;
  dispose(): void;
}

export function enhanceRevise(root: Document | HTMLElement = document): ReviseEnhancement {
  const overlays = new OverlayManager(root);
  const cleanup: Array<() => void> = [overlays.bind()];

  const header = root.querySelector<HTMLElement>("[data-revise-header]");
  if (header) {
    let queued = false;
    const update = () => {
      queued = false;
      header.classList.toggle("is-scrolled", window.scrollY > 72);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanup.push(() => window.removeEventListener("scroll", onScroll));
  }

  root.querySelectorAll<HTMLElement>("[data-tab-group]").forEach((group) => {
    const click = (event: Event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-tab-target]");
      if (!target) return;
      const id = target.dataset.tabTarget ?? "";
      group.querySelectorAll<HTMLElement>("[data-tab-target]").forEach((button) => {
        const active = button === target;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      group.querySelectorAll<HTMLElement>("[data-tab-panel]").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.tabPanel === id);
      });
    };
    group.addEventListener("click", click);
    cleanup.push(() => group.removeEventListener("click", click));
  });

  root.querySelectorAll<HTMLElement>(".iam-collection-track__rail").forEach((rail) => {
    const panel = rail.closest<HTMLElement>(".iam-collection-track__panel");
    const thumb = panel?.querySelector<HTMLElement>(".iam-track-progress > span");
    if (!thumb) return;
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const progress = max > 0 ? rail.scrollLeft / max : 0;
      thumb.style.transform = "scaleX(" + Math.max(.12, 1 - max / Math.max(rail.scrollWidth, 1)) + ") translateX(" +
        (progress * 100) + "%)";
    };
    rail.addEventListener("scroll", update, { passive: true });
    update();
    cleanup.push(() => rail.removeEventListener("scroll", update));
  });

  root.querySelectorAll<HTMLElement>("[data-before-after]").forEach((comparison) => {
    const range = comparison.querySelector<HTMLInputElement>(".iam-before-after__range");
    if (!range) return;
    const update = () => comparison.style.setProperty("--position", range.value + "%");
    range.addEventListener("input", update);
    update();
    cleanup.push(() => range.removeEventListener("input", update));
  });

  const offer = root.querySelector<HTMLElement>(".revise-offer-tab");
  if (offer) {
    let queued = false;
    const updateOffer = () => {
      queued = false;
      offer.classList.toggle("is-visible", window.scrollY > window.innerHeight * .72);
    };
    const onOfferScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(updateOffer);
    };
    updateOffer();
    window.addEventListener("scroll", onOfferScroll, { passive: true });
    cleanup.push(() => window.removeEventListener("scroll", onOfferScroll));
  }

  root.querySelectorAll<HTMLElement>("[data-hotspot]").forEach((spot) => {
    const click = () => {
      const open = spot.dataset.open === "true";
      root.querySelectorAll<HTMLElement>("[data-hotspot]").forEach((other) => delete other.dataset.open);
      if (!open) spot.dataset.open = "true";
    };
    spot.addEventListener("click", click);
    cleanup.push(() => spot.removeEventListener("click", click));
  });

  return {
    overlays,
    dispose() {
      cleanup.splice(0).forEach((fn) => fn());
    },
  };
}
