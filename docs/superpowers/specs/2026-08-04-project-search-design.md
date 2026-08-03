# Project Search & Filter — Design

**Date:** 2026-08-04
**Status:** Approved
**Scope:** Live search/filter on the Projects page

## Goal

Let recruiters (and any visitor) instantly find projects by name, tech stack, or keyword. The projects page gets a monochrome search input that filters the already-loaded project list live as the user types.

## Context

- The portfolio is a Nuxt 3 app (Vue 3, `<script setup lang="ts">`).
- The Projects page (`pages/projects/index.vue`) loads projects via `useCachedAsyncData('projects', ...)` with a local fallback (`~/data/projects`). The loaded array is `Ref<ProjectFull[] | null>`.
- Project entries render `title`, `technologies[].name`, `description`, `images.cover`, `status`, `githubLink`, `link` — the same shape for both the Megome API and the local fallback.
- Styling conventions: SCSS partials in `assets/css/{components,layout}`, imported in `assets/css/main.scss`; monochrome design tokens (`--border-color`, `--surface-color`, `--text-color`, `--background-color`) and SCSS spacing/radius tokens (`$space-*`, `$radius-*`); FontAwesome icons via CDN (`<i class="fa ...">`).
- i18n is a stub and unused in pages; hardcoded English strings are the convention.
- No test framework or lint/typecheck scripts exist in `package.json`. Verification is `npm run build` plus a manual pass on `npm run dev`.

## Approach

Small composable (`useProjectSearch`) + reusable component (`ProjectSearch.vue`) consumed by the Projects page. No new dependencies.

## Components

### 1. `composables/useProjectSearch.ts`

- Signature: `useProjectSearch(projects: Ref<ProjectFull[] | null>)`
- Returns `{ query, results, hasQuery, clear }` where:
  - `query: Ref<string>` — reactive search text.
  - `results: ComputedRef<ProjectFull[]>` — filtered list.
  - `hasQuery: ComputedRef<boolean>` — whether a non-empty query exists.
  - `clear(): void` — resets the query to `''`.
- Matching: case-insensitive substring on `title`, `technologies[].name`, and `description`. The input is trimmed before matching; an empty (or whitespace-only) query returns all projects.
- Null/pending data is treated as an empty list.
- Debounced ~150ms via `watch` + `setTimeout` (cleared on each keystroke). No external library.

### 2. `components/common/ProjectSearch.vue`

- Reusable input with `defineModel<string>` two-way bound to `query`.
- Search icon (`fa fa-magnifying-glass`) on the left.
- Clear button (shown only when non-empty) that resets the query and refocuses the input.
- `aria-label="Search projects"` and `placeholder="Search by name, tech, or keyword..."`.
- Follows existing component conventions: `<script setup lang="ts">`, `defineOptions({ name: 'ProjectSearch' })`.

### 3. `assets/css/components/_project-search.scss`

- New partial, registered in `assets/css/main.scss` (alphabetical, after `confirm-dialog`).
- Styling uses existing tokens: `$space-sm/md`, `$radius-md`, `--border-color`, `--surface-color`, `--text-color`, `$transition-base`.
- Monochrome look: bordered, surface background; focus border flips to `--text-color`; matches the minimalist theme.
- Responsive (full width, stacks above the list).

### 4. `pages/projects/index.vue`

- Import and render `<ProjectSearch v-model="query" />` above the list, inside `.content`.
- Loop renders `results` instead of `projects`.
- The existing `(N)` count badge shows `results.length` (live).
- Empty state when `hasQuery` is true and `results` is empty: "No projects match 'query'." plus a clear link. Uses existing `text-secondary` styling.

## Data Flow

1. Projects load exactly as today via `useCachedAsyncData`.
2. `useProjectSearch(projects)` computes `results` from the `query` ref.
3. `ProjectSearch.vue` binds to `query` via `v-model`.
4. The list and count render from `results`.

## Edge Cases

- Empty query → all projects shown, full count.
- Whitespace-only query → treated as empty.
- No matches → empty state with the query echoed and a clear action.
- `projects` null/pending → treated as empty, no errors.
- Rapid typing → debounce keeps the list responsive.

## Error Handling

- No new network calls; filtering operates only on already-loaded data.
- No external service or dependency; nothing to fail beyond existing data loading (unchanged).

## Testing

- No test framework in the repo; verification is:
  - `npm run build` succeeds.
  - `npm run dev` manual pass: type a tech name ("vue"), a project name ("megome"), a partial keyword, verify live count, empty state, clear button, and dark/light theme styling.
