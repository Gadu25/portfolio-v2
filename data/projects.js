import storybook from '~/assets/images/tech/storybook.webp'
import cypress from '~/assets/images/tech/cypress.webp'
import quasar from '~/assets/images/tech/quasar.webp'
import css from '~/assets/images/tech/css.webp'
import bootstrap from '~/assets/images/tech/bootstrap.webp'
import javascript from '~/assets/images/tech/javascript.webp'
import typescript from '~/assets/images/tech/typescript.webp'
import laravel from '~/assets/images/tech/laravel.webp'
import react from '~/assets/images/tech/react.webp'
import mysql from '~/assets/images/tech/mysql.webp'
import nodejs from '~/assets/images/tech/nodejs.webp'
import nuxt from '~/assets/images/tech/nuxt.webp'
import php from '~/assets/images/tech/php.webp'
import postgresql from '~/assets/images/tech/postgresql.webp'
import sass from '~/assets/images/tech/sass.webp'
import tailwind from '~/assets/images/tech/tailwind.webp'
import vue from '~/assets/images/tech/vue.webp'
import wordpress from '~/assets/images/tech/wordpress.webp'
import nextjs from '~/assets/images/tech/nextjs.webp'
import firebase from '~/assets/images/tech/firebase.webp'

import catchThemAll from '~/assets/images/projects/catchThemAll.webp'
import apiHub from '~/assets/images/projects/apiHub.webp'
import gep from '~/assets/images/projects/gep.webp'
import passkeep from '~/assets/images/projects/passkeep.webp'
import mojitoCocktail from '~/assets/images/projects/mojito.webp'

export default [
    {
        name: 'Geodetic Engineers of the Philippines Website',
        previewImage: gep, // make sure to import or define this image
        url: 'https://nationalgep.org',
        gitHubUrl: '', // leave empty or null if private or not available
        description: 'The official website of the Geodetic Engineers of the Philippines (GEP), built to centralize important updates, news, and events for geodetic professionals across the country. The site supports dynamic content management through WordPress, including custom post types, image galleries, and announcement features. It provides a responsive, user-friendly experience tailored for both desktop and mobile users.',
        status: {
            title: 'Live',
            color: '#28a745' // green for "live"
        },
        tags: [
            'Client',
            'Organizational',
            'Content Management'
        ],
        contributors: [
            {
                userName: 'chrischase011',
                link: 'https://github.com/chrischase011'
            }
        ],
        techUsed: [
            {
                name: 'WordPress',
                icon: wordpress // define or import the icon
            },
            {
                name: 'PHP',
                icon: php
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
                name: 'MySQL',
                icon: mysql
            }
        ]
    },
    {
        name: 'Mojito Cocktail',
        previewImage: mojitoCocktail,
        url: 'https://mojito-cocktail-fe7xggurx-alexanders-projects-91906c70.vercel.app/',
        gitHubUrl: 'https://github.com/Gadu25/gsap-mojito-cocktail',
        description: 'Mojito Cocktail is a playful front-end project built as a hobby experiment to explore GSAP animations in a React + TypeScript environment. It focuses on practicing smooth motion effects, creative transitions, and interactive UI behavior. The project showcases animation sequencing, component-based design, and responsive layout handling, emphasizing visual polish and code structure discipline.',
        status: {
            title: 'DONE',
            color: '#28a745'
        },
        tags: [
            'For Fun',
            'Hobby',
            'GSAP Practice'
        ],
        contributors: [],
        techUsed: [
            {
                name: 'React',
                icon: react
            },
            {
                name: 'TypeScript',
                icon: typescript
            },
            {
                name: 'Tailwind CSS',
                icon: tailwind
            },
        ]
    },
    {
        name: 'CatchThemAll',
        previewImage: catchThemAll,
        url: 'https://catch-them-all-eta.vercel.app/',
        gitHubUrl: 'https://github.com/Gadu25/catchThemAll',
        description: 'CatchTheMall is an interactive Pokémon-themed web application designed to provide users with an engaging experience of capturing and viewing various Pokémon. Built using Nuxt.js for server-side rendering, Tailwind CSS for a responsive layout, and SCSS for custom styling, this app offers a visually appealing and fluid user experience. The application allows users to browse, search, and filter through a collection of Pokémon while incorporating smooth, custom animations.',
        status: {
            title: 'BETA',
            color: '#FFA500'
        },
        tags: [
            'For Fun',
            'Hobby',
            'API Integration'
        ],
        contributors: [
        ],
        techUsed: [
            {
                name: 'Nuxt',
                icon: nuxt
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
                name: 'NodeJS',
                icon: nodejs
            },
            {
                name: 'Sass',
                icon: sass
            }
        ]
    },
    {
        name: 'API-Hub',
        previewImage: apiHub,
        url: 'https://api-hub-seven.vercel.app/',
        gitHubUrl: 'https://github.com/Gadu25/api-hub',
        description: 'API Hub is a versatile web application that integrates multiple APIs to deliver a seamless and interactive experience. Built using Nuxt.js with Pinia for state management, it showcases advanced skills in API fetching, styling, and dynamic data presentation. The app features real-time weather updates (OpenWeatherMap), the latest news (NewsAPI), stunning photography (Unsplash), country data (REST Countries), random user profiles (RandomUser API), daily jokes (JokeAPI), currency exchange rates (ExchangeRate API), NASA insights, and a library database (Open Library API). With a modern, responsive design, API Hub demonstrates efficient data handling and a polished user experience.',
        status: {
            title: 'ongoing development',
            color: '#FFA500'
        },
        tags: [
            'Experimental',
            'Hobby',
            'API Integration'
        ],
        contributors: [
            {
                userName: 'Gerald Pagsuyoin',
                link: 'https://github.com/gpagsuyoin'
            }
        ],
        techUsed: [
            {
                name: 'Nuxt',
                icon: nuxt
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
                name: 'NodeJS',
                icon: nodejs
            },
            {
                name: 'Sass',
                icon: sass
            }
        ]
    },
    {
        name: 'Passkeep',
        previewImage: passkeep,
        url: 'https://passkeep-five.vercel.app/',
        gitHubUrl: '',
        description: 'Passkeep is a secure, cloud-synced password manager focused on simplicity and reliability. It integrates Firebase for real-time data handling and authentication, ensuring user credentials remain protected through encryption. Built with Next.js and Tailwind CSS.',
        status: {
            title: 'LIVE',
            color: '#28a745'
        },
        tags: [
            'Personal Project',
            'Security',
            'Password Manager'
        ],
        contributors: [],
        techUsed: [
            {
                name: 'Next.js',
                icon: nextjs
            },
            {
                name: 'Tailwind CSS',
                icon: tailwind
            },
            {
                name: 'Firebase',
                icon: firebase
            }
        ]
    },
]