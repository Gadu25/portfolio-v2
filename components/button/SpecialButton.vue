<template>
  <div class="button-container hover-pointer">
    <p>{{ buttonText }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  buttonText?: string
}>()
</script>
