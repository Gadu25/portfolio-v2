<template>
    <div>
        <RegularWorkExp/>
        <Certifications/>
    </div>
</template>

<script setup>
    import RegularWorkExp from '~/layouts/regularworkexp.vue';
    import Certifications from '~/layouts/certifications.vue';
    import ogImage from '~/assets/images/memoji/hired.webp';

    useSeoMeta({
        description: 'Explore the work experience and certifications of Alexander Udag, a software engineer passionate about modern web technologies.',
        ogTitle: 'Work Experience & Certifications – Alexander Udag',
        ogDescription: 'Get to know Alexander’s professional journey through his job experiences and technical certifications.',
        ogImage: ogImage,
        ogUrl: 'https://alexander-udag.vercel.app/work',
        twitterTitle: 'Work Experience & Certifications – Alexander Udag',
        twitterDescription: 'A look into Alexander Udag’s software development career and recognized certifications.',
        twitterImage: ogImage,
        twitterCard: 'summary'
    })

    useHead({
        htmlAttrs: { lang: 'en' },
        link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    })
</script>