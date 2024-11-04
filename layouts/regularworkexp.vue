<template>
    <div class="regular-work-exp">
        <div class="content">
            <h3>Experience</h3>
            <RegularCard/>
        </div>
    </div>
</template>

<script>
    import RegularCard from '~/components/card/regularCard.vue';
    export default {
        name: 'RegularWorkExp',
        components: {
            RegularCard
        }
    }
</script>