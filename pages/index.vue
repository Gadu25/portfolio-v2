<template>
    <div>
        <Hero/>
        <section>
            <AboutMe/>
        </section>
        <section>
            <TechStacks/>
        </section>
        <section>
            <WorkExp/>
        </section>
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