<template>
  <section class="hero">
    <div class="hero__content">
      <template v-if="status === 'pending'">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </template>
      <template v-else>
        <h1 class="hero__name">
          {{ profile ? `${profile.firstName} ${profile.lastName}` : 'Alexander Udag' }}
        </h1>
        <p class="hero__title">
          {{ profile?.title || 'Software Engineer / Web Developer' }}
        </p>
        <small class="hero__tagline">
          {{ profile?.tagline || 'Turning Ideas into Interactive Web Solutions' }}
        </small>
        <SpecialButton
          class="hero__cta"
          button-text="My Resume"
          @click="showConfirm = true"
        />
        <ConfirmDialog
          v-model="showConfirm"
          message="Would you like to download my resume?"
          @confirm="downloadPDF(myResume, 'Alexander Udag')"
        />
      </template>
    </div>
    <a
      :class="{ 'hero__scroll--hidden': scrolled }"
      href="#about"
      class="hero__scroll"
      aria-label="Scroll down"
    >
      <small>&darr;</small>
    </a>
  </section>
</template>

<script setup lang="ts">
import SpecialButton from '~/components/button/SpecialButton.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import myResume from '~/assets/pdfs/resume.pdf'
import { downloadPDF } from '~/utils/download'

const { getProfile } = useMegome()
const showConfirm = ref(false)
const scrolled = ref(false)

const onScroll = () => {
  scrolled.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const { data: profile, status } = await useCachedAsyncData('profile', () => getProfile())
</script>
