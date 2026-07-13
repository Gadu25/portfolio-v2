<template>
  <div id="particles-js" />
</template>

<script setup lang="ts">
onMounted(() => {
  const script = document.createElement('script')
  script.src = '/js/particles.js'
  script.onload = () => {
    window.particlesJS.load('particles-js', '/particles-config.json', () => {})
  }
  script.onerror = () => {
    console.error('Failed to load particles.js')
  }
  document.head.appendChild(script)
})
</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
