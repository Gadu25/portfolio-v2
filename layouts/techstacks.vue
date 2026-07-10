<template>
    <div class="tech-stacks">
        <div class="content">
            <h3>Tech Experience</h3>
            <div class="tech-wrapper">
                <template v-for="tech in techs">
                    <div class="tech" data-aos="fade-up">
                        <a class="image-container hover-pointer" :href="tech.link" target="_blank"  :aria-label="'Visit '+ tech.name +'website'">
                            <img :src="tech.icon" :alt="tech.name+'-icon'"/>
                            <span class="tech-title"><small>{{ tech.name }}</small></span>
                        </a>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
// FIX ME: Replace with getSkills() from useMegome once skill icons and links are available via API
import techstacks from '~/data/techs';
const techs = ref(techstacks)
</script>