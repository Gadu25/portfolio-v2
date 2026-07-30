# Monochrome Swiss Modernist Redesign

## Overview
Refine the portfolio's visual identity toward a Swiss/Modernist aesthetic with a monochrome (grayscale) palette, Space Grotesk typography, and a clean, typography-driven hierarchy. No accent colors — emphasis comes entirely from weight, size, spacing, and layout.

## Typography

**Font:** Space Grotesk (Google Fonts), weights 300, 400, 500, 600, 700

### Type Scale
| Level | Size | Weight | Tracking | Usage |
|-------|------|--------|----------|-------|
| h1 | 5rem (80px) | 600 | -0.03em | Hero name |
| h2 | 2.5rem (40px) | 600 | -0.02em | Section headings |
| h3 | 1.75rem (28px) | 500 | -0.01em | Subsection headings |
| h4 | 1.125rem (18px) | 500 | 0.05em (small caps) | Card titles, nav |
| Body | 1rem (16px) | 400 | normal | Paragraphs |
| Meta/small | 0.875rem (14px) | 400 | normal | Tags, dates, secondary info |

### Hero-specific
- **Name** (.hero__name): 5rem, weight 600, letter-spacing -0.03em
- **Title** (.hero__title): 1.5rem, weight 400, color var(--secondary-text-color)
- **Tagline** (.hero__tagline): 1rem, weight 300, color var(--secondary-text-color)

## Color Palette

### Light Mode
| Role | Hex | CSS Variable |
|------|-----|-------------|
| Background | #FFFFFF | --background-color |
| Surface | #F8F9FA | --surface-color |
| Primary text | #1A1A1A | --text-color |
| Secondary text | #6B7280 | --secondary-text-color |
| Border | #E5E7EB | --border-color |
| Selection | #D1D5DB | (used in ::selection) |

### Dark Mode
| Role | Hex | CSS Variable |
|------|-----|-------------|
| Background | #0A0A0A | --background-color |
| Surface | #1A1A1A | --surface-color |
| Primary text | #F9FAFB | --text-color |
| Secondary text | #9CA3AF | --secondary-text-color |
| Border | #2D2D2D | --border-color |
| Selection | #4B5563 | (used in ::selection) |

### Removed
- `--primary-color` — no accent color
- `--special-color`, `--special-color-60`, `--special-color-50`, `--special-color-hover` — removed entirely
- `--glowing-card` — removed (cards use border-only hover)
- `--card-color` — surfaces use --surface-color directly
- `--card-border` — cards use --border-color

## Component Changes

### Navigation
- Existing glassmorphism blur retained but in monochrome
- Active link indicator: thin 2px underline in --text-color (instead of accent color)
- Nav links: h4 style (small caps, tight tracking)
- No accent-colored elements

### Hero Section
- Remove `<Particles />` component entirely
- Text hierarchy as specified above
- No avatar image (already commented out)

### CTA Button (Resume download)
- Outline style: 1px solid --text-color, transparent fill
- Hover: filled --text-color background, --background-color text
- No accent color, no glow, no gradient
- Same treatment in dark mode (inverted)

### Cards
- Remove `--glowing-card` box-shadow
- Hover: subtle border-color transition only (no shadow lift)
- Keep existing card background using --surface-color

### Selection
- Light mode: background #D1D5DB, text inherit
- Dark mode: background #4B5563, text inherit

### Theme Toggle
- Keep functionality but in grayscale
- Icon-only toggle, no colored indicators

## Files to Modify
- `nuxt.config.ts` — update Google Fonts URL to Space Grotesk
- `assets/css/base/_typography.scss` — update font-family, type scale weights/sizes
- `assets/css/themes/_colors.scss` — full palette rewrite to monochrome
- `assets/css/layout/_hero.scss` — remove particles ref, update title/tagline sizing
- `assets/css/components/_specialButton.scss` — rewrite to outline style
- `assets/css/components/_tooltip.scss` — ensure monochrome
- `assets/css/components/_swiping-card.scss` — remove accent color refs
- `assets/css/layout/_navigation.scss` — remove accent color refs
- `assets/css/layout/_projects.scss` — remove accent color refs
- `assets/css/layout/_footer.scss` — verify monochrome
- `assets/css/layout/_detail-page.scss` — check for accent color refs
- `assets/css/components/_confirm-dialog.scss` — monochrome pass
- `assets/css/components/_regular-cards.scss` — remove accent color refs
- `components/sections/HeroSection.vue` — remove `<Particles />` import and usage

## Scope
- No restructuring of page layouts
- No changes to page content or component architecture
- Purely visual/design layer changes
