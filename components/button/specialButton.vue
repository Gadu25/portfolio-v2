<template>
    <div class="button-container hover-pointer" @click="downloadPDF(myResume, 'Alexander Udag')">
        <p>My Resume</p>
    </div>
</template>

<script setup>
    import myResume from '~/assets/pdfs/resume.pdf'
    import { downloadPDF } from '~/utls/download';
</script>