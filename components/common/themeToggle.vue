<template>
    <div class="theme-toggle-container" @click="clickToggle">
        <div class="toggle-circle" :class="theme"></div>
    </div>
</template>

<script setup lang="ts">
    import { useTheme } from '@/composables/useTheme'
    const { theme, toggleTheme } = useTheme()

    const clickToggle = () => {
        console.log("clicked")
        toggleTheme()
    }

    defineOptions({
        name: 'ThemeToggle'
    })
</script>