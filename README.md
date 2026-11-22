# 🎬 MoodFlix — Discover Movies That Match Your Mood

<p align="center">
  <img src="public/moodflix.svg" alt="MoodFlix Logo" width="140" />
</p>

<h1 align="center">🎬 MoodFlix</h1>

<h3 align="center">Find Your Movie Mood. Discover Your Next Favorite.</h3>

<p align="center">
  Discover movies, explore different moods, and find your next favorite film.
</p>

<p align="center">
  <a href="https://birukb1152-dot.github.io/mood-movie-finder/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_MoodFlix-blue?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/birukb1152-dot/mood-movie-finder">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TMDB-API-01B4E4?style=flat&logo=themoviedatabase&logoColor=white" alt="TMDB API" />
</p>

<p align="center">
  A modern, responsive movie discovery platform powered by the TMDB API.
</p>

---

## 📖 About the Project

**MoodFlix** is a modern movie discovery platform designed to help users find movies based on their moods, interests, and preferences.

Instead of endlessly browsing movie catalogs, users can select a mood, explore popular movies, search for specific titles, apply filters, and discover detailed information about their favorite films.

Built with React and powered by The Movie Database (TMDB) API, MoodFlix combines an intuitive interface with a smooth and responsive user experience.

## ✨ Features

- 🎭 **Mood-Based Discovery** — Explore movies based on moods such as Happy, Sad, Hype, Chill, Romantic, and Horror.
- 🔍 **Movie Search** — Search for movies by title.
- 🎚️ **Advanced Filters** — Filter movies by rating, release period, and sorting preferences.
- ♾️ **Infinite Scrolling** — Discover more movies automatically while scrolling.
- 🎬 **Movie Details** — Explore descriptions, release dates, genres, ratings, and other movie information.
- ▶️ **Movie Trailers** — Find and watch available movie trailers on YouTube.
- 👥 **Cast & Crew** — Discover actors, their roles, and directors.
- 🎞️ **Similar Movies** — Find movies related to the one you're viewing.
- ❤️ **Favorites System** — Save and remove favorite movies using browser local storage.
- 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile devices.
- ⬆️ **Back to Top** — Quickly return to the top of long movie listings.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite 7 | Development server and build tool |
| Tailwind CSS 4 | Styling and responsive design |
| React Router | Application navigation |
| Axios | API requests |
| TMDB API | Movie data and information |
| Lucide React | Icons |
| JavaScript | Application logic |
| Git & GitHub | Version control |
| GitHub Pages | Deployment |

## 🚀 Live Demo

Experience MoodFlix:

**[Open MoodFlix](https://birukb1152-dot.github.io/mood-movie-finder/)**

## 📸 Screenshots

Screenshots of the application can be added here to demonstrate the homepage, movie details, and favorites pages.

## ⚙️ Installation and Setup

Follow these steps to run MoodFlix locally.

### 1. Clone the repository

```bash
git clone https://github.com/biruk1152-dot/mood-movie-finder.git
```

### 2. Navigate to the project directory

```bash
cd mood-movie-finder
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the TMDB API key

Create a `.env` file in the project's root directory.

Add your TMDB API key:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

You can obtain API credentials from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 6. Build for production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

## 📁 Project Structure

```text
mood-movie-finder/
│
├── public/
│   └── moodflix.svg
│
├── src/
│   ├── components/
│   │   ├── FilterBar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   ├── MoodSelector.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieList.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js
│   │
│   ├── pages/
│   │   ├── Favorites.jsx
│   │   ├── Home.jsx
│   │   └── MovieDetails.jsx
│   │
│   ├── services/
│   │   └── tmdbApi.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## 🌐 Deployment

MoodFlix is deployed using **GitHub Pages**.

The project uses GitHub Actions to:

1. Detect changes pushed to the `main` branch.
2. Install project dependencies.
3. Build the React application using Vite.
4. Generate the production files inside `dist`.
5. Deploy the application to GitHub Pages.

Every successful push to `main` automatically triggers a new deployment.

## 🔑 Environment Variables

MoodFlix requires the following environment variable:

| Variable | Description |
|---|---|
| `VITE_TMDB_API_KEY` | TMDB API key used for movie data requests |

**Important:** Never commit your real `.env` file to GitHub. Keep credentials out of your source repository.

Because Vite exposes `VITE_` variables in client-side JavaScript, the API key is visible to website visitors even when supplied through GitHub Actions secrets.

## 🙏 Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) — For providing movie information, images, and API services.
- [Lucide](https://lucide.dev/) — For beautiful icons.
- [React](https://react.dev/) — For the UI library.
- [Vite](https://vite.dev/) — For the development and build environment.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## 👨‍💻 Developer

**Biruk** — Frontend / Full-Stack Web Developer

- GitHub: [@birukb1152-dot](https://github.com/birukb1152-dot)
- Project: [MoodFlix](https://github.com/birukb1152-dot/mood-movie-finder)
- Live Website: [MoodFlix](https://birukb1152-dot.github.io/mood-movie-finder/)

---

<p align="center">
  Made with ❤️ and React
</p>
