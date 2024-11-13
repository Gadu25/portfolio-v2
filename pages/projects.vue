<template>
    <div class="projects">
        <div class="content">
            <h3>Projects</h3>

            <template v-for="project of projects">
                <div class="project-card hover-pointer" data-aos="fade-up" @click="visitSite(project.url)">
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
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import projects from '~/data/projects';
    export default {
        name: 'Projects',
        data(){
            return {
                projects: projects
            }
        },
        methods: {
            visitSite(url) {
                window.open(url)
            }
        }
    }
</script>