<template>
    <div class="projects">
        <div class="content">
            <h4>Projects <span class="item-count">({{ projects.length }})</span></h4>
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
                                <div v-if="project.githubLink" class="github hover-pointer" @click="visitSite(project.githubLink)">
                                    <img :src="github" alt="github-icon"/>
                                    <p>Github</p>
                                </div>
                                <div class="visit hover-pointer" @click="visitSite(project.link)">
                                    <p>Visit Demo</p>
                                    <i class="fa fa-chevron-right"></i>
                                </div>
                                <NuxtLink :to="'/projects/'+project.id" class="details hover-pointer">
                                    <p>View Details</p>
                                    <i class="fa fa-chevron-right"></i>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import projectData from '~/data/projects';
    import github from '~/assets/images/tech/github.webp'
    import ogImage from '~/assets/images/memoji/tablet.webp';

    const { getProjects } = useMegome()

    const projects = ref(projectData)

    onMounted(async () => {
        try {
            const apiProjects = await getProjects()
            if (apiProjects && apiProjects.length > 0) {
                projects.value = apiProjects
            }
        } catch (e) {
            console.error('Failed to fetch projects:', e)
        }
    })

    const visitSite = (url)=> {
        window.open(url)
    }

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
