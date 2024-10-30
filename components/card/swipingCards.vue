<template>
    <div class="swiping-cards">
        <div class="contents">
            <template v-for="(card, index) in cards">
                <div class="card-wrapper" :class="card.position" @mousemove="(event) => handleMouseMove(event, card.position)"
                    @mouseleave="(event) => resetTilt(event, card.position)">
                    <div class="card hover-pointer" @click="clickCard(index)"
                        >
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
                                <small>{{ card.date }}  <i v-if="card.duration.length > 0">. {{ card.duration }}</i></small>
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
                        'Developed a microservices architecture using Docker and Kubernetes, improving system scalability and reducing downtime by 30%.',
                        'Designed and implemented RESTful APIs and GraphQL endpoints, ensuring seamless integration between frontend and backend systems.',
                        'Optimized SQL queries and database schemas, resulting in a 40% performance boost across critical application processes.',
                        'Automated CI/CD pipelines with GitHub Actions, minimizing deployment time and increasing development efficiency.'
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
                        'Developed a microservices architecture using Docker and Kubernetes, improving system scalability and reducing downtime by 30%.',
                        'Designed and implemented RESTful APIs and GraphQL endpoints, ensuring seamless integration between frontend and backend systems.',
                        'Optimized SQL queries and database schemas, resulting in a 40% performance boost across critical application processes.',
                        'Automated CI/CD pipelines with GitHub Actions, minimizing deployment time and increasing development efficiency.'
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
                        'Developed a microservices architecture using Docker and Kubernetes, improving system scalability and reducing downtime by 30%.',
                        'Designed and implemented RESTful APIs and GraphQL endpoints, ensuring seamless integration between frontend and backend systems.',
                        'Optimized SQL queries and database schemas, resulting in a 40% performance boost across critical application processes.',
                        'Automated CI/CD pipelines with GitHub Actions, minimizing deployment time and increasing development efficiency.'
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

            console.log(left, active, right)
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