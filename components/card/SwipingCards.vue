<template>
    <div class="swiping-cards" data-aos="fade-down">
        <div class="contents">
            <template v-if="status === 'pending'">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading experience...</p>
                </div>
            </template>
            <template v-else>
                <template v-for="(card, index) in cards" :key="index">
                    <div class="card-wrapper" :class="card.position"
                        @click="clickCard(index)">
                        <div class="card"
                            @mousemove="handleMouseMove"
                            @mouseleave="resetTilt">
                            <div class="company-wrapper">
                                <div class="company-title">
                                    <div class="company-logo">
                                        <img v-if="card.logo" :src="card.logo" :alt="card.company+'-logo'"/>
                                    </div>
                                    <div class="company-name">
                                        <h4>{{ card.company }}</h4>
                                    </div>
                                </div>
                                <div class="my-role">
                                    <h4>{{ card.title }}</h4>
                                    <small class="text-secondary">{{ formatDate(card.startDate) }} - {{ card.isPresent ? 'present' : formatDate(card.endDate) }} <i> ({{ getStayDuration({ start: card.startDate, end: card.endDate }) }})</i></small>
                                </div>
                                <div class="role-tasks">
                                    <div v-html="card.description"></div>
                                </div>
                                <div class="card-actions">
                                    <NuxtLink :to="'/experience/'+card.id+'?from=work'" class="view-details hover-pointer" @click.stop>
                                        <small>View Details <i class="fa fa-chevron-right"></i></small>
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="swiper-controls">
                    <button class="swiper-btn hover-pointer" @click="handlePrev()" aria-label="Previous experience">
                        <i class="fa fa-chevron-left"></i>
                    </button>
                    <span class="swiper-counter">{{ activeIndex + 1 }} / {{ cards.length }}</span>
                    <button class="swiper-btn hover-pointer" @click="handleNext()" aria-label="Next experience">
                        <i class="fa fa-chevron-right"></i>
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import workexp from '~/data/workexp';
import { useStayDuration } from "~/composables/useStayDuration";

const { getStayDuration } = useStayDuration();
const { formatDate } = useFormatDate();
const { getExperiences } = useMegome();

const { data: rawCards, status } = await useCachedAsyncData('swiping-experiences', () => getExperiences())

const cards = ref([])

watch(rawCards, (newRawCards) => {
    const source = newRawCards && newRawCards.length > 0 ? newRawCards : workexp
    cards.value = source.map((card, i) => ({
        ...card,
        position: i === 0 ? 'active' : i === 1 ? 'right' : i === 2 ? 'left' : 'none'
    }))
}, { immediate: true })

const activeIndex = computed(() => {
    const idx = cards.value.findIndex(c => c.position === 'active')
    return idx >= 0 ? idx : 0
})

const setPositions = (active) => {
    const len = cards.value.length
    const left = (active - 1) < 0 ? len - 1 : active - 1
    const right = (active + 1) > len - 1 ? 0 : active + 1

    cards.value = cards.value.map((card, i) => ({
        ...card,
        position: i === active ? 'active' : i === left ? 'left' : i === right ? 'right' : 'none'
    }))
}

const clickCard = (index) => {
    setPositions(index)
}

const handleNext = () => {
    const current = activeIndex.value
    const next = current >= (cards.value.length - 1) ? 0 : current + 1
    setPositions(next)
}

const handlePrev = () => {
    const current = activeIndex.value
    const prev = current <= 0 ? cards.value.length - 1 : current - 1
    setPositions(prev)
}

const handleMouseMove = (event) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (centerY - y) / 50
    const rotateY = (x - centerX) / 50

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

const resetTilt = (event) => {
    event.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
}
</script>
