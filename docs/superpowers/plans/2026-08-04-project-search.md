# Project Search & Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live search/filter to the Projects page so visitors can find projects by name, tech stack, or keyword.

**Architecture:** A small composable (`useProjectSearch`) exposes `query`, `results`, `hasQuery`, and `clear`. A reusable monochrome input component (`ProjectSearch.vue`) binds to `query` via `v-model`. The Projects page renders `results` instead of the raw list and shows an empty state when nothing matches.

**Tech Stack:** Nuxt 3.21 / Vue 3.5 (`<script setup lang="ts">`, `defineModel`, `defineOptions`), SCSS partials registered in `assets/css/main.scss`, FontAwesome 6 icons via CDN.

**Spec:** `docs/superpowers/specs/2026-08-04-project-search-design.md`

## Global Constraints

- **No new runtime dependencies.** The debounce is implemented manually with `watch` + `setTimeout` (no VueUse).
- **UI strings are hardcoded English** (i18n is a stub and unused in pages).
- **SCSS conventions:** new partials go in `assets/css/components/` (component styles) or `assets/css/layout/` (page styles) and are registered in `assets/css/main.scss` in alphabetical order. Use existing tokens (`$space-*`, `$radius-*`, `$font-size-*`, `--border-color`, `--surface-color`, `--text-color`, `--secondary-text-color`, `$transition-base`).
- **Component conventions:** `<script setup lang="ts">`, `defineOptions({ name: '...' })`, imports via `~/`.
- **Project shape:** entries follow `ProjectFull` from `~/types/megome` — fields used by the page are `title: string`, `description: string`, `technologies: Technology[]` (each has `name: string`), `images.cover`, `status`, `githubLink`, `link`.
- **No test framework exists** in `package.json`. Unit-test steps are replaced with verification: `npm run build` must succeed and, for Task 3, a manual `npm run dev` checklist. This matches the approved spec.

---

### Task 1: `useProjectSearch` composable

**Files:**
- Create: `composables/useProjectSearch.ts`

**Interfaces:**
- Consumes: `ProjectFull` type from `~/types/megome`.
- Produces: `useProjectSearch(projects: Ref<ProjectFull[] | null>)` returning `{ query: Ref<string>, results: ComputedRef<ProjectFull[]>, hasQuery: ComputedRef<boolean>, clear: () => void }`. Later tasks rely on exactly these names.

- [ ] **Step 1: Create the composable**

`composables/useProjectSearch.ts`:

```ts
import type { ProjectFull } from '~/types/megome'

export const useProjectSearch = (projects: Ref<ProjectFull[] | null>) => {
  const query = ref('')
  const debouncedQuery = ref('')
  const debounceMs = 150

  let timeout: ReturnType<typeof setTimeout> | null = null
  watch(query, (value) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedQuery.value = value
    }, debounceMs)
  })

  const results = computed(() => {
    const term = debouncedQuery.value.trim().toLowerCase()
    if (!term) return projects.value ?? []

    return (projects.value ?? []).filter((project) => {
      const title = (project.title ?? '').toLowerCase()
      const description = (project.description ?? '').toLowerCase()
      const techs = (project.technologies ?? [])
        .map((tech) => (tech.name ?? '').toLowerCase())
        .join(' ')

      return title.includes(term) || description.includes(term) || techs.includes(term)
    })
  })

  const hasQuery = computed(() => debouncedQuery.value.trim().length > 0)

  const clear = () => {
    if (timeout) clearTimeout(timeout)
    query.value = ''
    debouncedQuery.value = ''
  }

  return { query, results, hasQuery, clear }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (no compile errors). The composable is only used at runtime by later tasks, so this step just confirms the file parses.

- [ ] **Step 3: Commit**

```bash
git add composables/useProjectSearch.ts
git commit -m "feat: add useProjectSearch composable"
```

---

### Task 2: `ProjectSearch.vue` component + SCSS partial

**Files:**
- Create: `components/common/ProjectSearch.vue`
- Create: `assets/css/components/_project-search.scss`
- Modify: `assets/css/main.scss:12` (register the partial)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `ProjectSearch` component with a `v-model` prop bound to `query: string` (via `defineModel`). Optional `placeholder` and `aria-label` props. Later tasks render `<ProjectSearch v-model="query" />`.

- [ ] **Step 1: Create the component**

`components/common/ProjectSearch.vue`:

```vue
<template>
  <div class="project-search">
    <i class="fa fa-magnifying-glass project-search__icon" aria-hidden="true" />
    <input
      ref="inputRef"
      v-model="model"
      class="project-search__input"
      type="text"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
    />
    <button
      v-if="model"
      class="project-search__clear"
      type="button"
      :aria-label="clearAriaLabel"
      @click="handleClear"
    >
      <i class="fa fa-xmark" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    ariaLabel?: string
  }>(),
  {
    placeholder: 'Search by name, tech, or keyword...',
    ariaLabel: 'Search projects',
  },
)

defineOptions({ name: 'ProjectSearch' })

const clearAriaLabel = 'Clear search'
const inputRef = ref<HTMLInputElement | null>(null)

const handleClear = () => {
  model.value = ''
  inputRef.value?.focus()
}
</script>
```

- [ ] **Step 2: Create the SCSS partial**

`assets/css/components/_project-search.scss`:

```scss
.project-search {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: $space-lg;

  &__icon {
    position: absolute;
    left: $space-md;
    color: var(--secondary-text-color);
    font-size: $font-size-sm;
    pointer-events: none;
  }

  &__input {
    width: 100%;
    padding: $space-sm $space-xl;
    border: 1px solid var(--border-color);
    border-radius: $radius-md;
    background-color: var(--surface-color);
    color: var(--text-color);
    font-size: $font-size-sm;
    font-family: inherit;
    transition: border-color $transition-base;

    &:focus {
      outline: none;
      border-color: var(--text-color);
    }

    &::placeholder {
      color: var(--secondary-text-color);
    }
  }

  &__clear {
    position: absolute;
    right: $space-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--secondary-text-color);
    font-size: $font-size-sm;
    cursor: pointer;
    transition: color $transition-base;

    &:hover {
      color: var(--text-color);
    }
  }
}
```

- [ ] **Step 3: Register the partial**

In `assets/css/main.scss`, insert the import in alphabetical order right after the `confirm-dialog` line (line 12):

```scss
@import './components/project-search';
```

- [ ] **Step 4: Verify it compiles**

Run: `npm run build`
Expected: build succeeds — SCSS compiles without errors.

- [ ] **Step 5: Commit**

```bash
git add components/common/ProjectSearch.vue assets/css/components/_project-search.scss assets/css/main.scss
git commit -m "feat: add ProjectSearch input component"
```

---

### Task 3: Integrate into the Projects page + empty state

**Files:**
- Modify: `pages/projects/index.vue`
- Modify: `assets/css/layout/_projects.scss:4` (add empty-state styles)

**Interfaces:**
- Consumes: `useProjectSearch(projects)` from Task 1, `<ProjectSearch v-model="query" />` from Task 2.
- Produces: the finished feature — a searchable project list with live count and empty state.

- [ ] **Step 1: Wire the composable into the page script**

In `pages/projects/index.vue`, `projects` is the destructured `data` from `useCachedAsyncData`. Add the composable and imports. The `<script setup>` block becomes:

```vue
<script setup>
    import ProjectSearch from '~/components/common/ProjectSearch.vue'
    import projectData from '~/data/projects';
    import ogImage from '~/assets/images/memoji/tablet.webp';

    const { getProjects } = useMegome()

    const { data: projects, status } = await useCachedAsyncData('projects', () => getProjects(), {
        default: () => projectData
    })

    const { query, results, hasQuery, clear } = useProjectSearch(projects)

    useSeoMeta({
        description: 'Browse the personal projects and web app demos created by Alexander Udag using Vue, Nuxt, Laravel, and more.',
        ogTitle: 'Personal Projects & Demos – Alexander Udag',
        ogDescription: 'Discover personal experiments and side projects by Alexander that reflect his creativity and technical skills.',
        ogImage: ogImage,
        ogUrl: 'https://alexander.udaglab.com/projects',
        twitterTitle: 'Personal Projects & Demos – Alexander Udag',
        twitterDescription: 'Explore side projects and interactive demos crafted with love and code by Alexander Udag.',
        twitterImage: ogImage,
        twitterCard: 'summary'
    })

    useHead({
        htmlAttrs: { lang: 'en' },
        link: [{ rel: 'icon', type: 'image/webp', href: '/favicon.webp' }]
    })
</script>
```

- [ ] **Step 2: Render the search input, filtered results, and empty state**

In the template of `pages/projects/index.vue`:

- Insert `<ProjectSearch v-model="query" />` right after the `<h3>` heading and before the `status === 'pending'` template.
- Change the heading count from `projects.length` to `results.length`.
- Change the loop from `v-for="project of projects"` to `v-for="project of results"`.
- Add the empty state as the last element inside `.content`, after the `v-else` template.

The `<template>` block becomes:

```vue
<template>
    <div class="projects">
        <div class="content">
            <h3>Projects <span v-if="status !== 'pending'" class="item-count">({{ results.length }})</span></h3>
            <ProjectSearch v-model="query" />
            <template v-if="status === 'pending'">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading projects...</p>
                </div>
            </template>
            <template v-else>
                <template v-for="project of results">
                    <div class="project-card" data-aos="fade-up">
                        <div class="project-content">
                            <div class="col">
                                <div class="image-container">
                                    <img :src="project.images.cover" :alt="project.title+'-preview'"/>
                                </div>
                            </div>
                            <div class="col">
                                <div class="head">
                                    <h4>{{ project.title }}</h4>
                                    <small class="text-secondary">
                                        <i class="fa fa-circle" style="font-size: 9px;"></i> 
                                        {{ project.status }}
                                    </small>
                                </div>
                                <small><strong>Tech stacks</strong></small>
                                <div class="techs">
                                    <template v-for="tech in project.technologies">
                                        <div class="tech">
                                            <span class="tech-name"><small>{{ tech.name }}</small></span>
                                        </div>
                                    </template>
                                </div>
                                <div class="desc">
                                    <p>{{ project.description }}</p>
                                </div>
                                <div class="buttons">
                                    <a v-if="project.githubLink" :href="project.githubLink" target="_blank" rel="noopener noreferrer" class="btn btn--secondary hover-pointer">
                                        <i class="fa-brands fa-github"></i>
                                        <span>Source</span>
                                    </a>
                                    <NuxtLink :to="'/projects/'+project.id" class="btn btn--primary hover-pointer">
                                        <span>View Details</span>
                                        <i class="fa fa-arrow-right"></i>
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-if="hasQuery && results.length === 0" class="projects__empty text-secondary">
                    <p>No projects match '{{ query }}'.</p>
                    <small class="hover-pointer" @click="clear">Clear search</small>
                </div>
            </template>
        </div>
    </div>
</template>
```

- [ ] **Step 3: Add empty-state styles**

In `assets/css/layout/_projects.scss`, inside the `.projects { .content { ... } }` block (after the `.project-card` rule, still nested under `.content`), add:

```scss
    .projects__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-xs;
      margin-top: $space-lg;
      text-align: center;

      small {
        cursor: pointer;

        &:hover {
          color: var(--text-color);
        }
      }
    }
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open `http://localhost:3000/projects`, and confirm:

1. The search input shows between the "Projects (6)" heading and the first card.
2. Type `vue` → only projects with Vue/Vue.js tech tags remain; the count updates live.
3. Type `megome` → only Megome remains.
4. Type a description keyword (e.g. `password`) → Passkeep remains.
5. Type gibberish (`zzz`) → list clears, "No projects match 'zzz'." and a clear link appear; clicking clear restores all 6.
6. Clear button (`×`) in the input clears the text and restores the list.
7. Toggle light/dark theme → input styles look correct in both.
8. On a narrow/mobile viewport the input is full-width and the list stacks correctly.

- [ ] **Step 6: Commit**

```bash
git add pages/projects/index.vue assets/css/layout/_projects.scss
git commit -m "feat: add live search filter to projects page"
```

---

## Self-Review

**Spec coverage:**
- Composable with `query`, `results`, `hasQuery`, `clear`, debounced 150ms, null-safe, case-insensitive on title/techs/description → Task 1. ✔
- `ProjectSearch.vue` with `defineModel`, magnifying-glass icon, clear button, aria/placeholder → Task 2. ✔
- SCSS partial registered in `main.scss`, monochrome tokens → Task 2. ✔
- Page renders `results`, live `(N)` count, empty state → Task 3. ✔
- No new deps (manual `setTimeout` debounce) → Task 1. ✔
- Verification via `npm run build` + manual dev pass (no test framework) → Tasks 1–3. ✔

**Placeholder scan:** No TBD/TODO; every code step shows complete file contents. ✔

**Type consistency:** `useProjectSearch(projects: Ref<ProjectFull[] | null>)` returns `{ query, results, hasQuery, clear }` in Task 1; Task 3 consumes those exact names. Component is `<ProjectSearch v-model="query" />` in Tasks 2–3. ✔
