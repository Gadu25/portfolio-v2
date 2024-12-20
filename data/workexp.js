import galaticLogo from '~/assets/images/galatic_logo.png'
import xtendlyLogo from '~/assets/images/xtendly_logo.png'
import seiLogo from '~/assets/images/sei_logo.webp'

import storybook from '~/assets/images/tech/storybook.png'
import cypress from '~/assets/images/tech/cypress.png'
import quasar from '~/assets/images/tech/quasar.png'
import css from '~/assets/images/tech/css.png'
import bootstrap from '~/assets/images/tech/bootstrap.png'
import javascript from '~/assets/images/tech/javascript.png'
import laravel from '~/assets/images/tech/laravel.png'
import react from '~/assets/images/tech/react.png'
import mysql from '~/assets/images/tech/mysql.png'
import nodejs from '~/assets/images/tech/nodejs.png'
import nuxt from '~/assets/images/tech/nuxt.png'
import php from '~/assets/images/tech/php.png'
import postgresql from '~/assets/images/tech/postgresql.png'
import sass from '~/assets/images/tech/sass.png'
import tailwind from '~/assets/images/tech/tailwind.png'
import vue from '~/assets/images/tech/vue.png'

export default [
    {
        logo: galaticLogo,
        name: 'Galatic Events',
        jobTitle: 'Software Engineer',
        date: '09/2024 - present',
        duration: '',
        isRolesShown: false,
        roles: [
            'Developed a comprehensive frontend component library using Vue.js and Nuxt to support a scalable and modular system architecture.',
            'Utilized Storybook to document and showcase reusable components, ensuring consistent UI/UX across the application.',
            'Crafted maintainable and responsive styles with SCSS, enhancing the design and adaptability of the frontend library.',
            'Implemented end-to-end testing with Cypress to ensure reliability and seamless functionality across components.',
            'Collaborated with cross-functional teams to integrate the frontend library effectively, enhancing development efficiency and consistency.'
        ],
        position: 'active',
        techUsed: [
            {
                name: 'Storybook',
                icon: storybook
            },
            {
                name: 'Vue',
                icon: vue
            },
            {
                name: 'Nuxt',
                icon: nuxt
            },
            {
                name: 'Cypress',
                icon: cypress
            },
            {
                name: 'SCSS',
                icon: sass
            },
            {
                name: 'Javascript',
                icon: javascript
            },
            {
                name: 'Quasar',
                icon: quasar
            },
            {
                name: 'NodeJS',
                icon: nodejs
            }
        ]
    },
    {
        logo: seiLogo,
        name: 'DOST-SEI',
        jobTitle: 'Full Stack Web Developer',
        date: '03/2023 - 08/2024',
        duration: '(1 year 8 months)',
        isRolesShown: false,
        roles: [
            'Developed and maintained a comprehensive Project Management Information System (PMIS) using Vue.js, Bootstrap, and the Laravel framework.',
            'Designed and implemented responsive layouts and UI components to enhance user experience across devices.',
            'Created and managed RESTful APIs to support data integration and communication between frontend and backend systems.',
            'Handled database management and optimization with MySQL, ensuring data integrity and efficient access across the system.',
            'Conducted thorough testing and debugging to ensure reliability and performance of the PMIS application.',
            'Delivered project presentations and demonstrations to stakeholders, showcasing system features and addressing feedback.'
        ],
        position: 'right',
        techUsed: [
            {
                name: 'Vue',
                icon: vue
            },
            {
                name: 'Laravel',
                icon: laravel
            },
            {
                name: 'CSS',
                icon: css
            },
            {
                name: 'Javascript',
                icon: javascript
            },
            {
                name: 'Postgresql',
                icon: postgresql
            },
            {
                name: 'PHP',
                icon: php
            },
            {
                name: 'Bootstrap',
                icon: bootstrap
            },
            {
                name: 'NodeJS',
                icon: nodejs
            }
        ]
    },
    {
        logo: xtendlyLogo,
        name: 'Xtendly Philippines Inc.',
        jobTitle: 'Junior Frontend Web Developer',
        date: '07/2022 - 02/2023',
        duration: '(7 months)',
        isRolesShown: false,
        roles: [
            'Designed and implemented responsive web pages using React, Next.js, Tailwind, and Bootstrap, ensuring cross-device compatibility and optimal user experience.',
            'Developed client-side logic in JavaScript, enhancing interactivity and functionality on web applications.',
            'Collaborated with the design team to translate UI/UX requirements into high-quality, user-friendly interfaces.',
            'Optimized page load performance and improved SEO by applying Next.js optimizations and best practices.',
            'Handled backend tasks, including managing databases with MySQL and creating RESTful APIs using the Laravel framework.',
            'Streamlined front-to-back communication by integrating frontend components with backend APIs, enhancing data flow and usability.'
        ],
        position: 'left',
        techUsed: [
            {
                name: 'React',
                icon: react
            },
            {
                name: 'Tailwind',
                icon: tailwind
            },
            {
                name: 'Javascript',
                icon: javascript
            },
            {
                name: 'Laravel',
                icon: laravel
            },
            {
                name: 'MySQL',
                icon: mysql
            },
            {
                name: 'NodeJS',
                icon: nodejs
            }
        ]
    }
]