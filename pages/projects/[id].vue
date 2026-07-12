<template>
    <div class="detail-page">
        <div class="content">
            <div class="back-link hover-pointer" @click="navigateTo('/projects')">
                <i class="fa fa-chevron-left"></i>
                <span>Back to Projects</span>
            </div>

            <template v-if="project">
                <div class="detail-header">
                    <div class="cover-image">
                        <img :src="project.images.cover" :alt="project.title+'-cover'"/>
                    </div>
                    <div class="header-info">
                        <div class="title-row">
                            <h3>{{ project.title }}</h3>
                            <span class="status-badge">{{ project.status }}</span>
                        </div>
                        <div class="links">
                            <a v-if="project.githubLink" :href="project.githubLink" target="_blank" class="link-btn github-btn">
                                <img :src="github" alt="github-icon"/>
                                <span>GitHub</span>
                            </a>
                            <a v-if="project.link" :href="project.link" target="_blank" class="link-btn demo-btn">
                                <span>Visit Demo</span>
                                <i class="fa fa-external-link"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="detail-body">
                    <div class="section">
                        <h4>Description</h4>
                        <p>{{ project.description }}</p>
                    </div>

                    <div class="section">
                        <h4>Tech Stacks</h4>
                        <div class="tech-list">
                            <template v-for="tech in project.technologies">
                                <span class="tech-tag">{{ tech.name }}</span>
                            </template>
                        </div>
                    </div>

                    <div v-if="project.images.screenshots?.length" class="section">
                        <h4>Screenshots</h4>
                        <div class="screenshots">
                            <template v-for="(screenshot, index) in project.images.screenshots">
                                <div class="screenshot-item">
                                    <img :src="screenshot" :alt="'screenshot-'+(index+1)"/>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else-if="loading">
                <div class="loading">
                    <p>Loading project...</p>
                </div>
            </template>

            <template v-else>
                <div class="not-found">
                    <p>Project not found.</p>
                    <div class="link-btn demo-btn" @click="navigateTo('/projects')">
                        <span>Back to Projects</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import github from '~/assets/images/tech/github.webp'
    import ogImage from '~/assets/images/memoji/tablet.webp'

    const route = useRoute()
    const { getProjectById } = useMegome()

    const project = ref(null)
    const loading = ref(true)

    onMounted(async () => {
        try {
            const id = Number(route.params.id)
            project.value = await getProjectById(id)
        } catch (e) {
            console.error('Failed to fetch project:', e)
        } finally {
            loading.value = false
        }
    })

    useSeoMeta({
        description: () => project.value?.description || 'Project details by Alexander Udag.',
        ogTitle: () => project.value ? `${project.value.title} – Alexander Udag` : 'Project – Alexander Udag',
        ogDescription: () => project.value?.description || 'Project details by Alexander Udag.',
        ogImage: () => project.value?.images.cover || ogImage,
        ogUrl: () => `https://alexander-udag.vercel.app/projects/${route.params.id}`,
        twitterTitle: () => project.value ? `${project.value.title} – Alexander Udag` : 'Project – Alexander Udag',
        twitterDescription: () => project.value?.description || 'Project details by Alexander Udag.',
        twitterImage: () => project.value?.images.cover || ogImage,
        twitterCard: 'summary'
    })

    useHead({
        htmlAttrs: { lang: 'en' },
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    })
</script>
