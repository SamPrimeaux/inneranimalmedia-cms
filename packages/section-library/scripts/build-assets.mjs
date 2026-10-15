import { copyFile, mkdir } from "node:fs/promises";

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
await copyFile(
  new URL("../css/layout.css", import.meta.url),
  new URL("../dist/layout.css", import.meta.url),
);

await copyFile(new URL("../css/specimens.css", import.meta.url), new URL("../dist/specimens.css", import.meta.url));
await copyFile(new URL("../css/specimens-motion.js", import.meta.url), new URL("../dist/specimens-motion.js", import.meta.url));