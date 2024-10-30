<template>
  <div
    class="cursor"
    :class="{ hovered, clicked }"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Reactive state for cursor position
const x = ref(0);
const y = ref(0);

// States for hover and click animations
const hovered = ref(false);
const clicked = ref(false);

// Update cursor position on mouse move
const handleMouseMove = (event) => {
  x.value = event.clientX;
  y.value = event.clientY;
};

// Add and remove hover effect
const addHoverEffect = () => (hovered.value = true);
const removeHoverEffect = () => (hovered.value = false);

// Handle click animation
const handleClick = () => {
  clicked.value = true; // Trigger click animation
  setTimeout(() => (clicked.value = false), 80); // Reset after 300ms
};

const handleHold = () => {
  clicked.value = true; // Trigger click animation
  // setTimeout(() => (clicked.value = false), 50); // Reset after 300ms
};

onMounted(() => {
  // Listen to global mouse movements
  window.addEventListener("mousemove", handleMouseMove);

  // Add hover and click listeners to interactive elements
  document.querySelectorAll("a, button, .hover-pointer").forEach((element) => {
    element.addEventListener("mouseenter", addHoverEffect);
    element.addEventListener("mouseleave", removeHoverEffect);
  });
  // element.addEventListener("click", handleClick);
  window.addEventListener("click", handleClick);
  window.addEventListener("mousedown", handleHold);
});

onUnmounted(() => {
  // Clean up listeners on component unmount
  window.removeEventListener("mousemove", handleMouseMove);

  document.querySelectorAll("a, button, .hover-pointer").forEach((element) => {
    element.removeEventListener("mouseenter", addHoverEffect);
    element.removeEventListener("mouseleave", removeHoverEffect);
    element.removeEventListener("click", handleClick);
  });
});
</script>
