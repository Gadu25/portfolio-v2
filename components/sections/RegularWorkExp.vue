<template>
  <section class="regular-work">
    <div class="regular-work__container">
      <h4>Experience <span class="item-count">({{ works.length }})</span></h4>
      <RegularCard :works="works" />
    </div>
  </section>
</template>

<script setup lang="ts">
import workexp from '~/data/workexp'
import RegularCard from '~/components/card/RegularCard.vue'
import type { Experience } from '~/types/megome'

const { getExperiences } = useMegome()
const works = ref<Experience[]>(workexp)

onMounted(async () => {
  try {
    const apiWorks = await getExperiences()
    if (apiWorks && apiWorks.length > 0) {
      works.value = apiWorks
    }
  } catch (e) {
    console.error('Failed to fetch experiences:', e)
  }
})
</script>
