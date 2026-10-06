import type { SiteDocument, SiteSection } from "../../site-contracts/src/site-document";
import { createSection } from "./catalog";
/** Explicit gallery sample data, never fallback content inside a renderer. */
export function previewFixture(preset:string,site:Pick<SiteDocument,"brand">):SiteSection {
  const section=createSection(preset,"gallery-sample");
  section.data={...section.data,eyebrow:"SAMPLE COMPOSITION",heading:site.brand.name,body:"Replace this sample with the importing site's own copy, media and destination links.",ctaLabel:"Explore",ctaHref:site.brand.home};
  if(preset==="studio/editorial-hero")section.data.mediaKey=site.brand.name.toLowerCase().replace(/[^a-z]+/g,".")+".hero";
  if(["studio/media-diptych","studio/capability-grid","studio/impact-strip"].includes(preset))section.blocks=[1,2,3].slice(0,preset==="studio/media-diptych"?2:3).map(i=>({id:"sample-"+i,type:"item",data:{title:"Sample item "+i,caption:"Customer-owned content",body:"An independently editable content block.",mediaKey:"sample.media."+i,alt:"Sample media",ctaLabel:"Explore",href:site.brand.home}}));
  return section;
}
