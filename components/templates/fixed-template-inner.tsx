import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { enabledLegalPages, getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument, renderFixedSections } from "@/lib/fixed-template/render";
import { pageSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function articleInner(page: SeoPageDefinition): string {
  const faq=page.faq?.length?'<section id="faq" class="fixed-rich-section"><h2>Frequently Asked Questions</h2>'+page.faq.map(x=>'<div class="fixed-rich-sub"><h3>'+esc(x.question)+'</h3><p>'+esc(x.answer)+'</p></div>').join("")+'</section>':"";
  const related=getRelatedPages(page);
  const links=related.length?'<nav class="fixed-related" aria-label="More Ragdoll Reality guides">'+related.map(x=>'<a href="'+esc(routePath(x.slug))+'"><strong>'+esc(x.navLabel)+'</strong></a>').join("")+'</nav>':"";
  const gameUrl=siteConfig.game.officialUrl;
  const source='<aside class="fixed-sources"><strong>Original sources</strong><p>'+(gameUrl?'<a href="'+esc(gameUrl)+'" rel="noopener noreferrer">Official Ragdoll Reality game page</a>':"")+(page.slug==="events"?' · <a href="https://allthings.how/ragdoll-reality-events-schedule/" rel="noopener noreferrer">October 2026 event calendar (third-party)</a>':"")+'</p></aside>';
  return '<div class="fixed-rich"><p class="fixed-rich-intro">'+esc(page.hero.lead)+'</p>'+renderFixedSections(page.sections)+faq+links+source+'</div>';
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: skin === "arcade-play" ? assetPath("/") : "/",
    logoUrl: skin === "arcade-play" ? assetPath(siteConfig.assets.logo) : null,
    ...(skin === "arcade-play" ? { legalLinks: enabledLegalPages.map((item) => ({ slug: item.slug, label: item.navLabel, href: assetPath(routePath(item.slug)) })) } : {}),
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}
