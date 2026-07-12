import catchThemAll from '~/assets/images/projects/catchThemAll.webp'
import apiHub from '~/assets/images/projects/apiHub.webp'
import gep from '~/assets/images/projects/gep.webp'
import passkeep from '~/assets/images/projects/passkeep.webp'
import mojitoCocktail from '~/assets/images/projects/mojito.webp'

export default [
    {
        id: 1,
        userId: 1,
        title: 'Geodetic Engineers of the Philippines Website',
        description: 'The official website of the Geodetic Engineers of the Philippines (GEP), built to centralize important updates, news, and events for geodetic professionals across the country. The site supports dynamic content management through WordPress, including custom post types, image galleries, and announcement features. It provides a responsive, user-friendly experience tailored for both desktop and mobile users.',
        link: 'https://nationalgep.org',
        githubLink: '',
        status: 'Live',
        isDraft: false,
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: '2024-09-01T00:00:00Z',
        images: {
            cover: gep,
            screenshots: []
        },
        technologies: [
            { id: 1, createdByUserId: null, name: 'WordPress', slug: 'wordpress', category: 'CMS', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 2, createdByUserId: null, name: 'PHP', slug: 'php', category: 'Language', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 3, createdByUserId: null, name: 'SCSS', slug: 'scss', category: 'Styling', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 4, createdByUserId: null, name: 'JavaScript', slug: 'javascript', category: 'Language', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 5, createdByUserId: null, name: 'MySQL', slug: 'mysql', category: 'Database', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
        ]
    },
    {
        id: 2,
        userId: 1,
        title: 'Mojito Cocktail',
        description: 'Mojito Cocktail is a playful front-end project built as a hobby experiment to explore GSAP animations in a React + TypeScript environment. It focuses on practicing smooth motion effects, creative transitions, and interactive UI behavior. The project showcases animation sequencing, component-based design, and responsive layout handling, emphasizing visual polish and code structure discipline.',
        link: 'https://mojito-cocktail-fe7xggurx-alexanders-projects-91906c70.vercel.app/',
        githubLink: 'https://github.com/Gadu25/gsap-mojito-cocktail',
        status: 'Done',
        isDraft: false,
        createdAt: '2024-08-01T00:00:00Z',
        updatedAt: '2024-08-01T00:00:00Z',
        images: {
            cover: mojitoCocktail,
            screenshots: []
        },
        technologies: [
            { id: 6, createdByUserId: null, name: 'React', slug: 'react', category: 'Framework', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 7, createdByUserId: null, name: 'TypeScript', slug: 'typescript', category: 'Language', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 8, createdByUserId: null, name: 'Tailwind CSS', slug: 'tailwind', category: 'Styling', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
        ]
    },
    {
        id: 3,
        userId: 1,
        title: 'CatchThemAll',
        description: 'CatchTheMall is an interactive Pokémon-themed web application designed to provide users with an engaging experience of capturing and viewing various Pokémon. Built using Nuxt.js for server-side rendering, Tailwind CSS for a responsive layout, and SCSS for custom styling, this app offers a visually appealing and fluid user experience. The application allows users to browse, search, and filter through a collection of Pokémon while incorporating smooth, custom animations.',
        link: 'https://catch-them-all-eta.vercel.app/',
        githubLink: 'https://github.com/Gadu25/catchThemAll',
        status: 'Beta',
        isDraft: false,
        createdAt: '2024-07-01T00:00:00Z',
        updatedAt: '2024-07-01T00:00:00Z',
        images: {
            cover: catchThemAll,
            screenshots: []
        },
        technologies: [
            { id: 9, createdByUserId: null, name: 'Nuxt', slug: 'nuxt', category: 'Framework', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 10, createdByUserId: null, name: 'Tailwind', slug: 'tailwind', category: 'Styling', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 11, createdByUserId: null, name: 'JavaScript', slug: 'javascript', category: 'Language', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 12, createdByUserId: null, name: 'NodeJS', slug: 'nodejs', category: 'Runtime', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 13, createdByUserId: null, name: 'Sass', slug: 'sass', category: 'Styling', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
        ]
    },
    {
        id: 4,
        userId: 1,
        title: 'API-Hub',
        description: 'API Hub is a versatile web application that integrates multiple APIs to deliver a seamless and interactive experience. Built using Nuxt.js with Pinia for state management, it showcases advanced skills in API fetching, styling, and dynamic data presentation. The app features real-time weather updates (OpenWeatherMap), the latest news (NewsAPI), stunning photography (Unsplash), country data (REST Countries), random user profiles (RandomUser API), daily jokes (JokeAPI), currency exchange rates (ExchangeRate API), NASA insights, and a library database (Open Library API). With a modern, responsive design, API Hub demonstrates efficient data handling and a polished user experience.',
        link: 'https://api-hub-seven.vercel.app/',
        githubLink: 'https://github.com/Gadu25/api-hub',
        status: 'Ongoing',
        isDraft: false,
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: '2024-06-01T00:00:00Z',
        images: {
            cover: apiHub,
            screenshots: []
        },
        technologies: [
            { id: 14, createdByUserId: null, name: 'Nuxt', slug: 'nuxt', category: 'Framework', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 15, createdByUserId: null, name: 'Tailwind', slug: 'tailwind', category: 'Styling', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 16, createdByUserId: null, name: 'JavaScript', slug: 'javascript', category: 'Language', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 17, createdByUserId: null, name: 'NodeJS', slug: 'nodejs', category: 'Runtime', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 18, createdByUserId: null, name: 'Sass', slug: 'sass', category: 'Styling', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
        ]
    },
    {
        id: 5,
        userId: 1,
        title: 'Passkeep',
        description: 'Passkeep is a secure, cloud-synced password manager focused on simplicity and reliability. It integrates Firebase for real-time data handling and authentication, ensuring user credentials remain protected through encryption. Built with Next.js and Tailwind CSS.',
        link: 'https://passkeep-five.vercel.app/',
        githubLink: '',
        status: 'Live',
        isDraft: false,
        createdAt: '2024-05-01T00:00:00Z',
        updatedAt: '2024-05-01T00:00:00Z',
        images: {
            cover: passkeep,
            screenshots: []
        },
        technologies: [
            { id: 19, createdByUserId: null, name: 'Next.js', slug: 'nextjs', category: 'Framework', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 20, createdByUserId: null, name: 'Tailwind CSS', slug: 'tailwind', category: 'Styling', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
            { id: 21, createdByUserId: null, name: 'Firebase', slug: 'firebase', category: 'Service', isVerified: 'true', createdAt: '2024-01-01T00:00:00Z', updatedAt: null },
        ]
    },
]
