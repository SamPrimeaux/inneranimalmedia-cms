import test from "node:test";
import assert from "node:assert/strict";
import {
  renderSpecimenCards,renderSpecimenLinks,renderBrandSystemPresentation,
  MEAUX_ORIGINAL_DESIGN,MEAUX_ENHANCED_DESIGN,MEAUX_SOURCE_SPECIMENS
} from "../dist/specimens.js";

test("library candidates have stable distinct identities and are not promoted stock",()=>{
  assert.equal(new Set(MEAUX_SOURCE_SPECIMENS.map(x=>x.id)).size,MEAUX_SOURCE_SPECIMENS.length);
  assert.ok(MEAUX_SOURCE_SPECIMENS.every(x=>x.status==="candidate"));
});
test("card renders real content, hover hooks and visible links",()=>{
  const html=renderSpecimenCards({title:"Real partners",entrance:true,
    cards:[{id:"p1",title:"Meaux & Friends",description:"Real <strong>content",href:"/partners",tone:"#1f97a9"}]});
  assert.match(html,/data-meaux-reveal/);
  assert.match(html,/href="\/partners"/);
  assert.match(html,/Meaux &amp; Friends/);
  assert.match(html,/Real &lt;strong&gt;content/);
});
test("fonts/radii/colors are completely merchant-editable (not theme enum)",()=>{
  const html=renderSpecimenCards({tokens:{fontFamily:"Montserrat, sans-serif",
    headingFontFamily:"Georgia, serif",radius:"57px",buttonRadius:"3rem",accent:"#123456"},
    cards:[{id:"one",title:"Card"}]});
  assert.match(html,/--iam-sp-font:Montserrat, sans-serif/);
  assert.match(html,/--iam-sp-radius:57px/);
  assert.match(html,/--iam-sp-accent:#123456/);
});
test("rejects dangerous URL and CSS/attribute injection",()=>{
  assert.throws(()=>renderSpecimenCards({cards:[{id:"p1",title:"bad",href:"javascript:alert(1)"}]}),/Only HTTPS/);
  assert.throws(()=>renderSpecimenCards({tokens:{fontFamily:'Inter";background:red'},cards:[]}),/Unsafe design-token value/);
  assert.throws(()=>renderSpecimenCards({tokens:{radius:"20px;opacity:0"},cards:[]}),/Unsafe design-token value/);
  assert.throws(()=>renderSpecimenCards({cards:[{id:"1 invalid",title:"title"}]}),/Invalid specimen id/);
});
test("links are accessible real anchors; no imitation handler",()=>{
  const html=renderSpecimenLinks({title:"Help",accentTitle:"Connect",links:[{id:"apply",label:"Contact",href:"mailto:hello@example.org"}]});
  assert.match(html,/href="mailto:hello@example.org"/);
  assert.doesNotMatch(html,/onclick=/i);
});
test("two brand presentation starting points, each fully overridable",()=>{
  assert.equal(MEAUX_ORIGINAL_DESIGN.accent,"#1F97A9");
  assert.equal(MEAUX_ENHANCED_DESIGN.background,"#051b1e");
  const html=renderBrandSystemPresentation({id:"test-brand",name:"Other Brand",variant:"enhanced",tokens:{
    radius:"0px",headingFontFamily:"Times New Roman, serif",accent:"#abc123",
  },palette:{Main:"#ff00cc"}});
  assert.match(html,/Other Brand/);
  assert.match(html,/--iam-sp-radius:0px/);
  assert.match(html,/--iam-sp-accent:#abc123/);
  assert.match(html,/#ff00cc/);
  assert.doesNotMatch(html,/Meauxbility/);
});
