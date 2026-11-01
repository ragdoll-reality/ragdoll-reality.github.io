// Ad placements are injected into already-rendered fixed skin HTML.
// This does not change approved game copy, headings, links or URL structure.
const banner = '<div class="adsterra-placement adsterra-banner-placement" data-adsterra-banner-slot aria-label="Advertisement"><span class="adsterra-label">Advertisement</span><div data-adsterra-banner-mount></div></div>';
const native = '<div class="adsterra-placement adsterra-native-placement" data-adsterra-native-slot aria-label="Sponsored advertising"><span class="adsterra-label">Advertisement · Sponsored</span></div>';

function insertAfter(source: string, at: number, markup: string): string {
  if (at < 0) throw new Error("Fixed site ad placement anchor not found");
  return source.slice(0, at) + markup + source.slice(at);
}

export function withAdsterraPlacements(rendered: string, page: "home" | "inner"): string {
  if (page === "home") {
    const hero = rendered.indexOf('<section class="panel hero">');
    const guide = rendered.indexOf('<section class="panel" style="margin-top:18px" id="section">');
    if (hero < 0 || guide < hero) throw new Error("Fixed homepage hero or guide directory missing");
    const heroEnd = rendered.indexOf("</section>", hero);
    const guideEnd = rendered.indexOf("</section>", guide);
    if (heroEnd < hero || guideEnd < guide || heroEnd > guide) throw new Error("Fixed homepage ad position invalid");
    const afterNative = insertAfter(rendered, guideEnd + "</section>".length, native);
    return insertAfter(afterNative, heroEnd + "</section>".length, banner);
  }
  const lead = rendered.indexOf('<p class="fixed-rich-intro">');
  const firstSection = rendered.indexOf('<section class="fixed-rich-section"', lead);
  if (lead < 0 || firstSection < lead) throw new Error("Fixed guide introduction or first section missing");
  const leadEnd = rendered.indexOf("</p>", lead);
  const sectionEnd = rendered.indexOf("</section>", firstSection);
  if (leadEnd < lead || sectionEnd < firstSection || leadEnd > firstSection) throw new Error("Fixed guide ad position invalid");
  const afterNative = insertAfter(rendered, sectionEnd + "</section>".length, native);
  return insertAfter(afterNative, leadEnd + "</p>".length, banner);
}
