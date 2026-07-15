<template>
    <div class="projects">
        <div class="content">
            <h4>Projects <span v-if="status !== 'pending'" class="item-count">({{ projects.length }})</span></h4>
            <template v-if="status === 'pending'">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading projects...</p>
                </div>
            </template>
            <template v-else>
                <template v-for="project of projects">
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
            </template>
        </div>
    </div>
</template>

<script setup>
    import projectData from '~/data/projects';
    import ogImage from '~/assets/images/memoji/tablet.webp';

    const { getProjects } = useMegome()

    const { data: projects, status } = await useCachedAsyncData('projects', () => getProjects(), {
        default: () => projectData
    })

    useSeoMeta({
        description: 'Browse the personal projects and web app demos created by Alexander Udag using Vue, Nuxt, Laravel, and more.',
        ogTitle: 'Personal Projects & Demos – Alexander Udag',
        ogDescription: 'Discover personal experiments and side projects by Alexander that reflect his creativity and technical skills.',
        ogImage: ogImage,
        ogUrl: 'https://alexander-udag.vercel.apps/projects',
        twitterTitle: 'Personal Projects & Demos – Alexander Udag',
        twitterDescription: 'Explore side projects and interactive demos crafted with love and code by Alexander Udag.',
        twitterImage: ogImage,
        twitterCard: 'summary'
    })

    useHead({
        htmlAttrs: { lang: 'en' },
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    })
</script>
