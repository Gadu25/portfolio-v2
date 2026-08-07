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

  return sorted[0] || { title: '', description: '', coverImage: null, technologies: [], createdAt: '' }
})

const truncate = (text: string, maxLen: number): string => {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}
</script>
