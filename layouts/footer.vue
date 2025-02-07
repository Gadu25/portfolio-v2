<template>
    <div class="footer">
        <div class="content">
            <div class="col">
                <p class="text-secondary">© {{ currentYear }} All Rights Reserved</p>
            </div>
            <div class="col">
                <div class="contact">
                    <div class="get-in-touch">
                        <img class="call" src="~/assets/images/memoji/call.webp" alt="Alex call memoji"/>
                        <p>Get in Touch |</p>
                    </div>
                    <div class="socials">
                        <a href="https://www.linkedin.com/in/alexander-udag/" target="_blank" aria-label="Visit my linkedIn profile">
                            <i class="fa-brands fa-linkedin-in hover-pointer"></i>
                        </a>
                        <a href="https://github.com/Gadu25" target="_blank" aria-label="Visit my Github profile">
                            <i class="fa-brands fa-github hover-pointer"></i>
                        </a>
                        <a href="https://www.instagram.com/dagzue" target="_blank" aria-label="Visit my instagram profile">
                            <i class="fa-brands fa-instagram hover-pointer"></i>
                        </a>
                        <a href="https://facebook.com/udagz" target="_blank" aria-label="Visit my facebook profile">
                            <i class="fa-brands fa-facebook-f hover-pointer"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { getCurrentYear } from '~/utls/date/currentYear';
    const currentYear = getCurrentYear();
</script>