import {describe,it,expect} from "vitest";
import {
  assertTemplateAlignment,bindAssignedTemplates,instantiatePageTemplate,
  validateSiteDocument,type CmsPageTemplate,type CmsTemplateRegistry,
  type ContentDefinition,type ContentEntry,
} from "../src/index.js";
import {initialSite} from "../../../examples/revise-foundation/src/site-data.js";
const source=structuredClone(initialSite);
const story=source.pages.find(p=>p.id==="stories")!;
const template:CmsPageTemplate={
  id:"fnf.project-story",version:1,sourceTheme:"revise",resourceType:"restoration-project",
  sections:structuredClone(story.sections),globalGroups:["announcement","header","footer"],
  bindings:[
    {sectionId:story.sections[0].id,slot:"heading",field:"title"},
    {sectionId:story.sections[1].id,slot:"heading",field:"title"},
  ],
};
const definitions:ContentDefinition[]=[{id:"restoration-project",version:1,fields:[
  {key:"title",type:"text",required:true},
  {key:"cover",type:"asset",required:true},
]}];
const entries:ContentEntry[]=[{
  id:"helicopter",siteId:source.id,definitionId:"restoration-project",definitionVersion:1,
  fields:{title:"Helicopter Restoration",cover:{kind:"asset",key:"fnf/helicopter"}},
}];
const registry:CmsTemplateRegistry={
  schema:"iam.cms.template-registry.v1",siteId:source.id,templates:[template],
  assignments:[{pageId:"stories",templateId:template.id,templateVersion:1,
    resource:{kind:"entry",id:"helicopter",type:"restoration-project"}}],
};
describe("merged typed content + original Stories template alignment",()=>{
  it("keeps 4 existing section IDs, renderer styles, and separate global owners",()=>{
    expect(()=>assertTemplateAlignment(source,registry,entries,definitions)).not.toThrow();
    expect(story.sections.map(s=>s.preset)).toEqual([
      "revise/campaign-teaser","revise/sticky-card-deck","revise/full-bleed-grid","revise/brand-film"]);
    expect(template.globalGroups).toEqual(["announcement","header","footer"]);
    expect(validateSiteDocument(source)).toEqual([]);
  });
  it("projects one resource into two different original sections without modifying records or defaults",()=>{
    const saved=structuredClone(source),bound=bindAssignedTemplates(source,registry,entries,definitions);
    expect(bound.pages.find(p=>p.id==="stories")!.sections.slice(0,2).map(s=>s.data.heading))
      .toEqual(["Helicopter Restoration","Helicopter Restoration"]);
    expect(bound.header).toEqual(source.header);
    expect(bound.footer).toEqual(source.footer);
    expect(source).toEqual(saved);
    const update=structuredClone(entries);update[0].fields.title="Flight-ready project";
    expect(bindAssignedTemplates(source,registry,update,definitions).pages.find(p=>p.id==="stories")!
      .sections[0].data.heading).toBe("Flight-ready project");
  });
  it("rejects drifted structure, wrong resource, wrong tenant, duplicate sources and stale versions",()=>{
    const changed=structuredClone(registry);changed.templates[0].sections[0].preset="unknown";
    expect(()=>assertTemplateAlignment(source,changed,entries,definitions)).toThrow(/changed section/);
    changed.templates[0].sections[0].preset=template.sections[0].preset;
    changed.assignments[0].templateVersion=99;
    expect(()=>assertTemplateAlignment(source,changed,entries,definitions)).toThrow(/not installed/);
    changed.assignments[0].templateVersion=1;changed.assignments[0].resource!.type="product";
    expect(()=>assertTemplateAlignment(source,changed,entries,definitions)).toThrow(/type mismatch/);
    changed.assignments[0].resource!.type="restoration-project";
    expect(()=>assertTemplateAlignment(source,changed,[{...entries[0],siteId:"not-fnf"}],definitions))
      .toThrow(/Cross-site/);
    changed.templates[0].bindings.push({...changed.templates[0].bindings[0]});
    expect(()=>assertTemplateAlignment(source,changed,entries,definitions)).toThrow(/Duplicate source slot/);
  });
  it("creates routes explicitly, rejects collision and requires pinned cross-theme renderers",()=>{
    const page={id:"helicopter-story",path:"/projects/helicopter/",title:"Helicopter",description:"Restoration"};
    const created=instantiatePageTemplate(source,template,page);
    expect(created.pages.length).toBe(6);
    expect(created.pages[5].sections).toEqual(template.sections);
    expect(source.pages.length).toBe(5);
    expect(()=>instantiatePageTemplate(created,template,page)).toThrow(/already exists/);
    const cross={...template,sourceTheme:"heuristic"};
    expect(()=>instantiatePageTemplate(source,cross,page)).toThrow(/not pinned/);
    const locks=[...new Set(template.sections.map(s=>s.preset))].map(id=>({
      id,package:"@inneranimalmedia/revise-theme",version:"1.0.0",
      integrity:"sha256-"+ "a".repeat(64),supportedOverrides:[]}));
    expect(instantiatePageTemplate(source,cross,page,locks).pages.length).toBe(6);
  });
});
