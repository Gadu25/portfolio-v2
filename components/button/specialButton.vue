<template>
    <div class="button-container hover-pointer" @click="downloadPDF()">
        <p>My Resume</p>
    </div>
</template>

<script>
    import myResume from '~/assets/pdfs/resume.pdf'

    export default {
        name: 'SpecialButton',
        methods: {
            downloadPDF(){
                const fileUrl = myResume;
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = 'AlexanderUdag.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
</script>