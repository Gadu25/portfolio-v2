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
                                <small>
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
                            <div v-if="project.contributors.length" class="contributors">
                                <p>
                                    <small><strong>Contributor(s)</strong></small>
                                </p>
                                <template v-for="item in project.contributors">
                                    <a :href="item.link" target="_blank">🤝 {{ item.userName }}</a>
                                </template>
                            </div>
                            <div class="buttons">
                                <div class="github hover-pointer" @click="visitSite(project.gitHubUrl)">
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

    const projects = ref(projectData)

    const visitSite = (url)=> {
        window.open(url)
    }
</script>