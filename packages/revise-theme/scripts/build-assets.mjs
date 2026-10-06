import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
await mkdir(dist, { recursive: true });
await mkdir(new URL("../dist/presets/", import.meta.url), { recursive: true });

const tokenFiles = [
  "src/tokens/layout.css",
  "src/tokens/color.css",
  "src/tokens/typography.css",
  "src/tokens/spacing.css",
  "src/tokens/radius.css",
  "src/tokens/motion.css",
  "src/tokens/z-index.css",
  "src/tokens/shadow.css",
  "src/tokens/overlay.css",
  "src/tokens/commerce.css",
  "src/tokens/media.css",
];

const themeFiles = [
  ...tokenFiles,
  "src/theme/base.css",
  "src/shell/header.css",
  "src/shell/overlays.css",
  "src/shell/search-palette.css",
  "src/shell/footer.css",
  "src/variants/sections/foundation.css",
  "src/variants/sections/showcase.css",
  "src/motion/revise-motion.css",
];

async function concat(files) {
  const parts = [];
  for (const file of files) {
    parts.push("/* " + file + " */\n" + await readFile(new URL(file, root), "utf8"));
  }
  return parts.join("\n\n");
}

await writeFile(new URL("tokens.css", dist), await concat(tokenFiles));
await writeFile(new URL("theme.css", dist), await concat(themeFiles));

for (const name of ["theme.json", "capabilities.json", "compatibility.json"]) {
  await writeFile(
    new URL(name, dist),
    await readFile(new URL("src/manifest/" + name, root), "utf8"),
  );
}

await writeFile(
  new URL("presets/foundation.json", dist),
  await readFile(new URL("src/presets/pages/foundation.json", root), "utf8"),
);
await writeFile(
  new URL("presets/media-hero.sticky-curtain.json", dist),
  await readFile(new URL("src/presets/sections/media-hero.sticky-curtain.json", root), "utf8"),
);
await writeFile(
  new URL("presets/statement.editorial.json", dist),
  await readFile(new URL("src/presets/sections/statement.editorial.json", root), "utf8"),
);
