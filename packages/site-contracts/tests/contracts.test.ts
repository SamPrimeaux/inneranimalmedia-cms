import { describe, expect, it } from "vitest";
import {
  LAYOUT_BOUNDS,
  normalizeLayout,
  validateLayout,
  validateThemeManifest,
} from "../src/index.js";

describe("site contracts", () => {
  it("locks the shared geometry bounds", () => {
    expect(LAYOUT_BOUNDS).toEqual({
      max: 1440,
      wide: 1320,
      content: 1200,
      reading: 760,
      touchMinPx: 44,
      iosFormFontMinPx: 16,
    });
  });

  it("normalizes optional layout policy", () => {
    expect(normalizeLayout({ width: "wide", bleed: "background" })).toEqual({
      width: "wide",
      bleed: "background",
      gutters: { mode: "fluid" },
      spacing: { block: "md" },
    });
  });

  it("rejects invalid layout roles", () => {
    expect(validateLayout({ width: "giant", bleed: "none" })).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: "layout.width" })]),
    );
  });

  it("validates a contract-v1 theme", () => {
    expect(validateThemeManifest({
      id: "revise",
      name: "Revise",
      package: "@inneranimalmedia/revise-theme",
      contractVersion: 1,
      kind: "theme",
      capabilities: [],
      layout: {
        mobileFirst: true,
        maxWidth: 1440,
        containerQueryReady: true,
        safeAreaAware: true,
      },
      accessibility: {
        reducedMotion: true,
        keyboard: true,
        touch: true,
        focusManagement: true,
      },
    })).toEqual([]);
  });
});
