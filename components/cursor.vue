<template>
    <div class="cursor" :style="{ transform: `translate(${x}px, ${y}px)` }"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const x = ref(0);
  const y = ref(0);
  
  // Throttle function
  const throttle = (callback, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(...args);
      }
    };
  };
  
  // Handle mouse movement
  const handleMouseMove = throttle((event) => {
    x.value = event.clientX;
    y.value = event.clientY;
  }, 16); // Throttle to about 60 FPS
  
  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
  });
  </script>