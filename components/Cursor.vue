<template>
  <div
    class="cursor"
    :class="{ hovered, clicked }"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
  />
</template>

<script setup lang="ts">
const x = ref(0)
const y = ref(0)
const hovered = ref(false)
const clicked = ref(false)

const handleMouseMove = (event: MouseEvent) => {
  x.value = event.clientX
  y.value = event.clientY
}

const addHoverEffect = () => (hovered.value = true)
const removeHoverEffect = () => (hovered.value = false)

const handleClick = () => {
  clicked.value = true
  setTimeout(() => (clicked.value = false), 80)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)

  document.querySelectorAll('a, button, .hover-pointer').forEach((element) => {
    element.addEventListener('mouseenter', addHoverEffect)
    element.addEventListener('mouseleave', removeHoverEffect)
  })

  window.addEventListener('click', handleClick)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)

  document.querySelectorAll('a, button, .hover-pointer').forEach((element) => {
    element.removeEventListener('mouseenter', addHoverEffect)
    element.removeEventListener('mouseleave', removeHoverEffect)
    element.removeEventListener('click', handleClick)
  })
})
</script>
