<template>
  <div 
    class="cursor" 
    :class="{ hovered }" 
    :style="{ transform: `translate(${x}px, ${y}px)` }">
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Reactive state for cursor position
const x = ref(0);
const y = ref(0);

// State to track if the cursor is hovering over an interactive element
const hovered = ref(false);

// Update cursor position based on mouse movements
const handleMouseMove = (event) => {
  x.value = event.clientX;
  y.value = event.clientY;
};

// Detect when entering or leaving interactive elements
const addHoverEffect = () => (hovered.value = true);
const removeHoverEffect = () => (hovered.value = false);

onMounted(() => {
  // Listen to global mouse movements
  window.addEventListener("mousemove", handleMouseMove);

  // Add hover listeners to interactive elements
  document.querySelectorAll("a, button, .hover-pointer").forEach((element) => {
    element.addEventListener("mouseenter", addHoverEffect);
    element.addEventListener("mouseleave", removeHoverEffect);
  });
});

onUnmounted(() => {
  // Clean up listeners when component is destroyed
  window.removeEventListener("mousemove", handleMouseMove);
  document.querySelectorAll("a, button, .hover-pointer").forEach((element) => {
    element.removeEventListener("mouseenter", addHoverEffect);
    element.removeEventListener("mouseleave", removeHoverEffect);
  });
});
</script>