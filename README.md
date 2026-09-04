# Yashodha Jayasinghe — Portfolio

A full-stack portfolio: Vite + React frontend (with a Three.js "orchestration graph"
hero animation), Express + MongoDB backend, Cloudinary for images, and a Claude-powered
AI assistant that answers recruiter questions using only your real data.

## How this is actually structured (read this first)

GitHub Pages only serves static files — it can't run a server or hold database
credentials. So instead of the frontend talking to MongoDB directly, the pieces are:

```
                        ┌─────────────────────────┐
  Recruiter's browser → │  Frontend (GitHub Pages) │
                        └────────────┬─────────────┘
                                     │ HTTPS (public reads + AI chat)
                                     ▼
                        ┌─────────────────────────┐
                        │ Backend — PUBLIC MODE    │  ENABLE_ADMIN=false
                        │ (Render/Railway, free)   │  deployed, always on
                        └────────────┬─────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │   MongoDB Atlas (cloud)  │ ← single source of truth
                        └────────────▲─────────────┘
                                     │
                        ┌────────────┴─────────────┐
                        │ Backend — ADMIN MODE      │  ENABLE_ADMIN=true
                        │ (your laptop, local only) │  you run this to edit content
                        └────────────▲─────────────┘
                                     │ hidden route, PIN + JWT
                        ┌────────────┴─────────────┐
                        │ Frontend (local dev build)│ VITE_ENABLE_ADMIN=true
                        └───────────────────────────┘
```

**One codebase, two modes**, controlled entirely by `ENABLE_ADMIN`:
- **Public mode** (`ENABLE_ADMIN=false` or unset) — only read endpoints (`/api/profile`,
  `/api/projects`, etc.) and the AI chat endpoint exist. This is what you deploy.
- **Admin mode** (`ENABLE_ADMIN=true`) — the write endpoints (`/api/admin/*`) also get
  mounted, protected by a PIN-based login and a short-lived JWT. **Never** set this to
  `true` on anything public — run it only on your own machine.

Both modes point at the **same MongoDB Atlas cluster**, so edits you make locally are
live on the public site immediately — no redeploy needed.

## Project layout

```
backend/     Express API — models, routes, controllers, seed script
frontend/    Vite + React app — public site + hidden admin dashboard
```

## 1. Set up MongoDB Atlas (free tier)

1. Create a free cluster at mongodb.com/atlas.
2. Create a database user and allow network access from anywhere (0.0.0.0/0) — or
   just your IP + your host's IP once you know it.
3. Copy the connection string; you'll use it as `MONGODB_URI` in **both** backend
   `.env` setups below (local admin + deployed public).

## 2. Set up Cloudinary (free tier)

Create a free account at cloudinary.com, grab your Cloud Name, API Key, and API
Secret from the dashboard.

## 3. Get an Anthropic API key

Create a key at console.anthropic.com for the AI recruiter-chat feature. It's used
server-side only — never exposed to the browser.

## 4. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGODB_URI, CLOUDINARY_*, ANTHROPIC_API_KEY
# for your local machine, also set:
#   ENABLE_ADMIN=true
#   ADMIN_PIN=<pick something only you know>
#   JWT_SECRET=<long random string>

npm run seed   # loads your CV data into MongoDB (see seed/seedData.js)
npm run dev    # starts on http://localhost:5000
```

Open `backend/seed/seedData.js` before seeding — a few fields are marked
`REPLACE_ME` because they weren't on your CV or weren't fully specified:
- The "Associate Software Engineer" full-cycle dev/QA role — needs the real
  company name and dates.
- The Boseth Traders project — needs a date and tech stack.
- Extra certifications not on the CV — add them here or later from the dashboard.
- Double-check the Royal College dates (transcribed as March 2007 – August 2021
  from the CV, which looks like it may be a typo).

## 5. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# for local dev against your local admin backend:
#   VITE_API_URL=http://localhost:5000/api
#   VITE_ENABLE_ADMIN=true

npm run dev    # http://localhost:5173
```

Visit the site, scroll to the footer, and click the small gear icon to reach
`/admin/login` — enter your PIN to add/edit experience, projects, certifications,
education, and your profile (including image uploads via Cloudinary).

## 6. Deploying the public site

**Backend (Render, free tier — or Railway/Fly.io, same idea):**
1. Push `backend/` to a GitHub repo (or a subfolder of one).
2. Create a new Web Service on Render pointing at it. Build command `npm install`,
   start command `npm start`.
3. Set environment variables: `MONGODB_URI`, `CLOUDINARY_*`, `ANTHROPIC_API_KEY`,
   `CLIENT_ORIGIN` (your GitHub Pages URL), and **leave `ENABLE_ADMIN` unset**
   (or `false`). This deployment will only ever serve public reads + AI chat.

**Frontend (GitHub Pages):**
1. In `frontend/vite.config.js`, set `base` to match your repo name, e.g. `/portfolio/`.
2. Set `.env` for the production build: `VITE_API_URL=https://your-backend.onrender.com/api`
   and `VITE_ENABLE_ADMIN=false`.
3. Run:
   ```bash
   npm run deploy   # builds and pushes dist/ to the gh-pages branch
   ```
4. Enable GitHub Pages on the repo, serving from the `gh-pages` branch.

Because `VITE_ENABLE_ADMIN=false` at build time, the admin routes and dashboard
code don't even exist in the shipped bundle — there's nothing for a recruiter to
find, poke at, or reverse-engineer.

## 7. Using the AI recruiter chat

The "Ask about me" section on the site calls `POST /api/ai/chat`. On the backend,
`utils/buildAIContext.js` assembles everything currently in MongoDB (profile, bio,
skills, experience, projects, education, certifications) into a system prompt, and
`controllers/aiController.js` sends it to Claude (`ANTHROPIC_MODEL`, defaults to
`claude-sonnet-5`) along with the recruiter's question. It's instructed to answer
only from your real data and say so plainly if something isn't covered — so it
can't accidentally invent achievements. Because the context is rebuilt from the DB
on every request, anything you edit in the admin dashboard is reflected in the AI's
answers immediately.

## 8. The 3D hero animation

`frontend/src/components/Hero3D.jsx` renders an animated node-graph in Three.js
(via react-three-fiber) — nodes in orbit connected by pulsing links, meant to echo
your actual work on distributed/orchestrated systems (Nexar, EV charging networks,
microservices) rather than generic decorative particles. It's pure code — no
external assets required, fully responsive, and respects `prefers-reduced-motion`.

If you want a custom 3D asset instead (e.g. a generated abstract object or avatar),
Higgsfield can generate a `.glb` mesh you could load into this same scene with
`useGLTF` from `@react-three/drei` — happy to generate and wire one in as a next
step if you tell me what style you're picturing (abstract/geometric, a stylized
avatar, something tied to a specific project). I held off on generating one blind
since it uses your Higgsfield credits.

## 9. Adding your own resources (photos, résumé PDF, etc.)

Two options:
- Upload through the admin dashboard (goes to Cloudinary automatically), or
- Drop static files into `frontend/public/resources/` and reference them directly
  (e.g. `/resources/resume.pdf`) — useful for a résumé download link before you've
  wired up Cloudinary.

## Security notes

- `.env` files are git-ignored in both folders — never commit real secrets.
- The AI chat and admin-login routes are rate-limited out of the box.
- Rotate `JWT_SECRET` and pick a non-obvious `ADMIN_PIN` before you rely on this.
- Restrict `CLIENT_ORIGIN` on the deployed backend to your actual GitHub Pages
  domain (avoid `*`).
