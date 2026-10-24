<div align="center">

# 🌐 Social Media App

**A modern, responsive social networking web app built with React 19, TypeScript & Vite.**

Share posts, follow people, comment, bookmark, and stay up to date with real-time-style notifications — all wrapped in a clean UI with dark mode.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://zeyadhany268.github.io/Social-madia-app/)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Deploy](https://img.shields.io/github/actions/workflow/status/ZeyadHany268/Social-madia-app/main.yml?style=flat-square&label=deploy)

</div>

---

## 📸 Preview

> Add your screenshots or a GIF to a `docs/` folder and update the paths below.

<div align="center">

| Feed | Profile |
| :---: | :---: |
| ![Feed](docs/feed.png) | ![Profile](docs/profile.png) |

| Dark Mode | Notifications |
| :---: | :---: |
| ![Dark mode](docs/dark.png) | ![Notifications](docs/notifications.png) |

</div>

---

## ✨ Features

### 🔐 Authentication
- Sign up and log in with schema-based validation (**React Hook Form + Zod**)
- Token-based sessions with an Axios interceptor that attaches the bearer token automatically
- Protected routes: guests are redirected to login, signed-in users skip the auth pages
- Animated transition between the Login and Signup screens

### 📝 Posts
- Create, edit, and delete your own posts
- Dedicated single-post page
- Share posts, with a preview of the shared post inside the card
- View who liked a post through a likes modal

### 💬 Engagement
- Comment on posts
- Like posts
- Bookmark posts and revisit them on the **Bookmarks** page
- Instant feedback through toast notifications

### 👥 Social
- Follow / unfollow users
- Follow suggestions and mini profile cards
- Your own profile (with edit-profile modal) and public profiles of other users
- **Notifications** page

### 🎨 UX & Design
- Light / dark theme toggle
- Fully responsive layout
- Loading skeletons, empty states, and friendly error states
- Smooth animations powered by **Framer Motion**
- Custom 404 page

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | React 19 |
| **Language** | TypeScript |
| **Build tool** | Vite |
| **Routing** | React Router v7 |
| **Server state** | TanStack Query (React Query) |
| **HTTP client** | Axios |
| **Forms & validation** | React Hook Form, Zod, `@hookform/resolvers` |
| **Styling** | Tailwind CSS v4, Flowbite React, `clsx`, `tailwind-merge` |
| **Animation** | Framer Motion |
| **Icons** | Lucide React, React Icons |
| **Notifications** | React Hot Toast, Sonner |
| **Linting** | Oxlint |
| **CI/CD** | GitHub Actions → GitHub Pages |

---

## 📁 Project Structure

```
src/
├── api/             # Axios client and API modules (posts, users, notifications)
├── Conpunant/       # Reusable UI components (PostCard, Comment, modals, ...)
├── Context/         # Auth token and current-user context providers
├── pages/           # Route-level pages (Home, Profile, Bookmarks, ...)
├── protectedRouts/  # Route guards for authenticated / guest-only pages
├── schema/          # Zod validation schemas
├── Types/           # TypeScript types and interfaces
├── utils/           # Helpers (date formatting, cache invalidation)
├── App.tsx          # Router and providers
└── main.tsx         # App entry point
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) **v22** (recommended)
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ZeyadHany268/Social-madia-app.git

# 2. Move into the project
cd Social-madia-app

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open the local URL printed in your terminal (usually `http://localhost:5173`).

> **Note:** the app is configured with the base path `/Social-madia-app` for GitHub Pages, so open the app under that path if the root URL shows nothing.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the project with Oxlint |

---

## 🔌 API

The app talks to the **Route Posts API** (`https://route-posts.routemisr.com`) through a single Axios instance in [`src/api/client.ts`](src/api/client.ts). The auth token is stored in `localStorage` and injected into every request via an interceptor.

---

## ☁️ Deployment

Every push to `main` triggers the **Deploy Vite App** GitHub Actions workflow, which installs dependencies, builds the project, and publishes the `dist` folder to **GitHub Pages**.

To enable it on your own fork: **Settings → Pages → Source → GitHub Actions**.

---

## 🗺️ Roadmap

- [ ] Real-time notifications
- [ ] Image upload previews and cropping
- [ ] Infinite scroll on the feed
- [ ] Unit and end-to-end tests
- [ ] Arabic / RTL language support

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👤 Author

**Zeyad Hany**

- GitHub: [@ZeyadHany268](https://github.com/ZeyadHany268)
- LinkedIn: _add your LinkedIn profile link here_

---

<div align="center">

⭐ If you like this project, give it a star, it really helps!

</div>
