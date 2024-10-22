<template>
    <div>
        <!-- <h1 class="title">Hello World</h1> -->
        <!-- <ThemeToggle/> -->
        <Navigation/>
        <Hero/>
        <AboutMe/>
        <!-- <div>
            <i class="fas fa-camera"></i>
            <i class="far fa-heart"></i>
            <i class="fab fa-github"></i>
        </div> -->
    </div>
</template>

<script>
    import ThemeToggle from '../components/common/themeToggle'
    import Navigation from '../layouts/navigation'
    import Hero from '../layouts/hero'
    import AboutMe from '../layouts/aboutme.vue';

    export default {
        name: 'App',
        components: { ThemeToggle, Navigation, Hero, AboutMe }
    }

</script>