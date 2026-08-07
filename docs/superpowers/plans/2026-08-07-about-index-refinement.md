# About Section Refinement & Index Page Restructure

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify About section to single portrait with Swiss-style typography, replace WorkSection on index with CurrentJobSection and RecentProjectSection entry points.

**Architecture:** Two new section components fetch data via existing cached Megome composables. About section CSS is simplified by removing the overlapping-card layout. Index page drops WorkSection/SwipingCards import and gains two new section imports.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, SCSS (BEM), Megome API, useCachedAsyncData

## Global Constraints

- Design follows Swiss Modernist monochrome spec — no accent colors, emphasis via weight/size/spacing
- All new SCSS uses `$variables` tokens and `var(--*)` CSS custom properties
- Follow BEM naming: `.section-name__element`
- Use `useCachedAsyncData` for data fetching with keys matching existing consumers to share cache
- AOS remains on all existing and new section elements
- No changes to SwipingCards.vue, WorkSection.vue, or any other pages

---

## File Structure

| File | Responsibility |
|------|---------------|
| `components/sections/AboutSection.vue` | Modified: single image, no tilt |
| `assets/css/layout/_aboutme.scss` | Modified: simplified image styles, bio fix |
| `components/sections/CurrentJobSection.vue` | New: shows current role card |
| `assets/css/layout/_current-job.scss` | New: styles for CurrentJobSection |
| `components/sections/RecentProjectSection.vue` | New: shows recent project card |
| `assets/css/layout/_recent-project.scss` | New: styles for RecentProjectSection |
| `pages/index.vue` | Modified: swap WorkSection for new sections |
| `assets/css/main.scss` | Modified: import two new SCSS files |

---

### Task 1: Simplify AboutSection template

**Files:**
- Modify: `components/sections/AboutSection.vue`

**Produces:** Single-night image, no tilt handlers, no hover-pointer class

- [ ] **Step 1: Remove the day.webp image wrapper and tilt handlers**

Replace the template block (lines 1-59) with this:

```vue
<template>
  <section class="about">
    <div class="about__container">
      <div class="about__text" data-aos="fade-up">
        <div class="about__heading">
          <h3>About</h3>
        </div>
        <template v-if="status === 'pending'">
          <div class="loading">
            <div class="spinner"></div>
            <p>Loading about...</p>
          </div>
        </template>
        <template v-else>
          <div v-if="profile?.bio" v-html="profile.bio" class="about__bio" />
          <template v-else>
            <p>
              Hi there! I'm Alexander Udag, a web developer enthusiastic about
              coding and continuous improvement. I work with
              <strong>JavaScript</strong>, <strong>HTML</strong>,
              <strong>CSS</strong>, <strong>Python</strong>, and
              <strong>PHP</strong> to create modern, scalable web applications.
            </p>
            <p>
              My skill set includes frameworks like <strong>Vue</strong>,
              <strong>React</strong>, and <strong>Laravel</strong>, as well as
              database management with <strong>MySQL</strong> and
              <strong>PostgreSQL</strong>. I enjoy learning new things, overcoming
              challenges, and growing both personally and professionally. For me,
              coding is not just about delivering results — it's about crafting
              solutions I can be proud of.
            </p>
          </template>
        </template>
      </div>
      <div class="about__images" data-aos="fade-left">
        <div class="about__image-wrapper">
          <img src="~/assets/images/night.webp" alt="Alex at night" />
        </div>
      </div>
    </div>
  </section>
</template>
```

Replace the script block (lines 61-89) with this:

```ts
<script setup lang="ts">
const { getProfile } = useMegome()

const { data: profile, status } = await useCachedAsyncData('profile', () => getProfile())
</script>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/AboutSection.vue
git commit -m "refactor: simplify AboutSection template to single image, remove tilt handlers"
```

---

### Task 2: Simplify AboutSection SCSS

**Files:**
- Modify: `assets/css/layout/_aboutme.scss`

**Produces:** Centered single image, no grayscale hover, fixed bio typography, removed h3 hover transition

- [ ] **Step 1: Replace the entire file**

Overwrite `assets/css/layout/_aboutme.scss` with:

```scss
.about {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $space-3xl 0;

  &__container {
    max-width: $max-width;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-2xl;
    padding: 0 $space-lg;
    align-items: center;
  }

  &__text {
    p {
      margin-bottom: $space-md;
      line-height: 1.8;
    }
  }

  &__heading {
    display: flex;
    gap: $space-sm;
    align-items: flex-end;
    margin-bottom: $space-lg;
  }

  &__memoji {
    display: none;

    @media screen and (min-width: $bp-tablet) {
      display: block;
      height: 70px;
    }
  }

  &__bio {
    :deep(p) {
      margin-bottom: $space-md;
    }
  }

  &__images {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 320px;
  }

  &__image-wrapper {
    width: 260px;
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: $shadow-lg;
    transition: transform $transition-medium cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: scale(1.02);
    }

    img {
      display: block;
      width: 100%;
      object-fit: cover;
    }
  }
}

@media screen and (max-width: $bp-desktop) {
  .about {
    padding: $space-2xl 0;

    &__container {
      grid-template-columns: 1fr;
      gap: $space-xl;
    }

    &__images {
      display: none;
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/layout/_aboutme.scss
git commit -m "refactor: simplify About SCSS — centered single image, remove grayscale hover, fix bio to body size"
```

---

### Task 3: Create CurrentJobSection component

**Files:**
- Create: `components/sections/CurrentJobSection.vue`

**Interfaces:**
- Consumes: `useMegome().getExperiences()` from `~/composables/useMegome`, `useCachedAsyncData` from `~/composables/useCachedAsyncData`, `useStayDuration` from `~/composables/useStayDuration`, `useFormatDate` from `~/composables/useFormatDate`, `Experience` type from `~/types/megome`, `workexp` from `~/data/workexp`
- Produces: `<CurrentJobSection />` Vue component with `data-aos="fade-up"`

- [ ] **Step 1: Create the component file**

Write `components/sections/CurrentJobSection.vue`:

```vue
<template>
  <section class="current-job" data-aos="fade-up">
    <div class="current-job__container">
      <template v-if="status === 'pending'">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading experience...</p>
        </div>
      </template>
      <template v-else>
        <div class="current-job__card">
          <div class="current-job__logo">
            <img v-if="currentJob.logo" :src="currentJob.logo" :alt="currentJob.company + '-logo'" />
          </div>
          <div class="current-job__details">
            <h4 class="text-secondary">Current Role</h4>
            <h3>{{ currentJob.company }}</h3>
            <p class="current-job__title">{{ currentJob.title }}</p>
            <small class="text-secondary">
              Since {{ formatDate(currentJob.startDate) }}
              <i> ({{ getStayDuration({ start: currentJob.startDate, end: currentJob.endDate }) }})</i>
            </small>
            <p class="current-job__excerpt" v-html="stripHtml(currentJob.description, 150)" />
            <NuxtLink to="/work" class="current-job__link">
              View Full Experience &rarr;
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import workexp from '~/data/workexp'

const { getExperiences } = useMegome()
const { getStayDuration } = useStayDuration()
const { formatDate } = useFormatDate()

const { data: rawExperiences, status } = await useCachedAsyncData('experiences', () => getExperiences())

const currentJob = computed(() => {
  const source = rawExperiences.value && rawExperiences.value.length > 0 ? rawExperiences.value : workexp
  return source.find((e: any) => e.isPresent) || source[0]
})

const stripHtml = (html: string, maxLen: number): string => {
  const text = html.replace(/<[^>]*>/g, '')
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/CurrentJobSection.vue
git commit -m "feat: add CurrentJobSection component showing current role with link to /work"
```

---

### Task 4: Create CurrentJobSection SCSS

**Files:**
- Create: `assets/css/layout/_current-job.scss`

**Produces:** Two-column card layout for current job display, responsive single-column on mobile

- [ ] **Step 1: Create the SCSS file**

Write `assets/css/layout/_current-job.scss`:

```scss
.current-job {
  padding: $space-3xl 0;

  &__container {
    max-width: $max-width;
    margin: 0 auto;
    padding: 0 $space-lg;
  }

  &__card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: $space-xl;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: $radius-md;
    padding: $space-xl;
    align-items: center;
  }

  &__logo {
    width: $logo-lg;
    height: $logo-lg;
    border-radius: $radius-md;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--background-color);
    border: 1px solid var(--border-color);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: $space-sm;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $space-sm;

    h3 {
      margin: 0;
    }
  }

  &__title {
    margin: 0;
  }

  &__excerpt {
    color: var(--secondary-text-color);
    line-height: 1.6;
  }

  &__link {
    display: inline-block;
    margin-top: $space-sm;
    color: var(--secondary-text-color);
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-base;

    &:hover {
      color: var(--text-color);
      text-decoration: underline;
    }
  }
}

@media screen and (max-width: $bp-desktop) {
  .current-job {
    padding: $space-2xl 0;

    &__card {
      grid-template-columns: 1fr;
    }

    &__logo {
      width: $logo-md;
      height: $logo-md;
      justify-self: center;
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/layout/_current-job.scss
git commit -m "feat: add _current-job.scss with two-column card layout"
```

---

### Task 5: Create RecentProjectSection component

**Files:**
- Create: `components/sections/RecentProjectSection.vue`

**Interfaces:**
- Consumes: `useMegome().getProjects()` from `~/composables/useMegome`, `useCachedAsyncData` from `~/composables/useCachedAsyncData`, `projectData` from `~/data/projects`, `ProjectFull` type from `~/types/megome`
- Produces: `<RecentProjectSection />` Vue component with `data-aos="fade-up"`

- [ ] **Step 1: Create the component file**

Write `components/sections/RecentProjectSection.vue`:

```vue
<template>
  <section class="recent-project" data-aos="fade-up">
    <div class="recent-project__container">
      <template v-if="status === 'pending'">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading project...</p>
        </div>
      </template>
      <template v-else>
        <div class="recent-project__card">
          <div class="recent-project__details">
            <h4 class="text-secondary">Recent Project</h4>
            <h3>{{ recentProject.title }}</h3>
            <div class="recent-project__techs">
              <span
                v-for="tech in recentProject.technologies"
                :key="tech.slug"
                class="recent-project__tech"
              >
                <small>{{ tech.name }}</small>
              </span>
            </div>
            <p class="recent-project__excerpt">
              {{ truncate(recentProject.description, 150) }}
            </p>
            <NuxtLink to="/projects" class="recent-project__link">
              View All Projects &rarr;
            </NuxtLink>
          </div>
          <div class="recent-project__image">
            <img
              v-if="recentProject.coverImage"
              :src="recentProject.coverImage"
              :alt="recentProject.title"
            />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import projectData from '~/data/projects'

const { getProjects } = useMegome()

const { data: rawProjects, status } = await useCachedAsyncData('projects', () => getProjects(), {
  default: () => projectData,
})

interface NormalizedProject {
  title: string
  description: string
  coverImage: string | null
  technologies: { name: string; slug: string }[]
  createdAt: string
}

const recentProject = computed<NormalizedProject>(() => {
  const source = rawProjects.value && rawProjects.value.length > 0 ? rawProjects.value : projectData

  const normalized = source.map((p: any): NormalizedProject => ({
    title: p.title || p.name || '',
    description: p.description || '',
    coverImage: p.images?.cover || p.previewImage || null,
    technologies: (p.technologies || p.techUsed || []).map((t: any) => ({
      name: t.name,
      slug: t.slug || t.name.toLowerCase(),
    })),
    createdAt: p.createdAt || '',
  }))

  const sorted = normalized.sort(
    (a: NormalizedProject, b: NormalizedProject) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return sorted[0]
})

const truncate = (text: string, maxLen: number): string => {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/RecentProjectSection.vue
git commit -m "feat: add RecentProjectSection component showing latest project with link to /projects"
```

---

### Task 6: Create RecentProjectSection SCSS

**Files:**
- Create: `assets/css/layout/_recent-project.scss`

**Produces:** Two-column reversed card layout (text left, image right), responsive single-column on mobile

- [ ] **Step 1: Create the SCSS file**

Write `assets/css/layout/_recent-project.scss`:

```scss
.recent-project {
  padding: $space-3xl 0;

  &__container {
    max-width: $max-width;
    margin: 0 auto;
    padding: 0 $space-lg;
  }

  &__card {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: $space-xl;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: $radius-md;
    padding: $space-xl;
    align-items: center;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $space-sm;
    order: 1;

    h3 {
      margin: 0;
    }
  }

  &__image {
    width: 260px;
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: $shadow-lg;
    order: 2;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 16 / 10;
    }
  }

  &__techs {
    display: flex;
    flex-wrap: wrap;
    gap: $space-xs;
  }

  &__tech {
    border: 1px solid var(--border-color);
    border-radius: $radius-full;
    padding: 2px $space-sm;
    color: var(--secondary-text-color);
    transition: border-color $transition-base, color $transition-base;

    &:hover {
      border-color: var(--text-color);
      color: var(--text-color);
    }
  }

  &__excerpt {
    color: var(--secondary-text-color);
    line-height: 1.6;
  }

  &__link {
    display: inline-block;
    margin-top: $space-sm;
    color: var(--secondary-text-color);
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-base;

    &:hover {
      color: var(--text-color);
      text-decoration: underline;
    }
  }
}

@media screen and (max-width: $bp-desktop) {
  .recent-project {
    padding: $space-2xl 0;

    &__card {
      grid-template-columns: 1fr;
    }

    &__details {
      order: 1;
    }

    &__image {
      width: 100%;
      order: 0;
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/layout/_recent-project.scss
git commit -m "feat: add _recent-project.scss with reversed two-column card layout"
```

---

### Task 7: Import new SCSS files

**Files:**
- Modify: `assets/css/main.scss`

**Produces:** New SCSS files loaded into the build

- [ ] **Step 1: Add imports to main.scss**

In `assets/css/main.scss`, add two new layout imports after the existing layout imports. Replace lines 19-21:

**Current (lines 19-21):**
```scss
@import './layout/aboutme';
@import './layout/workexp';
@import './layout/footer';
```

**New:**
```scss
@import './layout/aboutme';
@import './layout/current-job';
@import './layout/recent-project';
@import './layout/workexp';
@import './layout/footer';
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/main.scss
git commit -m "feat: import new _current-job and _recent-project SCSS files"
```

---

### Task 8: Update index.vue

**Files:**
- Modify: `pages/index.vue`

**Produces:** Index page with CurrentJobSection and RecentProjectSection replacing WorkSection

- [ ] **Step 1: Replace template and imports**

Replace the entire file `pages/index.vue` with:

```vue
<template>
  <div>
    <Analytics />
    <HeroSection />
    <AboutSection />
    <CurrentJobSection />
    <RecentProjectSection />
    <TechSection />
  </div>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import HeroSection from '~/components/sections/HeroSection.vue'
import AboutSection from '~/components/sections/AboutSection.vue'
import CurrentJobSection from '~/components/sections/CurrentJobSection.vue'
import RecentProjectSection from '~/components/sections/RecentProjectSection.vue'
import TechSection from '~/components/sections/TechSection.vue'
import ogImage from '~/assets/images/memoji/sofaChill.webp'

useSeoMeta({
  description: 'Creative software engineer crafting responsive and high-performing web applications.',
  ogTitle: 'Alexander Udag – Web Developer Portfolio',
  ogDescription: 'Explore the portfolio of Alexander Udag, a frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies.',
  ogImage,
  ogUrl: 'https://alexander.udaglab.com/',
  twitterTitle: 'Alexander Udag – Web Developer Portfolio',
  twitterDescription: 'Creative web developer with a knack for clean design and optimized code.',
  twitterImage: ogImage,
  twitterCard: 'summary',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', type: 'image/webp', href: '/favicon.webp' }],
})
</script>
```

- [ ] **Step 2: Commit**

```bash
git add pages/index.vue
git commit -m "feat: replace WorkSection with CurrentJobSection and RecentProjectSection on index"
```

---

### Task 9: Build and verify

**Files:**
- None created or modified

**Produces:** Confirmation that the build succeeds and the page renders correctly

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx nuxi typecheck
```

Expected: No type errors related to the new or modified files.

- [ ] **Step 3: Verify AboutSection renders single image**

Check `components/sections/AboutSection.vue` has exactly one `<img>` tag and no `@mousemove`/`@mouseleave` handlers.

- [ ] **Step 4: Verify index has correct section order**

Check `pages/index.vue` renders sections in order: Hero, About, CurrentJob, RecentProject, Tech.
