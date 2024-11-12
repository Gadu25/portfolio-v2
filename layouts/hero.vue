<template>
    <div class="hero">
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
    export default {
        name: 'Hero',
        components: { SpecialButton },
        mounted() {
            // Make sure Lottie is loaded from the CDN
            if (typeof window !== 'undefined' && window.lottie) {
            window.lottie.loadAnimation({
                container: this.$refs.lottieContainer, // The DOM element to render the animation
                renderer: 'svg', // You can also use 'canvas' or 'html'
                loop: true, // Whether to loop the animation
                autoplay: true, // Autoplay the animation on load
                path: 'https://lottie.host/6a253a45-361e-42e0-bcc2-16abb1d54141/z4x30S26Kr.json', // Replace with your Lottie JSON URL or local path
            });
            }
        },
    }
</script>

<style scoped>
.lottie-animation {
  width: 300px; /* Customize size */
  height: 200px;
  margin: 0 auto;
}
</style>