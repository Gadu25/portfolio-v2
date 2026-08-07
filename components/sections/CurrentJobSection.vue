<template>
  <section class="current-job" data-aos="fade-up">
    <div class="current-job__container">
      <template v-if="status === 'pending'">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading experience...</p>
        </div>
      </template>
      <template v-else>
        <div class="current-job__card">
          <div class="current-job__logo">
            <img v-if="currentJob.logo" :src="currentJob.logo" :alt="currentJob.company + '-logo'" />
          </div>
          <div class="current-job__details">
            <h4 class="text-secondary">Current Role</h4>
            <h3>{{ currentJob.company }}</h3>
            <p class="current-job__title">{{ currentJob.title }}</p>
            <small class="text-secondary">
              Since {{ formatDate(currentJob.startDate) }}
              <i> ({{ getStayDuration({ start: currentJob.startDate, end: currentJob.endDate }) }})</i>
            </small>
            <p class="current-job__excerpt">{{ stripHtml(currentJob.description, 150) }}</p>
            <NuxtLink to="/work" class="current-job__link">
              View Full Experience &rarr;
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Experience } from '~/types/megome'
import workexp from '~/data/workexp'

const { getExperiences } = useMegome()
const { getStayDuration } = useStayDuration()
const { formatDate } = useFormatDate()

const { data: rawExperiences, status } = await useCachedAsyncData('experiences', () => getExperiences())

const currentJob = computed(() => {
  const source = rawExperiences.value && rawExperiences.value.length > 0 ? rawExperiences.value : workexp
  return source.find((e: Experience) => e.isPresent) || source[0] || { company: '', title: '', logo: null, startDate: '', endDate: null, description: '' }
})

const stripHtml = (html: string, maxLen: number): string => {
  const text = html.replace(/<[^>]*>/g, '')
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}
</script>
