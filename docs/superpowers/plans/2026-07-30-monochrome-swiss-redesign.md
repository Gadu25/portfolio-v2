# Monochrome Swiss Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign portfolio to a Swiss/Modernist monochrome aesthetic with Space Grotesk typography

**Architecture:** Pure CSS/Sass redesign — no component restructuring. Update Google Fonts URL, rewrite color palette to grayscale, replace accent colors with text-weight/border hierarchy across all components.

**Tech Stack:** Nuxt 3, Vue 3, Sass, CSS custom properties

## Global Constraints

- All `--special-color` references replaced with `--text-color` or `--secondary-text-color`
- All `--card-color` references replaced with `--surface-color`
- All `--card-border` references replaced with `--border-color`
- `--glowing-card`, `--primary-color` removed entirely
- Custom cursor effect removed entirely
- Particle background removed from hero
- Only grayscale colors: #FFFFFF, #F8F9FA, #F9FAFB, #1A1A1A, #0A0A0A, #6B7280, #9CA3AF, #E5E7EB, #2D2D2D, #D1D5DB, #4B5563

---

### Task 1: Global Color Palette

**Files:**
- Modify: `assets/css/themes/_colors.scss`

**Interfaces:**
- Consumes: existing CSS variables
- Produces: new monochrome CSS variables used by all other components

- [ ] **Step 1: Rewrite `_colors.scss` to monochrome palette**

Replace entire file content:

```scss
// Light theme
:root {
  --background-color: #ffffff;
  --surface-color: #f8f9fa;
  --text-color: #1a1a1a;
  --secondary-text-color: #6b7280;
  --border-color: #e5e7eb;
  --nav-bg: rgba(255, 255, 255, 0.8);
  --nav-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

// Dark theme
[data-theme='dark'] {
  --background-color: #0a0a0a;
  --surface-color: #1a1a1a;
  --text-color: #f9fafb;
  --secondary-text-color: #9ca3af;
  --border-color: #2d2d2d;
  --nav-bg: rgba(10, 10, 10, 0.85);
  --nav-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
```

- [ ] **Step 2: Verify no stale variable references remain**

Run: `rg --special-color\|--primary-color\|--glowing-card\|--card-color\|--card-border assets/css/`
Expected: No matches (these variables no longer exist)

- [ ] **Step 3: Commit**

```bash
git add assets/css/themes/_colors.scss
git commit -m "feat: monochrome color palette"
```

---

### Task 2: Typography — Space Grotesk + Type Scale

**Files:**
- Modify: `nuxt.config.ts:27-30`
- Modify: `assets/css/base/_typography.scss`

- [ ] **Step 1: Update Google Fonts URL in `nuxt.config.ts`**

Replace the Inter font link with Space Grotesk:

```ts
{
  rel: 'stylesheet',
  href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
},
```

- [ ] **Step 2: Update `_typography.scss` — font family and type scale**

Edit line 1:
```scss
$font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Update h1 style (lines 41-46):
```scss
h1 {
  font-size: $font-size-4xl;
  font-weight: $font-weight-semibold;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
```

Update h2 (lines 48-52):
```scss
h2 {
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  letter-spacing: -0.02em;
}
```

Update h3 (lines 54-58):
```scss
h3 {
  font-size: $font-size-xl;
  font-weight: $font-weight-medium;
  letter-spacing: -0.01em;
}
```

Update h4 (lines 60-63):
```scss
h4 {
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

Remove `.item-count` special color reference (line 74-77):
```scss
.item-count {
  color: var(--secondary-text-color);
  font-weight: $font-weight-normal;
}
```

- [ ] **Step 3: Commit**

```bash
git add nuxt.config.ts assets/css/base/_typography.scss
git commit -m "feat: Space Grotesk font and Swiss type scale"
```

---

### Task 3: Hero Section — Remove Particles + Refine Hierarchy

**Files:**
- Modify: `components/sections/HeroSection.vue`
- Modify: `assets/css/layout/_hero.scss`

- [ ] **Step 1: Remove Particles from `HeroSection.vue`**

Remove the `<Particles />` line (line 3), the import (line 44):
```vue
// Remove line 3:     <Particles />
// Remove line 44: import Particles from '~/components/Particles.vue'
```

- [ ] **Step 2: Update hero styles in `_hero.scss`**

Replace hero name/title/tagline styles:

```scss
&__name {
  margin-top: $space-md;
  color: var(--text-color);
}

&__title {
  display: block;
  font-size: $font-size-2xl;
  font-weight: $font-weight-normal;
  color: var(--secondary-text-color);
  letter-spacing: -0.01em;
  margin-bottom: $space-lg;
}

&__tagline {
  font-size: $font-size-base;
  font-weight: $font-weight-light;
  color: var(--secondary-text-color);
  margin: $space-md 0;
  line-height: 1.6;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/HeroSection.vue assets/css/layout/_hero.scss
git commit -m "feat: monochrome hero with refined hierarchy"
```

---

### Task 4: Navigation — Remove Accent Colors

**Files:**
- Modify: `assets/css/layout/_navigation.scss`

- [ ] **Step 1: Replace accent color refs in nav**

Line 59: `background: var(--special-color);` → `background: var(--text-color);`

Line 66: `color: var(--special-color);` → `color: var(--text-color);`

Line 173: `color: var(--special-color) !important;` → `color: var(--text-color) !important;`

- [ ] **Step 2: Commit**

```bash
git add assets/css/layout/_navigation.scss
git commit -m "fix: monochrome navigation"
```

---

### Task 5: CTA Button — Outline Style

**Files:**
- Modify: `assets/css/components/_specialButton.scss`

- [ ] **Step 1: Rewrite button to outline style**

```scss
$width: 170px;
$height: 44px;

.button-container {
  height: $height;
  width: $width;
  border-radius: $radius-full;
  border: 1.5px solid var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: transparent;
  transition: all $transition-base;
  cursor: pointer;
  font-weight: $font-weight-medium;
  letter-spacing: 0.02em;

  p {
    color: var(--text-color);
    margin: 0;
    transition: color $transition-base;
  }

  &:hover {
    background-color: var(--text-color);

    p {
      color: var(--background-color);
    }
  }

  &:active {
    transform: translateY(0);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/components/_specialButton.scss
git commit -m "feat: monochrome outline button"
```

---

### Task 6: Theme Toggle — Monochrome

**Files:**
- Modify: `assets/css/components/_themeToggle.scss`

- [ ] **Step 1: Replace accent colors in theme toggle**

Line 9: `outline: 2px solid var(--special-color);` → `outline: 2px solid var(--text-color);`

Line 18: `background-color: var(--card-color);` → `background-color: var(--surface-color);`

Line 32: `background-color: var(--special-color);` → `background-color: var(--text-color);`

Line 44: `background-color: var(--card-color);` → `background-color: var(--surface-color);`

- [ ] **Step 2: Commit**

```bash
git add assets/css/components/_themeToggle.scss
git commit -m "fix: monochrome theme toggle"
```

---

### Task 7: Custom Cursor — Remove

**Files:**
- Modify: `assets/css/components/_cursor.scss`
- Note: Also check for cursor component import/usage in the Vue app

- [ ] **Step 1: Clear `_cursor.scss`**

Replace entire file content with empty placeholder:

```scss
// Cursor removed — monochrome Swiss design
```

- [ ] **Step 2: Check if cursor component is imported in any .vue file**

Run: `rg -l "cursor" components/ pages/ --include "*.vue"`
If `<Cursor />` or similar is found, remove the import and template usage.

- [ ] **Step 3: Commit**

```bash
git add assets/css/components/_cursor.scss
git commit -m "feat: remove custom cursor"
```

---

### Task 8: Confirm Dialog — Monochrome

**Files:**
- Modify: `assets/css/components/_confirm-dialog.scss`

- [ ] **Step 1: Replace accent colors in confirm dialog**

Line 28: `background-color: var(--card-color);` → `background-color: var(--surface-color);`

Line 35: `color: var(--special-color);` → `color: var(--text-color);`

Line 62: `background-color: var(--card-color);` → `background-color: var(--surface-color);`

Line 71: `background-color: var(--special-color);` → `background-color: var(--text-color);`

- [ ] **Step 2: Commit**

```bash
git add assets/css/components/_confirm-dialog.scss
git commit -m "fix: monochrome confirm dialog"
```

---

### Task 9: Cards — Remove Accent Colors

**Files:**
- Modify: `assets/css/components/_regular-cards.scss`
- Modify: `assets/css/components/_swiping-card.scss`
- Modify: `assets/css/layout/_projects.scss`

- [ ] **Step 1: Update `_regular-cards.scss`**

Line 22: `background-color: var(--card-color);` → `background-color: var(--surface-color);`
Line 27: `background-color: var(--card-color);` → `background-color: var(--surface-color);`
Line 29: `border: 1px solid var(--card-border);` → `border: 1px solid var(--border-color);`
Line 82: `background: var(--card-color);` → `background: var(--surface-color);`
Line 86: `border-color: var(--special-color);` → `border-color: var(--text-color);`
Line 93: `color: var(--special-color);` → `color: var(--text-color);`

- [ ] **Step 2: Update `_swiping-card.scss`**

Line 32: `background-color: var(--card-color);` → `background-color: var(--surface-color);`
Line 40: `background-color: var(--special-color);` → `background-color: var(--text-color);`
Line 42: `border-color: var(--special-color);` → `border-color: var(--text-color);`
Line 69: `border: 1px solid var(--card-border);` → `border: 1px solid var(--border-color);`
Line 88: `background: var(--card-color);` → `background: var(--surface-color);`
Line 92: `border-color: var(--special-color);` → `border-color: var(--text-color);`
Line 129: `color: var(--special-color);` → `color: var(--text-color);`

- [ ] **Step 3: Update `_projects.scss`**

Line 24: `background-color: var(--card-color);` → `background-color: var(--surface-color);`
Line 27: `color: var(--special-color);` → `color: var(--text-color);`
Line 36: `background-color: var(--card-color);` → `background-color: var(--surface-color);`
Line 53: `background-color: var(--card-color);` → `background-color: var(--surface-color);`
Line 85: `background: var(--card-color);` → `background: var(--surface-color);`
Line 116: `background-color: var(--card-color);` → `background-color: var(--surface-color);`
Line 121: `border-color: var(--special-color);` → `border-color: var(--text-color);`
Line 122: `color: var(--special-color);` → `color: var(--text-color);`
Line 127: `background-color: var(--special-color);` → `background-color: var(--text-color);`
Line 129: `border: 1px solid var(--special-color);` → `border: 1px solid var(--text-color);`

- [ ] **Step 4: Commit**

```bash
git add assets/css/components/_regular-cards.scss assets/css/components/_swiping-card.scss assets/css/layout/_projects.scss
git commit -m "fix: monochrome cards and project list"
```

---

### Task 10: Detail Pages — Monochrome

**Files:**
- Modify: `assets/css/layout/_detail-page.scss`

- [ ] **Step 1: Replace all accent color references**

All `var(--special-color)` → `var(--text-color)` in this file.
All `var(--card-color)` → `var(--surface-color)` in this file.

Replacements needed at lines: 20, 33, 56, 88, 89, 127, 135, 156, 163, 175, 219, 226, 250, 305, 312, 350, 374, 392, 400, 401, 485, 499, 503, 518, 555, 562, 571.

- [ ] **Step 2: Commit**

```bash
git add assets/css/layout/_detail-page.scss
git commit -m "fix: monochrome detail pages"
```

---

### Task 11: Remaining Layout Components — Monochrome

**Files:**
- Modify: `assets/css/layout/_aboutme.scss`
- Modify: `assets/css/layout/_workexp.scss`
- Modify: `assets/css/layout/_techstacks.scss`
- Modify: `assets/css/layout/_footer.scss`
- Modify: `assets/css/layout/_error.scss`
- Modify: `assets/css/layout/_certifications.scss`
- Modify: `assets/css/components/_tooltip.scss`

- [ ] **Step 1: Update `_aboutme.scss`**

Line 9: `color: var(--special-color);` → `color: var(--text-color);`
Line 101: remove `box-shadow: var(--glowing-card);` entirely

- [ ] **Step 2: Update `_workexp.scss`**

Line 6: `color: var(--special-color);` → `color: var(--text-color);`

- [ ] **Step 3: Update `_techstacks.scss`**

Line 6: `color: var(--special-color);` → `color: var(--text-color);`
Line 59: `color: var(--special-color);` → `color: var(--text-color);`
Line 82: `background: var(--card-color);` → `background: var(--surface-color);`
Line 84: `border: 1px solid var(--card-border);` → `border: 1px solid var(--border-color);`
Line 99: `border-color: var(--special-color);` → `border-color: var(--text-color);`

- [ ] **Step 4: Update `_footer.scss`**

Line 4: `background: linear-gradient(to top, var(--card-color), transparent);` → `background: linear-gradient(to top, var(--surface-color), transparent);`
Line 22: `color: var(--special-color);` → `color: var(--text-color);`

- [ ] **Step 5: Update `_error.scss`**

Line 11: `color: var(--special-color);` → `color: var(--text-color);`

- [ ] **Step 6: Update `_certifications.scss`**

Line 14: `border: 1px solid var(--card-border);` → `border: 1px solid var(--border-color);`

- [ ] **Step 7: Update `_tooltip.scss`**

Line 9: `background-color: var(--card-color);` → `background-color: var(--surface-color);`

- [ ] **Step 8: Commit**

```bash
git add assets/css/layout/_aboutme.scss assets/css/layout/_workexp.scss assets/css/layout/_techstacks.scss assets/css/layout/_footer.scss assets/css/layout/_error.scss assets/css/layout/_certifications.scss assets/css/components/_tooltip.scss
git commit -m "fix: monochrome remaining layout components"
```

---

### Task 12: Loading Spinner — Monochrome

**Files:**
- Modify: `assets/css/abstracts/_loading.scss`

- [ ] **Step 1: Replace accent colors**

Line 11: `border: 3px solid var(--card-color);` → `border: 3px solid var(--border-color);`
Line 12: `border-top-color: var(--special-color);` → `border-top-color: var(--text-color);`

- [ ] **Step 2: Commit**

```bash
git add assets/css/abstracts/_loading.scss
git commit -m "fix: monochrome loading spinner"
```

---

### Task 13: Global Selection Color

**Files:**
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Update `::selection` in `main.scss`**

Line 47: `background-color: var(--special-color);` → `background-color: #d1d5db;`
Line 48: `color: var(--surface-color);` → `color: var(--text-color);`

For dark mode, add a selection rule:
```scss
[data-theme='dark'] ::selection {
  background-color: #4b5563;
  color: var(--text-color);
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/main.scss
git commit -m "fix: monochrome selection highlight"
```

---

### Task 14: Final Verification

- [ ] **Step 1: Verify no remaining accent color references**

Run: `rg "special-color|primary-color|glowing-card|card-color|card-border" assets/css/`
Expected output: Empty (no matches)

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build` or `npx nuxt build`
Expected: Build completes with no errors

- [ ] **Step 3: Verify all modified files compile**

Run: `npx nuxt dev`
Expected: Dev server starts successfully
