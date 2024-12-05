<template>
    <div>
        <Hero/>
        <AboutMe/>
        <TechStacks/>
        <WorkExp/>
    </div>
</template>

<script>
    import Hero from '../layouts/hero'
    import AboutMe from '../layouts/aboutme.vue';
    import TechStacks from '~/layouts/techstacks.vue';
    import WorkExp from '~/layouts/workexp.vue';

    export default {
        name: 'Home',
        components: { Hero, AboutMe, TechStacks, WorkExp }
    }

</script>