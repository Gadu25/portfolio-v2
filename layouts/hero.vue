<template>
    <div class="hero">
        <Particles />
        <div class="content">
            <!-- <div ref="lottieContainer" class="lottie-animation"></div> -->
            <p>I am..</p>
            <h1>Alexander Udag</h1>
            <p>Software Engineer / Web Developer 💻</p>
            <SpecialButton/>
        </div>
    </div>
</template>

<script>
    import SpecialButton from '../components/button/specialButton'
    import Particles from '~/components/particles.vue';
    export default {
        name: 'Hero',
        components: { SpecialButton, Particles },
        mounted() {
        },
    }
</script>
<style scoped>
</style>