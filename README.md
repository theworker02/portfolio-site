# theworker02 Portfolio

![Frontend](https://img.shields.io/badge/frontend-Vite%20%2B%20React-0f172a?logo=vite&logoColor=646CFF)
![Backend](https://img.shields.io/badge/backend-Express-111111?logo=express&logoColor=white)
![Analytics](https://img.shields.io/badge/analytics-Custom%20Dashboard-2563eb)
![Contact](https://img.shields.io/badge/contact-Nodemailer-16a34a)
![Deploy](https://img.shields.io/badge/deploy-Vercel%20%2B%20Railway-black?logo=vercel&logoColor=white)

Production-ready portfolio for `theworker02`, split into a standalone Vite frontend and a standalone Express backend. The frontend handles the public portfolio, GitHub-driven project showcase, demos, and dashboard UI. The backend handles analytics tracking and contact-form email delivery.

## Project Structure

```text
portfolio/
├── frontend/
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   ├── src/
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── README.md
└── .gitignore
```

## What Changed

- Frontend and backend are now fully separated.
- Vercel-specific routing now lives in `frontend/vercel.json`.
- Backend logic no longer depends on the old root `/server` folder.
- Frontend environment usage is normalized around `VITE_API_URL`.
- Root-level mixed build/server artifacts were removed.

## Frontend

Location: [frontend](frontend)

Tech:

- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Vercel Analytics

Key frontend entry points:

- [frontend/src/main.jsx](frontend/src/main.jsx)
- [frontend/src/App.jsx](frontend/src/App.jsx)
- [frontend/src/config/site.ts](frontend/src/config/site.ts)

Frontend routes:

- `/`
- `/projects`
- `/projects/:projectId`
- `/demo/:projectId`
- `/docs`
- `/about`
- `/skills`
- `/github`
- `/dashboard`
- `/contact`
- `/404`

## Backend

Location: [backend](backend)

Tech:

- Node.js
- Express
- Nodemailer
- CORS
- dotenv
- sql.js

Backend endpoints:

- `GET /health`
- `POST /api/view`
- `POST /api/click`
- `GET /api/stats`
- `POST /api/contact`

The backend stores analytics events in a lightweight SQLite-style file under `backend/data/analytics.sqlite` at runtime.

## Environment Variables

Frontend: [frontend/.env.example](frontend/.env.example)

```bash
VITE_API_URL=http://localhost:5000
VITE_GITHUB_HANDLE=theworker02
```

Backend: [backend/.env.example](backend/.env.example)

```bash
EMAIL_USER=matthewlooney5@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

Important:

- `EMAIL_PASS` must be a Gmail App Password, not a normal Gmail password.
- Do not expose backend secrets in the frontend.
- If a real app password was ever committed locally, rotate it before deployment.

## Local Development

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

### Run the backend

```bash
cd backend
npm install
npm start
```

### Local connection

The frontend talks to the backend through:

```js
fetch(`${import.meta.env.VITE_API_URL}/api/contact`)
```

The same base URL is also used for analytics requests.

## Deployment

### Frontend on Vercel

- Root directory: `frontend`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Vercel SPA routing is handled by [frontend/vercel.json](frontend/vercel.json):

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

Recommended frontend production env:

```bash
VITE_API_URL=https://your-backend-domain.example
VITE_GITHUB_HANDLE=theworker02
```

### Backend on Railway or Render

- Root directory: `backend`
- Install command: `npm install`
- Start command: `npm start`

Recommended backend env:

```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
FRONTEND_ORIGIN=https://your-frontend-domain.example
```

## Features

- Apple-inspired multi-page portfolio UI
- GitHub-powered project data and project detail pages
- Dedicated demo routes
- Working contact form backend with Nodemailer
- Analytics tracking for views, clicks, and demo launches
- Live dashboard powered by backend stats
- Lazy-loaded routes and production minification
- Vercel-compatible SPA routing

## Previews

![Portfolio preview](frontend/public/images/portfolio-preview.svg)

![Dashboard preview](frontend/public/images/dashboard-preview.svg)

## Live Website

[Visit My Portfolio](https://portfolio-site-tau-amber.vercel.app/)

## Verification Checklist

- Frontend is isolated inside `frontend/`
- Backend is isolated inside `backend/`
- No mixed root `src`, `index.html`, or server files remain
- Frontend uses `VITE_API_URL`
- Backend owns `/api/contact`, `/api/view`, `/api/click`, and `/api/stats`
- Vercel config lives in `frontend/vercel.json`

