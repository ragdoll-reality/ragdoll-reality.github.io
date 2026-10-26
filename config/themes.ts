import type { ThemeConfig, ThemePresetName } from "./types";

export const themes: Record<string, ThemeConfig> = {
  "obsidian-red": {
    name: "obsidian-red" as ThemePresetName,
    label: "Site Theme",
    description: "Selected site theme",
    tokens: {
  "background": "220 16% 96%",
  "foreground": "0 0% 7%",
  "card": "220 6% 100%",
  "card-foreground": "0 0% 7%",
  "primary": "217 91% 60%",
  "primary-foreground": "0 0% 0%",
  "secondary": "220 16% 89%",
  "muted": "220 16% 91%",
  "muted-foreground": "0 0% 7%",
  "border": "220 16% 80%",
  "radius": ".35rem",
  "card-shadow": "0 8px 18px rgba(15, 23, 42, .06)",
  "hero-gradient": "linear-gradient(180deg, hsl(217 91% 60% / .08), transparent 70%)",
  "background-pattern": "none",
  "font-sans": "\"Source Sans 3\", ui-sans-serif, system-ui, sans-serif",
  "font-heading": "\"Source Sans 3\", ui-sans-serif, system-ui, sans-serif",
  "heading-weight": "700",
  "heading-letter-spacing": "-0.02em"
},
  },
};
