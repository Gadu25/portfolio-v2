import storybook from '~/assets/images/tech/storybook.webp'
import cypress from '~/assets/images/tech/cypress.webp'
import quasar from '~/assets/images/tech/quasar.webp'
import css from '~/assets/images/tech/css.webp'
import bootstrap from '~/assets/images/tech/bootstrap.webp'
import javascript from '~/assets/images/tech/javascript.webp'
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

import catchThemAll from '~/assets/images/projects/catchThemAll.webp'
import apiHub from '~/assets/images/projects/apiHub.webp'

export default [
    {
        name: 'CatchThemAll',
        previewImage: catchThemAll,
        url: 'https://catch-them-all-eta.vercel.app/',
        gitHubUrl: 'https://github.com/Gadu25/catchThemAll',
        description: 'CatchTheMall is an interactive Pokémon-themed web application designed to provide users with an engaging experience of capturing and viewing various Pokémon. Built using Nuxt.js for server-side rendering, Tailwind CSS for a responsive layout, and SCSS for custom styling, this app offers a visually appealing and fluid user experience. The application allows users to browse, search, and filter through a collection of Pokémon while incorporating smooth, custom animations.',
        status: {
            title: 'ongoing development',
            color: '#FFA500'
        },
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
    }
]