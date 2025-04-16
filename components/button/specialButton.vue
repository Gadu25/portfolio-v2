<template>
    <div class="button-container hover-pointer">
        <p>{{ buttonText }}</p>
    </div>
</template>

<script setup>
    const props = defineProps({
        buttonText: {
            type: String,
            default: ''
        }
    })
</script>