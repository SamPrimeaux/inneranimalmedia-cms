import type { SectionInstance } from "@inneranimalmedia/site-contracts";
import { escapeHtml, type RenderContext } from "../context.js";
import { registerSection } from "../registry.js";

export interface StatementData {
  eyebrow?: string;
  heading: string;
  body?: string;
}

export function renderStatement(
  instance: SectionInstance,
  _context: RenderContext,
): string {
  const data = instance.data as unknown as StatementData;
  if (!data.heading) throw new Error("statement.heading is required");

  return [
    '<div class="iam-statement">',
    data.eyebrow
      ? '<p class="iam-statement__eyebrow">' + escapeHtml(data.eyebrow) + "</p>"
      : "",
    '<h2 class="iam-statement__heading">' + escapeHtml(data.heading) + "</h2>",
    data.body
      ? '<p class="iam-statement__body">' + escapeHtml(data.body) + "</p>"
      : "",
    "</div>",
  ].join("");
}

registerSection("statement", renderStatement);
