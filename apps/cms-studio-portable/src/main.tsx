import React from "react";
import {createRoot} from "react-dom/client";
import Studio from "./Studio";
import {fixtures} from "./fixtures";
import {MountedSection,SitePreview} from "../../../packages/studio-sections/src/MountedSection";
import {previewFixture} from "../../../packages/studio-sections/src/preview-fixture";
import "./base.css";
const params=new URLSearchParams(location.search);
const site=fixtures.find(f=>f.id===params.get("fixture"))||fixtures[0];
const preset=params.get("preset");
const section=preset?previewFixture(preset,site):null;
if(section&&params.has("empty")){section.data={};section.blocks=[];}
createRoot(document.getElementById("root")!).render(preset&&section?<MountedSection section={section} site={site} resolveMedia={()=>null} />:params.has("page")?<SitePreview document={site} pageId={site.pages[0].id} resolveMedia={()=>null} />:<Studio initialTab={params.has("gallery")?"library":"page"} />);
