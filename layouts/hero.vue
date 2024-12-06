<template>
    <div class="hero">
        <Particles />
        <div class="content">
            <p>I am..</p>
            <h1>Alexander Udag</h1>
            <p>Software Engineer / Web Developer 💻</p>
            <SpecialButton/>
        </div>
    </div>
</template>

<script setup>
    import SpecialButton from '~/components/button/specialButton.vue';
    import Particles from '~/components/particles.vue';
</script>