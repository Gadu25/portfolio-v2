<template>
  <section class="hero">
    <Particles />
    <div class="hero__content">
      <template v-if="status === 'pending'">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </template>
      <template v-else>
        <img
          class="hero__avatar"
          src="~/assets/images/memoji/mac.webp"
          alt="Alex on mac"
        />
        <h1 class="hero__name">
          {{ profile ? `${profile.firstName} ${profile.lastName}` : 'Alexander Udag' }}
        </h1>
        <p class="hero__tagline">
          {{ profile?.tagline || 'Turning Ideas into Interactive Web Solutions' }}
        </p>
        <span class="hero__title">
          {{ profile?.title || 'Software Engineer / Web Developer' }}
        </span>
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
  </section>
</template>

<script setup lang="ts">
import SpecialButton from '~/components/button/SpecialButton.vue'
import ConfirmDialog from '~/components/common/ConfirmDialog.vue'
import Particles from '~/components/Particles.vue'
import myResume from '~/assets/pdfs/resume.pdf'
import { downloadPDF } from '~/utils/download'

const { getProfile } = useMegome()
const showConfirm = ref(false)

const { data: profile, status } = await useCachedAsyncData('profile', () => getProfile())
</script>
