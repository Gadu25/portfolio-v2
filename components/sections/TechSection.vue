<template>
  <section class="tech">
    <div class="tech__container">
      <h3>Tech Experience</h3>
      <div class="tech__grid">
        <div
          v-for="item in techs"
          :key="item.name"
          class="tech__item"
          data-aos="fade-up"
        >
          <a
            class="tech__link hover-pointer"
            :href="item.link"
            target="_blank"
            :aria-label="`Visit ${item.name} website`"
          >
            <img :src="item.icon" :alt="`${item.name}-icon`" />
            <span class="tech__label">
              <small>{{ item.name }}</small>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import techstacks from '~/data/techs'

const techs = ref(techstacks)
</script>
