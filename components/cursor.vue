<template>
  <div class="cursor" :style="{ transform: `translate(${x}px, ${y}px)` }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const x = ref(0);
const y = ref(0);

// Handle mouse movement directly without throttling
const handleMouseMove = (event) => {
  x.value = event.clientX;
  y.value = event.clientY;
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>