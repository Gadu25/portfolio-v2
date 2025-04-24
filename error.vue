<template>
  <div class="error-wrapper">
    <div class="display-image">
      <img src="~/assets/images/memoji/404.webp" alt="Error Image" class="error-image" />
    </div>
    <div class="text-center">
      <h1 class="head-message">{{ error.statusCode }}</h1>
      <p class="error-message">{{ error.message }}</p>
      <NuxtLink to="/" class="back">
        <SpecialButton buttonText="Go back"/>
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
