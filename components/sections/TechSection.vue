<template>
  <section class="tech">
    <div class="tech__container">
      <h3>Technologies</h3>
      <div class="tech__grid">
        <span
          v-for="item in techs"
          :key="item.name"
          class="tech__item"
        >
          <small>{{ item.name }}</small>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import techstacks from '~/data/techs'

const techs = techstacks
</script>
