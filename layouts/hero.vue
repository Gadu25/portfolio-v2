<template>
    <div class="hero">
        <Particles />
        <div class="content">
            <img src="~/assets/images/memoji/mac.webp" alt="Alex on mac"/>
            <!-- <p>I am..</p> -->
            <h1>Alexander Udag</h1>
            <h2 class="headline">Turning Ideas into Interactive Web Solutions</h2>
            <small>Software Engineer / Web Developer 💻</small>
            <SpecialButton class="special-button" buttonText="My Resume"  @click="downloadPDF(myResume, 'Alexander Udag')"/>
        </div>
    </div>
</template>

<script setup>
    import SpecialButton from '~/components/button/specialButton.vue';
    import Particles from '~/components/particles.vue';
    import myResume from '~/assets/pdfs/resume.pdf';

    import { downloadPDF } from '~/utls/download';
</script>