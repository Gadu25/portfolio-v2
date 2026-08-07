<template>
  <section id="about" class="about">
    <div class="about__container">
      <div class="about__text" data-aos="fade-up">
        <div class="about__heading">
          <h3>About</h3>
        </div>
        <template v-if="status === 'pending'">
          <div class="loading">
            <div class="spinner"></div>
            <p>Loading about...</p>
          </div>
        </template>
        <template v-else>
          <div v-if="profile?.bio" v-html="profile.bio" class="about__bio" />
          <template v-else>
            <p>
              Hi there! I'm Alexander Udag, a web developer enthusiastic about
              coding and continuous improvement. I work with
              <strong>JavaScript</strong>, <strong>HTML</strong>,
              <strong>CSS</strong>, <strong>Python</strong>, and
              <strong>PHP</strong> to create modern, scalable web applications.
            </p>
            <p>
              My skill set includes frameworks like <strong>Vue</strong>,
              <strong>React</strong>, and <strong>Laravel</strong>, as well as
              database management with <strong>MySQL</strong> and
              <strong>PostgreSQL</strong>. I enjoy learning new things, overcoming
              challenges, and growing both personally and professionally. For me,
              coding is not just about delivering results — it's about crafting
              solutions I can be proud of.
            </p>
          </template>
        </template>
      </div>
      <div class="about__images" data-aos="fade-left">
        <div class="about__image-wrapper">
          <img src="~/assets/images/me.webp" alt="Alex at night" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { getProfile } = useMegome()

const { data: profile, status } = await useCachedAsyncData('profile', () => getProfile())
</script>
