export type OverlayShape =
  | "left-sheet"
  | "right-sheet"
  | "wide-right-sheet"
  | "top-sheet"
  | "bottom-sheet"
  | "center-dialog"
  | "fullscreen-viewer"
  | "anchored-card";

export interface OverlayOpenOptions {
  trigger?: HTMLElement | null;
  focus?: HTMLElement | null;
}

function focusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
  )].filter((item) => !item.hasAttribute("hidden"));
}

export class OverlayManager {
  private active: HTMLElement | null = null;
  private trigger: HTMLElement | null = null;
  private scrim: HTMLElement | null = null;
  private cleanup: Array<() => void> = [];

  constructor(private readonly root: Document | HTMLElement = document) {}

  bind(): () => void {
    this.scrim = this.root.querySelector<HTMLElement>("[data-overlay-scrim]");
    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const opener = target?.closest<HTMLElement>("[data-overlay-open]");
      if (opener) {
        event.preventDefault();
        this.open(opener.dataset.overlayOpen ?? "", { trigger: opener });
        return;
      }

      const closer = target?.closest<HTMLElement>("[data-overlay-close]");
      if (closer) {
        event.preventDefault();
        this.close();
        return;
      }

      if (target?.matches("[data-overlay-scrim]")) {
        this.close();
      }
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (!this.active) return;
      if (event.key === "Escape") {
        event.preventDefault();
        this.close();
        return;
      }
      if (event.key !== "Tab" || this.active.dataset.overlayModal !== "true") return;

      const items = focusable(this.active);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    this.root.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeydown);
    this.cleanup.push(
      () => this.root.removeEventListener("click", onClick),
      () => document.removeEventListener("keydown", onKeydown),
    );
    return () => this.dispose();
  }

  open(id: string, options: OverlayOpenOptions = {}): void {
    const panel = this.root.querySelector<HTMLElement>('[data-overlay="' + CSS.escape(id) + '"]');
    if (!panel) return;

    if (this.active && this.active !== panel) this.finishClose(this.active);

    this.active = panel;
    this.trigger = options.trigger ?? document.activeElement as HTMLElement | null;
    const modal = panel.dataset.overlayModal === "true";
    panel.inert = false;
    panel.setAttribute("aria-hidden", "false");
    panel.dataset.state = "opening";

    if (modal) {
      document.documentElement.classList.add("revise-scroll-locked");
      this.scrim?.setAttribute("data-state", "open");
    }

    requestAnimationFrame(() => {
      if (this.active !== panel) return;
      panel.dataset.state = "open";
      const requested = options.focus ??
        panel.querySelector<HTMLElement>("[data-overlay-autofocus]") ??
        focusable(panel)[0];
      requested?.focus({ preventScroll: true });
    });
  }

  close(): void {
    const panel = this.active;
    if (!panel) return;

    const duration = Number(panel.dataset.overlayDuration ?? "620");
    panel.dataset.state = "closing";
    this.scrim?.setAttribute("data-state", "closed");
    document.documentElement.classList.remove("revise-scroll-locked");

    window.setTimeout(() => {
      if (this.active === panel) this.finishClose(panel);
    }, Math.max(80, duration));
  }

  private finishClose(panel: HTMLElement): void {
    panel.dataset.state = "closed";
    panel.setAttribute("aria-hidden", "true");
    panel.inert = true;
    if (this.active === panel) this.active = null;

    const trigger = this.trigger;
    this.trigger = null;
    trigger?.focus({ preventScroll: true });
  }

  dispose(): void {
    this.cleanup.splice(0).forEach((fn) => fn());
    if (this.active) this.finishClose(this.active);
    this.scrim?.setAttribute("data-state", "closed");
    document.documentElement.classList.remove("revise-scroll-locked");
  }
}
