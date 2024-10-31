<template>
    <div class="swiping-cards">
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
                                    <img :src="card.logo" />
                                </div>
                                <div class="company-name">
                                    <h4>{{ card.name }}</h4>
                                </div>
                            </div>
                            <div class="my-role">
                                <h4>{{ card.jobTitle }}</h4>
                                <small>{{ card.date }} <i v-if="card.duration.length > 0">. {{ card.duration
                                        }}</i></small>
                            </div>
                            <div class="role-tasks">
                                <ul>
                                    <template v-for="item in card.roles">
                                        <li>{{ item }}</li>
                                    </template>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import galaticLogo from '~/assets/images/galatic_logo.png'
import xtendlyLogo from '~/assets/images/xtendly_logo.png'
import seiLogo from '~/assets/images/sei_logo.webp'

export default {
    name: 'SwipingCards',
    data() {
        return {
            cards: [
                {
                    logo: galaticLogo,
                    name: 'Galatic Events',
                    jobTitle: 'Software Engineer',
                    date: '09/2024 - present',
                    duration: '',
                    roles: [
                        'Developed a comprehensive frontend component library using Vue.js and Nuxt to support a scalable and modular system architecture.',
                        'Utilized Storybook to document and showcase reusable components, ensuring consistent UI/UX across the application.',
                        'Crafted maintainable and responsive styles with SCSS, enhancing the design and adaptability of the frontend library.',
                        'Implemented end-to-end testing with Cypress to ensure reliability and seamless functionality across components.',
                        'Collaborated with cross-functional teams to integrate the frontend library effectively, enhancing development efficiency and consistency.'
                    ],
                    position: 'left'
                },
                {
                    logo: seiLogo,
                    name: 'DOST-SEI',
                    jobTitle: 'Full Stack Web Developer',
                    date: '03/2023 - 08/2024',
                    duration: '(1 year 8 months)',
                    roles: [
                        'Developed and maintained a comprehensive Project Management Information System (PMIS) using Vue.js, Bootstrap, and the Laravel framework.',
                        'Designed and implemented responsive layouts and UI components to enhance user experience across devices.',
                        'Created and managed RESTful APIs to support data integration and communication between frontend and backend systems.',
                        'Handled database management and optimization with MySQL, ensuring data integrity and efficient access across the system.',
                        'Conducted thorough testing and debugging to ensure reliability and performance of the PMIS application.',
                        'Delivered project presentations and demonstrations to stakeholders, showcasing system features and addressing feedback.'
                    ],
                    position: 'active'
                },
                {
                    logo: xtendlyLogo,
                    name: 'Xtendly Philippines Inc.',
                    jobTitle: 'Junior Frontend Web Developer',
                    date: '07/2022 - 02/2023',
                    duration: '(7 months)',
                    roles: [
                        'Designed and implemented responsive web pages using React, Next.js, Tailwind, and Bootstrap, ensuring cross-device compatibility and optimal user experience.',
                        'Developed client-side logic in JavaScript, enhancing interactivity and functionality on web applications.',
                        'Collaborated with the design team to translate UI/UX requirements into high-quality, user-friendly interfaces.',
                        'Optimized page load performance and improved SEO by applying Next.js optimizations and best practices.',
                        'Handled backend tasks, including managing databases with MySQL and creating RESTful APIs using the Laravel framework.',
                        'Streamlined front-to-back communication by integrating frontend components with backend APIs, enhancing data flow and usability.'
                    ],
                    position: 'right'
                }
            ]
        }
    },
    methods: {
        clickCard(index) {
            let active = index
            let left = (active - 1) < 0 ? (this.cards.length - 1) : (active - 1)
            let right = (active + 1) > (this.cards.length - 1) ? 0 : (active + 1)

            for (let i = 0; i < this.cards.length; i++) {
                if (i == active) {
                    this.cards[i].position = 'active'
                } else if (i == left) {
                    this.cards[i].position = 'left'
                } else if (i == right) {
                    this.cards[i].position = 'right'
                } else {
                    this.cards[i].position = 'none'
                }
            }
        },
        handleNext() {
            let activeIndex = 0
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].position == 'active') {
                    activeIndex = i >= (this.cards.length - 1) ? 0 : i + 1
                }
            }

            let active = activeIndex
            let left = (active - 1) < 0 ? (this.cards.length - 1) : (active - 1)
            let right = (active + 1) > (this.cards.length - 1) ? 0 : (active + 1)

            for (let i = 0; i < this.cards.length; i++) {
                if (i == active) {
                    this.cards[i].position = 'active'
                } else if (i == left) {
                    this.cards[i].position = 'left'
                } else if (i == right) {
                    this.cards[i].position = 'right'
                } else {
                    this.cards[i].position = 'none'
                }
            }
        },
        handlePrev() {
            let activeIndex = 0
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].position == 'active') {
                    activeIndex = i <= 0 ? (this.cards.length - 1) : i - 1
                }
            }

            let active = activeIndex
            let left = (active - 1) < 0 ? (this.cards.length - 1) : (active - 1)
            let right = (active + 1) > (this.cards.length - 1) ? 0 : (active + 1)

            console.log(active)

            for (let i = 0; i < this.cards.length; i++) {
                if (i == active) {
                    this.cards[i].position = 'active'
                } else if (i == left) {
                    this.cards[i].position = 'left'
                } else if (i == right) {
                    this.cards[i].position = 'right'
                } else {
                    this.cards[i].position = 'none'
                }
            }
        },

        handleMouseMove(event, index) {
            const card = event.currentTarget.querySelector('.card');
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 50;
            const rotateY = (x - centerX) / 50;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        },
        resetTilt(event, index) {
            const card = event.currentTarget.querySelector('.card');
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        },
    }
}
</script>