<template>
    <div class="hero">
        <Particles />
        <div class="content">
            <p>I am..</p>
            <h1>Alexander Udag</h1>
            <h2 class="headline">Turning Ideas into Interactive Web Solutions</h2>
            <small>Software Engineer / Web Developer 💻</small>
            <SpecialButton/>
        </div>
    </div>
</template>

<script setup>
    import SpecialButton from '~/components/button/specialButton.vue';
    import Particles from '~/components/particles.vue';
</script>