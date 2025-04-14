<template>
  <div class="error-wrapper">
    <div class="text-center">
      <h1 class="head-message">Oops!</h1>
      <p class="error-message">{{ error.statusCode }} - {{ error.message }}</p>
      <NuxtLink to="/" class="back">
        <SpecialButton buttonText="Back to home"/>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
  import SpecialButton from '~/components/button/specialButton.vue';

  defineProps({
    error: Object
  })
</script>
