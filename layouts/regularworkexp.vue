<template>
    <div class="regular-work-exp">
        <div class="content">
            <h4>Experience <span class="item-count">({{ works.length }})</span></h4>
            <RegularCard/>
        </div>
    </div>
</template>

<script setup>
    // FIX ME: Replace with getExperiences() from useMegome once role descriptions and tech icons are available via API
    import RegularCard from '~/components/card/regularCard.vue';
    import workexp from '~/data/workexp';

    const works = ref(workexp)
</script>