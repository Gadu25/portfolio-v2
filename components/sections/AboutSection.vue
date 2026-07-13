<template>
  <section class="about">
    <div class="about__container">
      <div class="about__text" data-aos="fade-up">
        <div class="about__heading">
          <h3>About Me</h3>
          <img
            class="about__memoji"
            src="~/assets/images/memoji/hi.webp"
            alt="Alex waving"
          />
        </div>
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
      </div>
      <div class="about__images" data-aos="fade-left">
        <div
          class="about__image-wrapper hover-pointer"
          @mousemove="handleMouseMove"
          @mouseleave="resetTilt"
        >
          <img src="~/assets/images/day.webp" alt="Alex during the day" />
        </div>
        <div
          class="about__image-wrapper hover-pointer"
          @mousemove="handleMouseMove"
          @mouseleave="resetTilt"
        >
          <img src="~/assets/images/night.webp" alt="Alex at night" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Profile } from '~/types/megome'

const { getProfile } = useMegome()
const profile = ref<Profile | null>(null)

onMounted(async () => {
  try {
    profile.value = await getProfile()
  } catch (e) {
    console.error('Failed to fetch profile:', e)
  }
})

const handleMouseMove = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const card = target.querySelector('img') as HTMLElement
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (centerY - y) / 20
  const rotateY = (x - centerX) / 20

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

const resetTilt = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const card = target.querySelector('img') as HTMLElement
  if (!card) return
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
}
</script>
