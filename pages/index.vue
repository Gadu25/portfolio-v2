<template>
  <div>
    <Analytics />
    <HeroSection />
    <AboutSection />
    <TechSection />
    <WorkSection />
  </div>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import HeroSection from '~/components/sections/HeroSection.vue'
import AboutSection from '~/components/sections/AboutSection.vue'
import TechSection from '~/components/sections/TechSection.vue'
import WorkSection from '~/components/sections/WorkSection.vue'
import ogImage from '~/assets/images/memoji/sofaChill.webp'

useSeoMeta({
  description: 'Creative software engineer crafting responsive and high-performing web applications.',
  ogTitle: 'Alexander Udag – Web Developer Portfolio',
  ogDescription: 'Explore the portfolio of Alexander Udag, a frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies.',
  ogImage,
  ogUrl: 'https://alexander-udag.vercel.app/',
  twitterTitle: 'Alexander Udag – Web Developer Portfolio',
  twitterDescription: 'Creative web developer with a knack for clean design and optimized code.',
  twitterImage: ogImage,
  twitterCard: 'summary',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
})
</script>
