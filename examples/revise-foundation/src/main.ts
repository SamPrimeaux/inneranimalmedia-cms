import "@inneranimalmedia/section-library/layout.css";
import "@inneranimalmedia/revise-theme/theme.css";
import "./demo.css";

import {
  presetLibraryFrom,
  renderPage,
} from "@inneranimalmedia/section-library";
import foundation from "@inneranimalmedia/revise-theme/presets/foundation";
import heroPreset from "@inneranimalmedia/revise-theme/presets/sections/media-hero/sticky-curtain";
import statementPreset from "@inneranimalmedia/revise-theme/presets/sections/statement/editorial";
import type {
  PagePreset,
  SectionPreset,
} from "@inneranimalmedia/site-contracts";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");

const media: Record<string, string> = {
  "home.hero.primary": "/revise-hero.svg",
};

const pageHtml = renderPage(foundation as PagePreset, {
  context: {
    theme: "revise",
    resolveMedia: (key) => media[key] ?? null,
  },
  presets: presetLibraryFrom([
    heroPreset as SectionPreset,
    statementPreset as SectionPreset,
  ]),
});

app.innerHTML = [
  '<div data-theme="revise" class="revise-demo">',
  '<div class="revise-announcement">Revise 0.1 foundation · tokens + layout contract</div>',
  '<header class="revise-header">',
  '<a class="revise-header__brand iam-touch-target" href="#">Revise</a>',
  '<nav class="revise-header__nav" aria-label="Demo navigation">',
  '<a class="iam-touch-target" href="#system">System</a>',
  '<a class="iam-touch-target" href="#layout">Layout</a>',
  "</nav>",
  "</header>",
  "<main>",
  pageHtml,
  '<section id="layout" class="iam-layout-max iam-safe-inline iam-section-space-lg revise-layout-proof">',
  '<p class="revise-layout-proof__eyebrow">Layout contract</p>',
  "<h2>Five widths. One fluid gutter. No desktop-only geometry.</h2>",
  '<div class="revise-layout-proof__stack">',
  '<div class="revise-width revise-width--max"><span>max · 1440</span></div>',
  '<div class="revise-width revise-width--wide"><span>wide · 1320</span></div>',
  '<div class="revise-width revise-width--content"><span>content · 1200</span></div>',
  '<div class="revise-width revise-width--reading"><span>reading · 760</span></div>',
  "</div>",
  "</section>",
  "</main>",
  '<footer class="iam-layout-content iam-safe-inline revise-demo__footer">',
  "<span>Framework-independent.</span><span>Host-resolved media.</span><span>Reduced-motion safe.</span>",
  "</footer>",
  "</div>",
].join("");
