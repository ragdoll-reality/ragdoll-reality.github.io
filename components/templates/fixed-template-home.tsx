import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument, renderFixedSections } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function supplement(home: HomePageDefinition): string {
  const gameUrl=siteConfig.game.officialUrl;
  const external=gameUrl&&gameUrl.startsWith("https://www.roblox.com/games/")?'<p class="fixed-official"><a href="'+esc(gameUrl)+'" rel="noopener noreferrer">Play Ragdoll Reality on Roblox</a> · Independent fan-made guide; not affiliated with the developer or Roblox.</p>':"";
  const sources=gameUrl?'<p class="fixed-sources">Source: <a href="'+esc(gameUrl)+'" rel="noopener noreferrer">official developer description</a>.</p>':"";
  const faq=home.faq.length
    ? '<section id="faq" class="fixed-rich-section"><h2>Frequently Asked Questions</h2>'+home.faq.map(item=>'<div class="fixed-rich-sub"><h3>'+esc(item.question)+'</h3><p>'+esc(item.answer)+'</p></div>').join("")+'</section>'
    : "";
  return '<div class="fixed-rich">'+external+renderFixedSections(home.sections)+faq+sources+'</div>';
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = links.slice(0, 6).map((link) => ({
    href: routePath(link.slug),
    title: link.label,
    text: link.label,
  }));
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    supplementHtml: supplement(home),
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}
