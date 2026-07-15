<template>
  <div>
    <RegularWorkExp />
    <Certifications />
  </div>
</template>

<script setup lang="ts">
import RegularWorkExp from '~/components/sections/RegularWorkExp.vue'
import Certifications from '~/components/sections/Certifications.vue'
import ogImage from '~/assets/images/memoji/hired.webp'

useSeoMeta({
  description: 'Explore the work experience and certifications of Alexander Udag, a software engineer passionate about modern web technologies.',
  ogTitle: 'Work Experience & Certifications – Alexander Udag',
  ogDescription: "Get to know Alexander's professional journey through his job experiences and technical certifications.",
  ogImage,
  ogUrl: 'https://alexander.udaglab.com/work',
  twitterTitle: 'Work Experience & Certifications – Alexander Udag',
  twitterDescription: 'A look into Alexander Udag\'s software development career and recognized certifications.',
  twitterImage: ogImage,
  twitterCard: 'summary',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', type: 'image/webp', href: '/favicon.webp' }],
})
</script>
