<template>
  <div class="layout">
    <Cursor />
    <Navigation @navigate="setDirection" :is-scrolled="isScrolled" />
    <NuxtPage :transition="{ name: transitionDirection, mode: 'out-in' }" />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/layouts/Navigation.vue'
import FooterSection from '~/layouts/Footer.vue'
import Cursor from '~/components/Cursor.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const isScrolled = ref(false)
const transitionDirection = ref('swipe-right')

const setDirection = (direction: string) => {
  transitionDirection.value = direction
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
  })
})
</script>

<style scoped>
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
