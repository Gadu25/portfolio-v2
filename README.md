# Alexander Udag — Portfolio

My personal portfolio website showcasing the projects I've built, the technologies I work with, and my professional experience as a frontend-focused fullstack developer.

**Live at [alexander.udaglab.com](https://alexander.udaglab.com/)**

## Tech Stack

- **Framework:** Nuxt 3 + Vue 3
- **Language:** TypeScript
- **Styling:** SCSS
- **Font:** Space Grotesk
- **Icons:** Font Awesome
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## What's Inside

- **Home** — hero, about me, tech stack, and featured work
- **Projects** — side projects and experiments I've built (Megome, CatchThemAll, API-Hub, Passkeep, and more)
- **Work Experience** — my professional journey from junior dev to frontend engineer
- **Certifications** — courses and certificates from Codecademy, Google, and Udemy
- **Terminal** — a fun interactive terminal Easter egg on the site

## Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

The site runs at `http://localhost:3000`.

## Build & Deploy

```bash
# production build
npm run build

# preview the production build locally
npm run preview

# static generation (if needed)
npm run generate
```

Both the portfolio and the [Megome API platform](https://megome-beta.udaglab.com) (my API-first portfolio infrastructure project) are hosted on Vercel.

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (used server-side) |
| `MEGOME_ACCESS_KEY` | Megome API access key |
| `MEGOME_URL` | Megome API base URL |

Copy `.env.example` to `.env` and fill in your values.

## License

This is my personal portfolio — feel free to take inspiration, but please don't copy it outright.
