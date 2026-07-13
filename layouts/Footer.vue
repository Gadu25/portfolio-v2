<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__col">
        <p class="text-secondary">&copy; {{ currentYear }} All Rights Reserved</p>
      </div>
      <div class="footer__col">
        <div class="footer__contact">
          <div class="footer__get-in-touch">
            <img
              class="footer__call-memoji"
              src="~/assets/images/memoji/call.webp"
              alt="Alex call memoji"
            />
            <p>Get in Touch |</p>
          </div>
          <div class="footer__socials">
            <a
              href="https://www.linkedin.com/in/alexander-udag/"
              target="_blank"
              aria-label="Visit my LinkedIn profile"
            >
              <i class="fa-brands fa-linkedin-in hover-pointer" />
            </a>
            <a
              href="https://github.com/Gadu25"
              target="_blank"
              aria-label="Visit my GitHub profile"
            >
              <i class="fa-brands fa-github hover-pointer" />
            </a>
            <a
              href="https://www.instagram.com/dagzue"
              target="_blank"
              aria-label="Visit my Instagram profile"
            >
              <i class="fa-brands fa-instagram hover-pointer" />
            </a>
            <a
              href="https://facebook.com/udagz"
              target="_blank"
              aria-label="Visit my Facebook profile"
            >
              <i class="fa-brands fa-facebook-f hover-pointer" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { getCurrentYear } from '~/utils/date/currentYear'

const currentYear = getCurrentYear()
</script>
