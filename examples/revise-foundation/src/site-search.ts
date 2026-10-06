import type { SiteDocument } from "@inneranimalmedia/site-contracts";

export interface SiteSearchEntry {
  title: string;
  description: string;
  href: string;
  kind: "Page" | "Section" | "Collection";
  keywords: string;
}

const words = (value: string) => value
  .toLocaleLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .split(/[^a-z0-9]+/)
  .filter(Boolean);

const clip = (value: unknown, max = 120) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export function buildSiteSearchIndex(site: SiteDocument): SiteSearchEntry[] {
  const entries: SiteSearchEntry[] = [];
  const seen = new Set<string>();
  function push(entry: SiteSearchEntry) {
    if (!entry.title || seen.has(entry.href + ":" + entry.title)) return;
    seen.add(entry.href + ":" + entry.title);
    entries.push(entry);
  }
  for (const page of site.pages) {
    push({
      title: page.title,
      description: page.description,
      href: page.path,
      kind: "Page",
      keywords: [page.id, page.title, page.description].join(" "),
    });
    for (const section of page.sections) {
      const data = section.data;
      const heading = clip(data.heading, 95);
      if (heading) {
        push({
          title: heading,
          description: clip(data.body || data.eyebrow || page.title),
          href: page.path + "#" + encodeURIComponent(section.id),
          kind: "Section",
          keywords: [page.title, section.preset, heading, clip(data.eyebrow), clip(data.body)].join(" "),
        });
      }
      const items = Array.isArray(data.items) ? data.items : [];
      for (const item of items.slice(0, 20)) {
        if (!item || typeof item !== "object") continue;
        const record = item as Record<string, unknown>;
        const title = clip(record.title, 95);
        if (!title) continue;
        push({
          title,
          description: clip(record.body || record.label || "Explore " + page.title),
          href: page.path + "#" + encodeURIComponent(section.id),
          kind: "Collection",
          keywords: [title, page.title, clip(record.label), clip(record.body)].join(" "),
        });
      }
    }
  }
  return entries;
}

export function searchSite(
  entries: readonly SiteSearchEntry[],
  query: string,
  limit = 7,
): SiteSearchEntry[] {
  const terms = words(query);
  if (!terms.length) {
    return ["/products/", "/campaigns/", "/stories/", "/ideas/"]
      .map((href) => entries.find((entry) => entry.kind === "Page" && entry.href === href))
      .filter((entry): entry is SiteSearchEntry => Boolean(entry))
      .slice(0, limit);
  }
  return entries.map((entry, index) => {
    const title = entry.title.toLowerCase();
    const text = (entry.title + " " + entry.description + " " + entry.keywords).toLowerCase();
    const score = terms.every((term) => text.includes(term))
      ? terms.reduce((total, term) => total +
        (title === term ? 20 : title.startsWith(term) ? 10 : title.includes(term) ? 7 : 2), 0) +
        (entry.kind === "Section" ? 6 : entry.kind === "Page" ? 4 : 0)
      : -1;
    return { entry, index, score };
  }).filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .filter((result, index, all) =>
      all.findIndex((candidate) => candidate.entry.title.toLowerCase() === result.entry.title.toLowerCase()) === index)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
