<template>
    <div class="work-exp">
        <div class="content">
            <h3>Work Experience</h3>
            <SwipingCards/>
        </div>
    </div>
</template>

<script setup>
    // FIX ME: Replace with getExperiences() from useMegome once role descriptions and tech icons are part of the API
    import SwipingCards from '~/components/card/swipingCards.vue';
</script>