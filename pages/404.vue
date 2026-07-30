<template>
  <div class="error-wrapper">
    <h1 class="head-message">404</h1>
    <p class="error-message">Page not found</p>
    <NuxtLink to="/" class="back">
      <SpecialButton button-text="Go home" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import SpecialButton from '~/components/button/SpecialButton.vue'
</script>
