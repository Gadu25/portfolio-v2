<template>
  <section class="regular-work">
    <div class="regular-work__container">
      <h4>Experience <span v-if="!loading" class="item-count">({{ works.length }})</span></h4>
      <RegularCard :works="works" :loading="loading" />
    </div>
  </section>
</template>

<script setup lang="ts">
import workexp from '~/data/workexp'
import RegularCard from '~/components/card/RegularCard.vue'
import type { Experience } from '~/types/megome'

const { getExperiences } = useMegome()
const works = ref<Experience[]>(workexp)
const loading = ref(true)

onMounted(async () => {
  try {
    const apiWorks = await getExperiences()
    if (apiWorks && apiWorks.length > 0) {
      works.value = apiWorks
    }
  } catch (e) {
    console.error('Failed to fetch experiences:', e)
  } finally {
    loading.value = false
  }
})
</script>
