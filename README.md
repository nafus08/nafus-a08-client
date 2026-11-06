# StudioSpace

StudioSpace is a creative-space marketplace for independent filmmakers, photographers, podcasters, musicians, and makers.

## Features

- Discover and filter photo studios, film stages, podcast lounges, music suites, and workshops.
- Create an account with email/password or Google; private APIs require an authenticated session and a signed HTTP-only JWT cookie.
- Add, edit, and delete studio listings. Listing ownership is checked by the API.
- Request a studio booking, review your bookings, and cancel pending requests. The API checks confirmed time-slot overlaps.
- Responsive home page, studio details, theme toggle, custom empty and not-found states, and toast notifications.
- Stack: Next.js App Router, TypeScript, Express, MongoDB, Better Auth, JWT, Sonner, and Lucide.

## Local setup

1. Install Node.js 20.9 or later and run MongoDB locally, or create a MongoDB Atlas database.
2. In `server`, copy `.env.example` to `.env`, set `MONGODB_URI`, and replace `BETTER_AUTH_SECRET` with a random string of at least 32 characters. Set `BETTER_AUTH_URL=http://localhost:5000` and `CLIENT_URL=http://localhost:3000`.
3. In `client`, copy `.env.example` to `.env.local`; the default API URL works for local development.
4. For Google sign-in, create Google OAuth credentials and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the server environment. Add `http://localhost:5000/api/auth/callback/google` as an authorized redirect URI.
5. To enable direct cover-image uploads, add an ImgBB API key to `NEXT_PUBLIC_IMGBB_API_KEY` in `client/.env.local`. A public image URL can also be entered directly.
6. Run `npm install` in both `client` and `server`. Start the API with `npm run dev` in `server` and the website with `npm run dev` in `client`.
7. Visit `http://localhost:3000`, register an account, and use it to create a studio and a booking. Examiner accounts should be created in the deployed app; no shared default password is committed.

## Deployment

Deploy `server` as a Node service and `client` as a Next.js app. The Vercel rewrite in `vercel.json` proxies `/api/*` requests to the API so authentication cookies remain same-origin in the browser. Set the client's `NEXT_PUBLIC_API_URL` to the deployed website origin (for example, `https://your-site.vercel.app`). Set the server's `CLIENT_URL` to that exact origin and `BETTER_AUTH_URL` to the API's public URL. Register the Google callback at `<BETTER_AUTH_URL>/api/auth/callback/google`. Ensure the API host supports Next.js route fallback/reloads.

Live site: add the deployed URL after hosting.

## API

- `GET /api/health`
- `GET /api/studios`, `GET /api/studios/featured`, `GET /api/studios/:id`
- `POST /api/studios`, `PATCH /api/studios/:id`, `DELETE /api/studios/:id`
- `GET /api/studios/mine`
- `POST /api/bookings`, `GET /api/bookings/mine`, `PATCH /api/bookings/:id/cancel`

Private endpoints validate the Better Auth session and a signed JWT in a seven-day HTTP-only cookie. Never commit production credentials or examiner passwords.
