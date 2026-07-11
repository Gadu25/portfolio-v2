<template>
    <div class="swiping-cards" data-aos="fade-down">
        <div class="contents">
            <div class="swiper-controls">
                <div class="control-wrapper">
                    <div class="swiper-left hover-pointer" @click="handlePrev()">
                        <i class="fa fa-chevron-left"></i>
                    </div>
                    <div class="swiper-right hover-pointer" @click="handleNext()">
                        <i class="fa fa-chevron-right"></i>
                    </div>
                </div>
            </div>
            <template v-for="(card, index) in cards">
                <div class="card-wrapper" :class="card.position"
                    @mousemove="(event) => handleMouseMove(event, card.position)"
                    @mouseleave="(event) => resetTilt(event, card.position)">
                    <div class="card hover-pointer" @click="clickCard(index)">
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
                        </div>
                    </div>
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
const cards = ref(workexp.map((card, i) => ({
    ...card,
    position: i === 0 ? 'active' : i === 1 ? 'right' : 'left'
})))

onMounted(async () => {
    try {
        const apiCards = await getExperiences()
        if (apiCards && apiCards.length > 0) {
            cards.value = apiCards.map((card, i) => ({
                ...card,
                position: i === 0 ? 'active' : i === 1 ? 'right' : 'left'
            }))
        }
    } catch (e) {
        console.error('Failed to fetch experiences:', e)
    }
})

const clickCard = (index) => {
    let active = index
    let left = (active - 1) < 0 ? (cards.value.length - 1) : (active - 1)
    let right = (active + 1) > (cards.value.length - 1) ? 0 : (active + 1)

    for (let i = 0; i < cards.value.length; i++) {
        if (i == active) {
            cards.value[i].position = 'active'
        } else if (i == left) {
            cards.value[i].position = 'left'
        } else if (i == right) {
            cards.value[i].position = 'right'
        } else {
            cards.value[i].position = 'none'
        }
    }
}

const handleNext = () => {
    let activeIndex = 0
    for (let i = 0; i < cards.value.length; i++) {
        if (cards.value[i].position == 'active') {
            activeIndex = i >= (cards.value.length - 1) ? 0 : i + 1
        }
    }

    let active = activeIndex
    let left = (active - 1) < 0 ? (cards.value.length - 1) : (active - 1)
    let right = (active + 1) > (cards.value.length - 1) ? 0 : (active + 1)

    for (let i = 0; i < cards.value.length; i++) {
        if (i == active) {
            cards.value[i].position = 'active'
        } else if (i == left) {
            cards.value[i].position = 'left'
        } else if (i == right) {
            cards.value[i].position = 'right'
        } else {
            cards.value[i].position = 'none'
        }
    }
}

const handlePrev = () => {
    let activeIndex = 0
    for (let i = 0; i < cards.value.length; i++) {
        if (cards.value[i].position == 'active') {
            activeIndex = i <= 0 ? (cards.value.length - 1) : i - 1
        }
    }

    let active = activeIndex
    let left = (active - 1) < 0 ? (cards.value.length - 1) : (active - 1)
    let right = (active + 1) > (cards.value.length - 1) ? 0 : (active + 1)

    for (let i = 0; i < cards.value.length; i++) {
        if (i == active) {
            cards.value[i].position = 'active'
        } else if (i == left) {
            cards.value[i].position = 'left'
        } else if (i == right) {
            cards.value[i].position = 'right'
        } else {
            cards.value[i].position = 'none'
        }
    }
}

const handleMouseMove = (event) => {
    const card = event.currentTarget.querySelector('.card');
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (centerY - y) / 50;
    const rotateY = (x - centerX) / 50;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

const resetTilt = (event) => {
    const card = event.currentTarget.querySelector('.card');
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
}
</script>
