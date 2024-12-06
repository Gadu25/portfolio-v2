<template>
    <div>
        <Hero/>
        <AboutMe/>
        <TechStacks/>
        <WorkExp/>
    </div>
</template>

<script setup>
    import Hero from '../layouts/hero'
    import AboutMe from '../layouts/aboutme.vue';
    import TechStacks from '~/layouts/techstacks.vue';
    import WorkExp from '~/layouts/workexp.vue';
</script>