# About Section Refinement & Index Page Restructure

## Overview

Refine the About section to use a single clean portrait instead of two overlapping images, fix bio typography to match the Swiss Modernist spec, and restructure the index page to replace the swiping cards with two new focused sections: Current Job and Recent Project. Both act as entry points to the dedicated `/work` and `/projects` pages.

## About Section Refinement

### Template (`components/sections/AboutSection.vue`)
- **Remove** the `day.webp` image wrapper — keep only `night.webp`
- **Remove** `@mousemove` and `@mouseleave` tilt handlers from the remaining wrapper — no 3D tilt
- **Remove** `hover-pointer` class from the remaining wrapper
- Keep `data-aos` attributes as-is (`fade-up` on text, `fade-left` on images)

### Styles (`assets/css/layout/_aboutme.scss`)
- **Remove** `.about:hover h3` color transition (lines 7-12)
- **Remove** `&:hover img:not(:hover)` grayscale interaction (lines 64-67)
- **Simplify `&__image-wrapper`**: remove `position: absolute`, remove both `nth-child()` blocks, remove z-index values
- **New image-wrapper styling**: centered via `display: flex; justify-content: center; align-items: center` on parent, `width: 260px`, `border-radius: $radius-md`, `box-shadow: $shadow-lg`, `overflow: hidden`
- **Add subtle hover**: `transform: scale(1.02)` with `transition: all $transition-medium cubic-bezier(0.4, 0, 0.2, 1)` on the wrapper
- **Bio text**: `font-size: 20px; font-weight: 200` → `font-size: 16px; font-weight: 400`. Remove the custom `font-size`/`font-weight` in `&__bio p` so it inherits the body style from the spec
- The `&__images` container keeps `height: 320px` and centering flexbox but lists a single image

## Index Page Restructure

### pages/index.vue
Replace the section list:

**Before:**
```
HeroSection
AboutSection
TechSection
WorkSection
```

**After:**
```
HeroSection
AboutSection
CurrentJobSection
RecentProjectSection
TechSection
```

Remove the `WorkSection` import. Add two new imports for `CurrentJobSection` and `RecentProjectSection`.

### CurrentJobSection (`components/sections/CurrentJobSection.vue`) — NEW

Fetches experiences via `useMegome().getExperiences()` wrapped in `useCachedAsyncData('experiences', ...)`, finds the entry with `isPresent: true`.

**Layout:** Two-column grid (`1fr 1fr`), logo on left, details on right. Single column on mobile (`<=1024px`).

**Content:**
- `h4` label (small caps h4 style): "Current Role"
- Company name as `h3`
- Role title as `p` body text
- Date range with stay duration as `small` meta text
- Brief description excerpt as `p` body text
- "View Full Experience →" as a `<NuxtLink>` to `/work`, styled as an inline text link (no button, no underline by default, underline on hover)

**Card frame:** `background: var(--surface-color)`, `border: 1px solid var(--border-color)`, `border-radius: $radius-md`, standard section padding

**Loading state:** Spinner consistent with other sections

**Fallback:** If no `isPresent` experience found, show the first experience in the array

**AOS:** `data-aos="fade-up"` on the section container

### RecentProjectSection (`components/sections/RecentProjectSection.vue`) — NEW

Fetches projects via `useMegome().getProjects()` wrapped in `useCachedAsyncData('projects', ...)`, sorts by `createdAt` descending, takes the first.

**Layout:** Two-column grid (`1fr 1fr`), reversed order — text on left, cover image on right (alternates visually with CurrentJobSection which has logo on left). Single column on mobile (`<=1024px`).

**Content:**
- `h4` label (small caps h4 style): "Recent Project"
- Project title as `h3`
- Tech chips: pill-shaped spans with `border: 1px solid var(--border-color)`, `border-radius: $radius-full`, `padding: $space-xs $space-sm`, `font-size: $font-size-2xs`. Rendered inline with flex wrap.
- Description excerpt as `p` body text (truncated to ~150 characters, or use `text-overflow: ellipsis` / clamp)
- "View All Projects →" as a `<NuxtLink>` to `/projects`, styled same as the Job section link

**Cover image:** `object-fit: cover`, `border-radius: $radius-md`, constrained width (matching the About image at ~260px), `box-shadow: $shadow-lg`

**Card frame:** Same treatment as CurrentJobSection — `surface-color`, `border`, `radius-md`

**Loading state:** Spinner consistent with other sections

**Fallback:** If no projects, show the first static project

**AOS:** `data-aos="fade-up"` on the section container

## Data Flow

Both new sections use `useCachedAsyncData` with keys that may already be cached by other sections:
- CurrentJobSection: key `'experiences'` — already used by `RegularWorkExp`
- RecentProjectSection: key `'projects'` — already used by `pages/projects/index.vue`

This means no duplicate API calls — they share the same Nuxt `useState` cache.

## Styling Conventions

- All new SCSS goes in new files: `assets/css/layout/_current-job.scss` and `assets/css/layout/_recent-project.scss`
- Import them in `assets/css/main.scss`
- Follow existing patterns: use `$variables` tokens, CSS custom properties for colors, max-width `$max-width`, responsive breakpoints `$bp-desktop`
- Section container pattern: `max-width: $max-width`, `margin: 0 auto`, `padding: 0 $space-lg`
- "View More" links use `text-decoration: none` default, `text-decoration: underline` on hover, secondary text color, with a `→` arrow suffix

## Files Changed

| File | Action |
|------|--------|
| `components/sections/AboutSection.vue` | Modify: remove 1 image, remove tilt handlers |
| `assets/css/layout/_aboutme.scss` | Modify: simplify images, fix bio, remove hover interactions |
| `components/sections/CurrentJobSection.vue` | Create: new section component |
| `components/sections/RecentProjectSection.vue` | Create: new section component |
| `assets/css/layout/_current-job.scss` | Create: styles for CurrentJobSection |
| `assets/css/layout/_recent-project.scss` | Create: styles for RecentProjectSection |
| `assets/css/main.scss` | Modify: import new SCSS files |
| `pages/index.vue` | Modify: swap WorkSection for new sections, update imports |

## Out of Scope

- No changes to `SwipingCards.vue` — it remains available for potential future use
- No changes to `WorkSection.vue` — still exists, just not on the index
- No changes to AOS initialization or other pages
- No changes to the Megome API client or data layer
- No changes to terminal composable ("about" virtual file stays)
