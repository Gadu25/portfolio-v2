<template>
    <div>
        <Analytics />
        <Hero/>
        <AboutMe/>
        <TechStacks/>
        <WorkExp/>
    </div>
</template>

<script setup="ts">
    import Hero from '../layouts/hero'
    import AboutMe from '../layouts/aboutme.vue';
    import TechStacks from '~/layouts/techstacks.vue';
    import WorkExp from '~/layouts/workexp.vue';
    import { Analytics } from '@vercel/analytics/nuxt';
    import ogImage from '~/assets/images/memoji/sofaChill.webp';

    useSeoMeta({
        description: 'Creative software engineer crafting responsive and high-performing web applications.',
        ogTitle: 'Alexander Udag – Web Developer Portfolio',
        ogDescription: 'Explore the portfolio of Alexander Udag, a frontend-focused fullstack developer passionate about Vue, Nuxt, and modern web technologies.',
        ogImage: ogImage,
        ogUrl: 'https://alexander-udag.vercel.app/',
        twitterTitle: 'Alexander Udag – Web Developer Portfolio',
        twitterDescription: 'Creative web developer with a knack for clean design and optimized code.',
        twitterImage: ogImage,
        twitterCard: 'summary'
    })

    useHead({
        htmlAttrs: { lang: 'en' },
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    })
</script>