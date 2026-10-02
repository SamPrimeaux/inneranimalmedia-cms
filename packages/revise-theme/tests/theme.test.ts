import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { validateThemeManifest } from "@inneranimalmedia/site-contracts";
import { reviseThemeManifest } from "../src/runtime/register.js";

const here = new URL("../", import.meta.url);

describe("Revise foundation", () => {
  it("uses the shared theme contract", () => {
    expect(validateThemeManifest(reviseThemeManifest)).toEqual([]);
  });

  it("keeps the JSON manifest aligned with runtime registration", async () => {
    const json = JSON.parse(
      await readFile(new URL("src/manifest/theme.json", here), "utf8"),
    );
    expect(json).toEqual(reviseThemeManifest);
  });

  it("locks the requested layout and motion tokens", async () => {
    const layout = await readFile(new URL("src/tokens/layout.css", here), "utf8");
    const motion = await readFile(new URL("src/tokens/motion.css", here), "utf8");
    expect(layout).toContain("--revise-layout-max: 1440px");
    expect(layout).toContain("--revise-layout-reading: 760px");
    expect(layout).toContain("--revise-gutter: clamp(16px, 4vw, 56px)");
    expect(motion).toContain("--revise-dur-feedback: 220ms");
    expect(motion).toContain("--revise-dur-scene: 1100ms");
  });

  it("has an explicit reduced-motion path", async () => {
    const css = await readFile(new URL("src/motion/revise-motion.css", here), "utf8");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});
