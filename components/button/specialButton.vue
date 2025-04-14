<template>
    <div class="button-container hover-pointer">
        <p>{{ buttonText }}</p>
    </div>
</template>

<script setup>
    import myResume from '~/assets/pdfs/resume.pdf'
    import { downloadPDF } from '~/utls/download';

    const props = defineProps({
        buttonText: {
            type: String,
            default: ''
        }
    })
</script>