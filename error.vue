<template>
  <div class="error-wrapper">
    <div class="display-image">
      <img
        src="~/assets/images/memoji/404.webp"
        alt="Error Image"
        class="error-image"
      />
    </div>
    <div class="text-center">
      <h1 class="head-message">{{ error.statusCode }}</h1>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/" class="back">
        <SpecialButton button-text="Go back" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpecialButton from '~/components/button/SpecialButton.vue'

defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()
</script>
