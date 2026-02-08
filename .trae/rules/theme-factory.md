---
name: theme-factory
description: Apply a cohesive theme (colors + fonts) to slides, docs, or web UI. Invoke when a user asks to style/beautify an artifact or wants consistent branding.
---


# Theme Factory

This skill provides a curated collection of professional color palettes and font pairings. Once a theme is chosen, apply it consistently across an artifact (slides, docs, HTML pages, dashboards, reports).

## Assets In This Workspace

- Theme showcase (visual overview): `/Users/bartoszkrynski/Downloads/Development/make-the-change/.trae/rules/theme/theme-showcase.pdf`
- Theme definitions (10 preset themes): `/Users/bartoszkrynski/Downloads/Development/make-the-change/.trae/rules/theme/*.md`

## Workflow

1. **Show the theme showcase**: Display `theme-showcase.pdf` so the user can pick visually. Do not modify the PDF.
2. **Ask for their choice**: Ask which theme name to apply.
3. **Wait for selection**: Get explicit confirmation about the chosen theme.
4. **Apply the theme**: Use the selected theme’s colors and fonts consistently across the artifact.

## Themes Available

The following 10 themes are available, each showcased in `theme-showcase.pdf`:

1. **Ocean Depths** - Professional and calming maritime theme
2. **Sunset Boulevard** - Warm and vibrant sunset colors
3. **Forest Canopy** - Natural and grounded earth tones
4. **Modern Minimalist** - Clean and contemporary grayscale
5. **Golden Hour** - Rich and warm autumnal palette
6. **Arctic Frost** - Cool and crisp winter-inspired theme
7. **Desert Rose** - Soft and sophisticated dusty tones
8. **Tech Innovation** - Bold and modern tech aesthetic
9. **Botanical Garden** - Fresh and organic garden colors
10. **Midnight Galaxy** - Dramatic and cosmic deep tones

## Applying a Theme (Practical Mapping)

### Color Roles (Use These Semantics)

Interpret the palette into roles (even if the theme file uses descriptive names):

- **Background**: the darkest or most neutral base color
- **Surface**: a lighter background for cards/boxes/sections (or use the lightest neutral)
- **Text**: highest-contrast color against Background/Surface (often the lightest neutral on dark themes, or the darkest neutral on light themes)
- **Primary/Accent**: the most saturated color for CTAs, highlights, key data series
- **Secondary Accent**: a softer accent for secondary emphasis, badges, subtle highlights
- **Borders/Dividers**: usually a mid neutral derived from the palette (or reuse the medium color sparingly)

### Slides / Docs

- **Headings**: header font + Primary/Accent color (or Text color if accent reduces readability)
- **Body**: body font + Text color
- **Backgrounds**: Background + Surface blocks (avoid mixing multiple saturated colors as backgrounds)
- **Charts**: reserve Accent/Secondary Accent for series; keep gridlines/dividers neutral

### Web UI (CSS Variables Pattern)

If you’re styling HTML/React, express the theme in CSS variables, then reference variables everywhere.

```css
:root {
  --theme-bg: #1a2332;
  --theme-surface: #f1faee;
  --theme-text: #1a2332;
  --theme-primary: #2d8b8b;
  --theme-accent: #a8dadc;
}
```

## Custom Theme Creation

If none of the presets work, generate a custom theme:

1. Pick a descriptive theme name (same style as existing themes).
2. Produce a palette of **4–6** hex colors including at minimum: **Background**, **Text**, and **one Accent**.
3. Choose a header/body font pairing (use a realistic fallback strategy if the exact fonts aren’t available).
4. Show the theme spec for review, then apply it.

Use this template (same structure as the existing theme files):

```md
# Theme Name

One sentence describing the vibe and intent.

## Color Palette

- **Color Name**: `#000000` - intended role (background/text/accent/etc.)

## Typography

- **Headers**: Font Name Bold
- **Body Text**: Font Name

## Best Used For

Short list of contexts where this theme shines.
```

## Guardrails

- Prefer consistency over variety: 1 background, 1 surface, 1 text, 1–2 accents usually suffice.
- Prioritize readability: never use low-contrast text for body content; keep accents for emphasis.
- Avoid inventing extra colors unless creating a custom theme; use the theme file as the source of truth.
