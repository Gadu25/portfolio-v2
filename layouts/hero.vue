<template>
    <div class="hero">
        <div class="content">
            <p>I am..</p>
            <h1>ALEXANDER UDAG</h1>
            <p>Software Engineer / Web Developer 💻</p>
            <SpecialButton/>
        </div>
    </div>
</template>

<script>
    import SpecialButton from '../components/button/specialButton'
    export default {
        name: 'Hero',
        components: { SpecialButton }
    }
</script>