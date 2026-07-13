<template>
    <div class="detail-page experience-detail">
        <div class="content">
            <div class="back-link hover-pointer" @click="navigateTo(backLink.path)">
                <i class="fa fa-chevron-left"></i>
                <span>{{ backLink.label }}</span>
            </div>

            <template v-if="experience">
                <div class="detail-header" data-aos="fade-up">
                    <div class="header-card">
                        <div class="header-top">
                            <div class="logo-container" v-if="experience.logo">
                                <img :src="experience.logo" :alt="experience.company+'-logo'"/>
                            </div>
                            <div class="header-info">
                                <div class="title-row">
                                    <h3>{{ experience.title }}</h3>
                                    <span v-if="experience.isPresent" class="status-badge present">Current</span>
                                </div>
                                <p class="company">{{ experience.company }}</p>
                                <div class="meta">
                                    <span class="date">
                                        <i class="fa fa-calendar-alt"></i>
                                        {{ formatDate(experience.startDate) }} — {{ experience.isPresent ? 'Present' : formatDate(experience.endDate) }}
                                    </span>
                                    <span class="duration">
                                        <i class="fa fa-clock"></i>
                                        {{ getStayDuration({ start: experience.startDate, end: experience.endDate }) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="detail-body">
                    <div class="section" data-aos="fade-up" data-aos-delay="100">
                        <h4>
                            <i class="fa fa-file-alt"></i>
                            Description
                        </h4>
                        <div class="description" v-html="experience.description"></div>
                    </div>

                    <div v-if="experience.technologies?.length" class="section" data-aos="fade-up" data-aos-delay="200">
                        <h4>
                            <i class="fa fa-tools"></i>
                            Technologies Used
                        </h4>
                        <div class="tech-list">
                            <template v-for="tech in experience.technologies" :key="tech.id || tech.name">
                                <span class="tech-tag">{{ tech.name }}</span>
                            </template>
                        </div>
                    </div>
                </div>
            </template>

            <template v-else-if="loading">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading experience...</p>
                </div>
            </template>

            <template v-else>
                <div class="not-found" data-aos="fade-up">
                    <i class="fa fa-exclamation-triangle"></i>
                    <p>Experience not found.</p>
                    <div class="link-btn primary-btn" @click="navigateTo(backLink.path)">
                        <i class="fa fa-chevron-left"></i>
                        <span>{{ backLink.label }}</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import ogImage from '~/assets/images/memoji/hired.webp'

    const route = useRoute()
    const { getExperienceById } = useMegome()
    const { formatDate } = useFormatDate()
    const { getStayDuration } = useStayDuration()

    const experience = ref(null)
    const loading = ref(true)

    const backLink = computed(() => {
        const from = route.query.from
        if (from === 'home') return { label: 'Back to Home', path: '/' }
        return { label: 'Back to Work', path: '/work' }
    })

    onMounted(async () => {
        try {
            const id = Number(route.params.id)
            experience.value = await getExperienceById(id)
        } catch (e) {
            console.error('Failed to fetch experience:', e)
        } finally {
            loading.value = false
        }
    })

    useSeoMeta({
        description: () => experience.value ? `${experience.value.title} at ${experience.value.company}` : 'Work experience details.',
        ogTitle: () => experience.value ? `${experience.value.title} – ${experience.value.company}` : 'Experience – Alexander Udag',
        ogDescription: () => experience.value ? `${experience.value.title} at ${experience.value.company}` : 'Work experience details.',
        ogImage: ogImage,
        ogUrl: () => `https://alexander-udag.vercel.app/experience/${route.params.id}`,
        twitterTitle: () => experience.value ? `${experience.value.title} – ${experience.value.company}` : 'Experience – Alexander Udag',
        twitterDescription: () => experience.value ? `${experience.value.title} at ${experience.value.company}` : 'Work experience details.',
        twitterImage: ogImage,
        twitterCard: 'summary'
    })

    useHead({
        htmlAttrs: { lang: 'en' },
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    })
</script>
