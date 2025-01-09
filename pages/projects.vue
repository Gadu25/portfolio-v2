<template>
    <div class="projects">
        <div class="content">
            <h3>Personal</h3>

            <template v-for="project of projects">
                <div class="project-card" data-aos="fade-up">
                    <div class="project-content">
                        <div class="col hover-pointer" @click="visitSite(project.url)">
                            <div class="image-container">
                                <img :src="project.previewImage" :alt="project.name+'-preview'"/>
                            </div>
                        </div>
                        <div class="col">
                            <div class="head hover-pointer" @click="visitSite(project.url)">
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
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import projectData from '~/data/projects';

    const projects = ref(projectData)

    const visitSite = (url)=> {
        window.open(url)
    }
</script>