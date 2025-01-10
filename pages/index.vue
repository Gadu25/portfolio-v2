<template>
    <div>
        <Analytics />
        <Hero/>
        <AboutMe/>
        <TechStacks/>
        <WorkExp/>
    </div>
</template>

<script setup="ts">
    import Hero from '../layouts/hero'
    import AboutMe from '../layouts/aboutme.vue';
    import TechStacks from '~/layouts/techstacks.vue';
    import WorkExp from '~/layouts/workexp.vue';
    import { Analytics } from '@vercel/analytics/nuxt'
</script>