<template>
    <div class="work-exp">
        <div class="content">
            <h3>Work Experience</h3>
            <SwipingCards/>
        </div>
    </div>
</template>

<script>
    import SwipingCards from '~/components/card/swipingCards.vue';
    export default {
        name: 'WorkExp',
        components: { SwipingCards }
        
    }
</script>