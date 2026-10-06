/* eslint-disable @next/next/no-img-element -- Host-owned media delivery; portable React renderer has no Next dependency. */
import type { CSSProperties } from "react";
import type { SiteDocument, SiteSection, SiteContentBlock } from "../../site-contracts/src/site-document";
import { catalog } from "./catalog";
import { safeUrl } from "./validation";
import styles from "./sections.module.css";

export type MountedSectionProps = {
  section: SiteSection;
  site: Pick<SiteDocument, "brand" | "design">;
  resolveMedia: (key: string) => string | null;
  capabilities?: { inquiry?: (data: FormData) => Promise<void> };
};
const text = (data: Record<string, unknown>, key: string) => typeof data[key] === "string" ? data[key] as string : "";
function Media({ mediaKey, alt, resolveMedia }: { mediaKey: string; alt: string; resolveMedia: MountedSectionProps["resolveMedia"] }) {
  const source = resolveMedia(mediaKey);
  return source && (source.startsWith("blob:") || safeUrl(source)) ? <img src={source} alt={alt} /> : <div className={styles.missing} role="img" aria-label="Media unavailable"><span>Media unavailable</span><small>{mediaKey || "Choose a media key"}</small></div>;
}
function Link({ data }: { data: Record<string, unknown> }) {
  const label = text(data, "ctaLabel") || text(data, "title");
  const href = safeUrl(data.ctaHref || data.href);
  return label && href ? <a className={styles.action} href={href}>{label}</a> : null;
}
function Panel({ block, resolveMedia, media }: { block: SiteContentBlock; resolveMedia: MountedSectionProps["resolveMedia"]; media?: boolean }) {
  const d = block.data;
  return <article className={styles.card}>{media && <Media mediaKey={text(d,"mediaKey")} alt={text(d,"alt")} resolveMedia={resolveMedia} />}<div><small>{text(d,"eyebrow")}</small><h3>{text(d,"title")}</h3><p>{text(d,"body") || text(d,"caption")}</p><Link data={d} /></div></article>;
}
export function MountedSection({ section, site, resolveMedia, capabilities }: MountedSectionProps) {
  const { data: d, settings: s, blocks = [] } = section;
  const entry = catalog.find(item => item.preset === section.preset && item.type === section.type);
  const design = site.design || {};
  const inverse = s.surface === "inverse";
  const bg = inverse ? design.ink : s.surface === "canvas" ? design.canvas : s.surface === "muted" ? design.accentSoft : design.paper;
  const source = s.backgroundMediaKey ? resolveMedia(s.backgroundMediaKey) : null;
  const image = source && (source.startsWith("blob:") || safeUrl(source)) ? source : null;
  const css = { "--section-accent": design.accent || "#5A7DF7", "--section-paper": design.paper || "#FFFFFF", "--section-ink": design.ink || "#17181C", backgroundColor: bg || (inverse ? "#17181C" : "#FFFFFF"), color: inverse ? (design.paper || "#FFFFFF") : (design.ink || "#17181C"), minHeight: s.minHeight === "screen" ? "100svh" : undefined, paddingBlock: {none:"0",sm:"1.5rem",md:"3rem",lg:"5rem"}[s.spacing || "lg"], ...(image ? {backgroundImage: `linear-gradient(#0008,#0008),url("${image.replace(/["\\\n\r]/g,"")}")`, color:"#FFFFFF",backgroundSize:"cover"} : {}) } as CSSProperties;
  if (!entry) return <section className={styles.section} style={css}><p>Renderer not installed: {section.preset}</p></section>;
  const heading = <div className={styles.intro}><small>{text(d,"eyebrow")}</small><h2>{text(d,"heading")}</h2>{text(d,"body") && <p>{text(d,"body")}</p>}</div>;
  return <section className={styles.section} style={css} data-preset={section.preset}>
    {s.backgroundMediaKey && !image && <p className={styles.notice}>Background media unavailable: {s.backgroundMediaKey}</p>}
    {entry.preset === "studio/editorial-hero" ? <div className={styles.hero}><div>{heading}<Link data={d} /></div>{text(d,"mediaKey") && <Media mediaKey={text(d,"mediaKey")} alt={text(d,"alt")} resolveMedia={resolveMedia} />}</div> :
    entry.preset === "studio/editorial-statement" ? <div className={styles.statement}>{heading}<Link data={d} /></div> :
    entry.preset === "studio/inquiry" ? <div className={styles.statement}>{heading}{capabilities?.inquiry ? <form onSubmit={async event => {event.preventDefault();const form=event.currentTarget;const status=form.querySelector("output");try{await capabilities.inquiry!(new FormData(form));if(status)status.textContent="Inquiry received by the connected provider.";}catch{if(status)status.textContent="Could not send. Please try again.";}}}><label>Name<input name="name" required autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Message<textarea name="message" required /></label><button type="submit">{text(d,"ctaLabel") || "Send inquiry"}</button><output aria-live="polite" /></form> : <p className={styles.notice}>Connect an inquiry provider to accept submissions.</p>}</div> :
    <>{heading}{blocks.length ? <div className={entry.preset === "studio/media-diptych" ? styles.diptych : entry.preset === "studio/impact-strip" ? styles.metrics : styles.grid}>{blocks.map(block => <Panel key={block.id} block={block} resolveMedia={resolveMedia} media={entry.preset === "studio/media-diptych"} />)}</div> : <p className={styles.notice}>No content blocks yet.</p>}</>}
  </section>;
}
export function SitePreview({ document, pageId, resolveMedia, select, selected }: { document: SiteDocument; pageId: string; resolveMedia: MountedSectionProps["resolveMedia"]; select?: (id:string)=>void; selected?:string }) {
  const page = document.pages.find(p => p.id === pageId) || document.pages[0];
  return <div data-site-preview className={styles.site} style={{"--section-accent":document.design?.accent || "#5A7DF7","--section-ink":document.design?.ink || "#17181C","--section-paper":document.design?.paper || "#FFFFFF"} as CSSProperties}>
    <header className={styles.header} style={{position:document.header.settings.sticky?"sticky":undefined,borderRadius:document.header.settings.pill?"1rem":undefined}}>
      {document.header.announcement.enabled && <p className={styles.announcement}>{document.header.announcement.messages.join(" · ")}</p>}
      <nav aria-label="Site navigation">{document.header.blocks.map(block => block.type === "action" ? <span key={block.id} className={styles.unavailable} title="Host action is not connected">{block.label} · unavailable</span> : <a key={block.id} href={safeUrl(block.href)} className={block.type === "brand" ? styles.brand : ""}>{block.label}</a>)}</nav>
    </header>
    {page?.sections.map(section => <div key={section.id} data-section-id={section.id} className={select ? styles.selectable : undefined} data-selected={selected===section.id} onClick={select ? event => {if((event.target as HTMLElement).closest("a")) event.preventDefault();select(section.id);} : undefined}>{select && <button className={styles.selectButton} onClick={()=>select(section.id)} aria-label={"Edit "+section.preset}>Edit section</button>}<MountedSection section={section} site={document} resolveMedia={resolveMedia} /></div>)}
    <footer className={styles.footer} style={{background:document.footer.settings.background==="inverse"?"var(--section-ink)":"var(--section-paper)",color:document.footer.settings.background==="inverse"?"var(--section-paper)":"var(--section-ink)"}}>{document.footer.blocks.map(block=><div key={block.id}><h3>{block.title}</h3><p>{block.description}</p>{block.links?.map(link=><a key={link.id} href={safeUrl(link.href)}>{link.label}</a>)}{block.type==="newsletter"&&<small>Newsletter provider not connected.</small>}</div>)}<small>{document.footer.settings.copyright}</small></footer>
  </div>;
}
