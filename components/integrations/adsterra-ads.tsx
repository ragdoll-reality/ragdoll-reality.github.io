"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ADSTERRA } from "@/config/adsterra";

type BannerCode = typeof ADSTERRA.desktop | typeof ADSTERRA.mobile;

// Banner scripts may use document.write. Execute the unchanged provider setup
// inside an isolated iframe so a late document.write cannot erase our webpage.
// The iframe uses srcdoc, inherits the site's referrer and does not proxy a
// provider URL. Its sandbox limits navigation/access to the parent document.
function makeBannerFrame(code: BannerCode, device: "desktop" | "mobile"): HTMLIFrameElement {
  const frame = document.createElement("iframe");
  frame.dataset.adsterraBannerFrame = device;
  frame.title = "Advertisement";
  frame.width = String(code.width);
  frame.height = String(code.height);
  frame.style.display = "block";
  frame.style.border = "0";
  frame.style.maxWidth = "100%";
  frame.style.margin = "0 auto";
  frame.setAttribute("scrolling", "no");
  frame.setAttribute("sandbox", "allow-scripts allow-popups allow-popups-to-escape-sandbox");
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="strict-origin-when-cross-origin"><style>html,body{margin:0;padding:0;overflow:hidden}</style></head><body>' +
    '<script>atOptions = ' + JSON.stringify({ key: code.key, format: code.format, height: code.height, width: code.width, params: code.params }) + ';<' + '/script>' +
    '<script src="' + code.src + '"><' + '/script></body></html>';
  return frame;
}

function mountBanner() {
  const slot = document.querySelector<HTMLElement>("[data-adsterra-banner-slot]");
  const host = slot?.querySelector<HTMLElement>("[data-adsterra-banner-mount]");
  if (!host) return;
  const device = window.innerWidth < 768 ? "mobile" : "desktop";
  const existing = host.querySelector<HTMLIFrameElement>("iframe[data-adsterra-banner-frame]");
  if (existing?.dataset.adsterraBannerFrame === device) return;
  // A resize across 768px replaces the old iframe before loading the other
  // script: never keep both providers alive simultaneously.
  host.replaceChildren(makeBannerFrame(ADSTERRA[device], device));
}

function mountNative() {
  const slot = document.querySelector<HTMLElement>("[data-adsterra-native-slot]");
  if (!slot || slot.dataset.adsterraInitialized === "true") return;
  const container = document.createElement("div");
  container.id = ADSTERRA.native.containerId;
  container.dataset.adsterraNativeContainer = "true";
  slot.appendChild(container); // must exist before the async provider script runs
  const script = document.createElement("script");
  script.src = ADSTERRA.native.src;
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.dataset.adsterraNativeScript = "true";
  slot.appendChild(script);
  slot.dataset.adsterraInitialized = "true";
  // Do not remove provider nodes on timeout or no-fill.
}

function mountSocialOnce() {
  if (document.querySelector('script[data-adsterra-social-script="true"]')) return;
  const script = document.createElement("script");
  script.src = ADSTERRA.social.src;
  script.setAttribute("data-cfasync", "false");
  script.dataset.adsterraSocialScript = "true";
  document.body.appendChild(script); // once per browser document, not every route
}

export function AdsterraAds() {
  const pathname = usePathname();
  useEffect(() => {
    mountBanner();
    mountNative();
    mountSocialOnce();
    // Debounce layout events only; never retry or re-request on a timer.
    const onResize = () => mountBanner();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);
  return null;
}
