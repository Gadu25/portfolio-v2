<template>
  <section class="regular-work">
    <div class="regular-work__container">
      <h4>Experience <span v-if="status !== 'pending'" class="item-count">({{ works.length }})</span></h4>
      <RegularCard :works="works" :loading="status === 'pending'" />
    </div>
  </section>
</template>

<script setup lang="ts">
import workexp from '~/data/workexp'
import RegularCard from '~/components/card/RegularCard.vue'

const { getExperiences } = useMegome()

const { data: works, status } = await useCachedAsyncData('experiences', () => getExperiences(), {
  default: () => workexp
})
</script>
