<template>
    <!-- <div class="projects">
        <div class="content">
            <h3>Projects</h3>

            <template v-for="project of projects">
                <p>project.name</p>
            </template>
        </div>
    </div> -->
    <div style="display: flex; justify-content: center; align-items: center; padding: auto; height: 90vh;">
        <h1>Under development...</h1>
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
        }
    }
</script>