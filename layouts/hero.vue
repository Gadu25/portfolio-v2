<template>
    <div class="hero">
        <Particles />
        <div class="content">
            <img src="~/assets/images/memoji/mac.webp" alt="Alex on mac"/>
            <h1>{{ profile ? `${profile.firstName} ${profile.lastName}` : 'Alexander Udag' }}</h1>
            <h2 class="headline">{{ profile?.tagline || 'Turning Ideas into Interactive Web Solutions' }}</h2>
            <small>{{ profile?.title || 'Software Engineer / Web Developer' }}</small>
            <SpecialButton class="special-button" buttonText="My Resume"  @click="downloadPDF(myResume, 'Alexander Udag')"/>
        </div>
    </div>
</template>

<script setup>
    import SpecialButton from '~/components/button/specialButton.vue';
    import Particles from '~/components/particles.vue';
    import myResume from '~/assets/pdfs/resume.pdf';

    import { downloadPDF } from '~/utls/download';

    const { getProfile } = useProfile()
    const profile = ref(null)

    onMounted(async () => {
      try {
        profile.value = await getProfile()
      } catch (e) {
        console.error('Failed to fetch profile:', e)
      }
    })
</script>
