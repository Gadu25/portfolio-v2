<template>
    <section class="work-exp">
        <div class="content">
            <h3>Work Experience</h3>
            <SwipingCards/>
        </div>
    </section>
</template>

<script>
    import SwipingCards from '~/components/card/swipingCards.vue';
    export default {
        name: 'WorkExp',
        components: { SwipingCards }
        
    }
</script>