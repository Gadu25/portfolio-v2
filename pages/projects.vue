<template>
    <div class="projects">
        <div class="content">
            <h4>Personal <span class="item-count">({{ projects.length }})</span></h4>
            <template v-for="project of projects">
                <div class="project-card" data-aos="fade-up">
                    <div class="project-content">
                        <div class="col">
                            <div class="image-container">
                                <img :src="project.previewImage" :alt="project.name+'-preview'"/>
                            </div>
                        </div>
                        <div class="col">
                            <div class="head">
                                <h4>{{ project.name }}</h4>
                                <small class="text-secondary">
                                    <i class="fa fa-circle" style="font-size: 9px;" :style="'color:'+project.status.color"></i> 
                                    {{ project.status.title }}
                                </small>
                            </div>
                            <small><strong>Tech stacks</strong></small>
                            <div class="techs">
                                <template v-for="item in project.techUsed">
                                    <div class="tech">
                                        <img :src="item.icon" :alt="'icon-for-'+item.tech"/>
                                        <span class="tech-name"><small>{{ item.name }}</small></span>
                                    </div>
                                </template>
                            </div>
                            <div class="desc">
                                <p>{{ project.description }}</p>
                            </div>
                            <!-- Tags section -->
                            <div class="tags">
                                <small><strong>Tags</strong></small>
                                <div class="tag-list">
                                    <template v-for="tag in project.tags">
                                        <span class="tag">{{ tag }}</span>
                                    </template>
                                </div>
                            </div>
                            <!-- End of Tags section -->
                            <div v-if="project.contributors.length" class="contributors">
                                <p>
                                    <small><strong>Contributor(s)</strong></small>
                                </p>
                                <template v-for="item in project.contributors">
                                    <a :href="item.link" target="_blank">🤝 {{ item.userName }}</a>
                                </template>
                            </div>
                            <div class="buttons">
                                <div v-if="project.gitHubUrl" class="github hover-pointer" @click="visitSite(project.gitHubUrl)">
                                    <img :src="github" alt="github-icon"/>
                                    <p>Github</p>
                                </div>
                                <div class="visit hover-pointer" @click="visitSite(project.url)">
                                    <p>Visit Demo</p>
                                    <i class="fa fa-chevron-right"></i>
                                </div>
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

    const projects = ref(projectData)

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