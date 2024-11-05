<template>
    <div>
        <Cursor/>
        <Navigation @navigate="setDirection" :isScrolled="isScrolled"/>
        <!-- <transition> -->
            <NuxtPage :transition="{
                name: transitionDirection,
                mode: 'out-in'
            }" />  <!-- Only the NuxtPage here -->
        <!-- </transition> -->
        <Foot/>
    </div>
</template>

<script>
    import Cursor from '~/components/cursor.vue';
    import Navigation from './navigation.vue';
    import Foot from './footer.vue';
    
    import AOS from 'aos';
    import 'aos/dist/aos.css';

    export default {
        components: { Cursor, Navigation, Foot},
        data() {
            return {
                isScrolled: false,
                transitionDirection: 'swipe-right'
            };
        },
        methods: {
            setDirection(direction) {
                this.transitionDirection = direction; // Set the direction based on navigation
            },
            handleScroll() {
                this.isScrolled = window.scrollY > 0;
            },
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll),
            AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
            })
        },
    }
</script>

<style>
    .swipe-right-enter-active,
    .swipe-right-leave-active,
    .swipe-left-enter-active,
    .swipe-left-leave-active {
        transition: all 0.4s;
    }

    .swipe-right-enter-from {
        transform: translateX(100%); 
    }

    .swipe-right-leave-active {
        transform: translateX(0); 
    }

    .swipe-right-leave-to {
        transform: translateX(-100%);
    }

    .swipe-left-enter-from {
        transform: translateX(-100%);
    }
    .swipe-left-leave-to {
        transform: translateX(100%);
    }
</style>