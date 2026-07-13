<template>
    <button
        class="theme-toggle"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
    >
        <span class="theme-toggle__track">
            <span class="theme-toggle__thumb" :class="theme"></span>
        </span>
    </button>
</template>

<script setup lang="ts">
    import { useTheme } from '@/composables/useTheme'
    const { theme, toggleTheme } = useTheme()

    defineOptions({
        name: 'ThemeToggle'
    })
</script>
