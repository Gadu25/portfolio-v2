<template>
    <div>
        <Cursor/>
        <Navigation :isScrolled="isScrolled"/>
        <Hero/>
        <AboutMe/>
        <TechStacks/>
        <WorkExp/>
        <Footer/>
    </div>
</template>

<script>
    import ThemeToggle from '../components/common/themeToggle'
    import Navigation from '../layouts/navigation'
    import Hero from '../layouts/hero'
    import AboutMe from '../layouts/aboutme.vue';
    import Cursor from '../components/cursor.vue';
    import TechStacks from '~/layouts/techstacks.vue';
    import WorkExp from '~/layouts/workexp.vue';
    import Footer from '~/layouts/footer.vue';

    export default {
        name: 'App',
        components: { ThemeToggle, Navigation, Hero, AboutMe, Cursor, TechStacks, WorkExp, Footer },
        data() {
            return {
            isScrolled: false, // Track if the user has scrolled
            };
        },
        methods: {
            handleScroll() {
            this.isScrolled = window.scrollY > 0; // Update based on scroll position
            },
        },
        mounted() {
            // Listen to scroll events
            window.addEventListener('scroll', this.handleScroll);
        },
        beforeDestroy() {
            // Clean up event listener
            window.removeEventListener('scroll', this.handleScroll);
        },
    }

</script>