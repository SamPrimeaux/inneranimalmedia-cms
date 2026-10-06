import { describe,it,expect } from "vitest";
import {
  bindAssignedTemplates,type ContentDefinition,type ContentEntry,
  type CmsTemplateRegistry,type CmsPageTemplate
} from "@inneranimalmedia/site-contracts";
import { renderSiteSection,presetLibraryFrom } from "@inneranimalmedia/section-library";
import { reviseShowcasePresets } from "@inneranimalmedia/revise-theme";
import { initialSite } from "../src/site-data.js";

const site=structuredClone(initialSite);
const home=site.pages.find(page=>page.id==="home")!;
const stories=site.pages.find(page=>page.id==="stories")!;
const project={
  id:"heli-restoration",siteId:site.id,definitionId:"restoration-project",definitionVersion:1,
  fields:{title:"Helicopter Restoration",cover:{kind:"asset",key:"fnf/helicopter/cover"}},
} satisfies ContentEntry;
const definitions:ContentDefinition[]=[{id:"restoration-project",version:1,fields:[
  {key:"title",type:"text",required:true},{key:"cover",type:"asset",required:true},
]}];
const templates:CmsPageTemplate[]=[
  {id:"fnf.home",version:1,sourceTheme:"revise",resourceType:"restoration-project",
    sections:structuredClone(home.sections),globalGroups:["announcement","header","footer"],
    bindings:[{sectionId:home.sections[1].id,slot:"heading",field:"title"}]},
  {id:"fnf.story",version:1,sourceTheme:"revise",resourceType:"restoration-project",
    sections:structuredClone(stories.sections),globalGroups:["announcement","header","footer"],
    bindings:[
      {sectionId:stories.sections[0].id,slot:"heading",field:"title"},
      {sectionId:stories.sections[0].id,slot:"mediaKey",field:"cover",project:"asset-key"},
    ]},
];
const registry:CmsTemplateRegistry={
  schema:"iam.cms.template-registry.v1",siteId:site.id,templates,
  assignments:[
    {pageId:"home",templateId:"fnf.home",templateVersion:1,
      resource:{kind:"entry",id:project.id,type:"restoration-project"}},
    {pageId:"stories",templateId:"fnf.story",templateVersion:1,
      resource:{kind:"entry",id:project.id,type:"restoration-project"}},
  ],
};
describe("original Revise renderers consume the unified typed source/template contract",()=>{
  it("renders one project in two genuine different page designs without replacing source renderer markup",()=>{
    const projected=bindAssignedTemplates(site,registry,[project],definitions);
    const options={
      context:{theme:"revise",resolveMedia:(key:string)=>
        key==="fnf/helicopter/cover"?"/cms-media/helicopter-cover.webp":null},
      presets:presetLibraryFrom(reviseShowcasePresets),
    };
    const homeHtml=renderSiteSection(projected.pages.find(p=>p.id==="home")!.sections[1],options);
    const storyHtml=renderSiteSection(projected.pages.find(p=>p.id==="stories")!.sections[0],options);
    expect(homeHtml).toContain("Helicopter Restoration");
    expect(storyHtml).toContain("Helicopter Restoration");
    expect(storyHtml).toContain("/cms-media/helicopter-cover.webp");
    expect(storyHtml).toContain('data-site-preset="revise/campaign-teaser"');
    expect(homeHtml).toContain('data-site-preset="revise/wardrobe-rail"');
    expect(projected.header).toEqual(site.header);
    expect(projected.footer).toEqual(site.footer);
    expect(site.pages.find(p=>p.id==="stories")!.sections[0].data)
      .toEqual(stories.sections[0].data);
    expect(projected.pages.find(p=>p.id==="stories")!.sections.map(s=>s.preset))
      .toEqual(stories.sections.map(s=>s.preset));
  });
  it("does not accept an arbitrary network URL in a typed asset reference",()=>{
    expect(()=>bindAssignedTemplates(site,registry,[{
      ...project,fields:{...project.fields,cover:{kind:"asset",key:"https://host.example/media.webp"}}
    }],definitions)).toThrow(/Invalid value/);
    expect(()=>bindAssignedTemplates(site,registry,[{
      ...project,fields:{...project.fields,cover:{kind:"asset",key:"javascript:alert(1)"}}
    }],definitions)).toThrow(/Invalid value/);
  });
});
