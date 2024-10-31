<template>
    <div class="footer">
        <div class="content">
            <div class="col">
                <p>© {{ year }} All Rights Reserved</p>
            </div>
            <div class="col">
                <a href="https://www.linkedin.com/in/alexander-udag/" target="_blank">
                    <i class="fa-brands fa-linkedin-in hover-pointer"></i>
                </a>
                <a href="https://github.com/Gadu25" target="_blank">
                    <i class="fa-brands fa-github hover-pointer"></i>
                </a>
                <a href="https://www.instagram.com/dagzue" target="_blank">
                    <i class="fa-brands fa-instagram hover-pointer"></i>
                </a>
                <a href="https://facebook.com/udagz" target="_blank">
                    <i class="fa-brands fa-facebook-f hover-pointer"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'footer',
        data() {
            return {
                year: '2024'
            }
        }
    }
</script>