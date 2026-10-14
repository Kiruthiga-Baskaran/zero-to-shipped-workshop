# 0 to Shipped Resume Parser

A MERN starter for submitting a resume PDF and a job description. The API stores
the resume in MongoDB GridFS and saves a comparison record with a
`pending_analysis` status. Resume scoring and skills analysis are intentionally
not implemented yet.

## Requirements

- Node.js 20 or newer
- MongoDB (local or hosted)

## Run locally

1. Configure the backend:

   ```powershell
   Copy-Item backend\.env.example backend\.env
   ```

   Set `MONGODB_URI` in `backend\.env` to your MongoDB connection string.

2. Install dependencies and start the API in one terminal:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. Install dependencies and start the frontend in another terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite (normally `http://localhost:5173`).

The frontend proxies `/api` requests to `http://localhost:5000` during
development. Set `VITE_API_BASE_URL` in `frontend/.env` if the API is hosted at
a different origin.

## API

- `GET /api/health` — API and MongoDB connection status
- `POST /api/comparisons` — multipart form with `resume` (PDF, up to 10 MB)
  and `jobDescription` (required, up to 20,000 characters)
- `GET /api/comparisons/:id` — retrieve a comparison's status and metadata

Resume files are stored in the `resumes` GridFS bucket. Comparison records store
the GridFS file ID, filename, size, job description, and analysis status. The
API does not expose uploaded file contents.

This starter does not include user authentication or authorization. Do not
deploy it publicly with real resumes until access controls are added.

## Deploy to Vercel

Create two Vercel projects from this repository:

1. Set the frontend project's **Root Directory** to `frontend`. Its
   `vercel.json` builds the Vite app and publishes `dist`.
2. Set the backend project's **Root Directory** to `backend`. Its
   `vercel.json` routes requests to the Express serverless function.
3. In the backend project's environment variables, set `MONGODB_URI` and
   `FRONTEND_URL` to your MongoDB connection string and deployed frontend URL.
   Set these for each Vercel environment you use.
4. In the frontend project's environment variables, set
   `VITE_API_BASE_URL` to the deployed backend origin (for example,
   `https://your-api.vercel.app`), then redeploy the frontend. Vite embeds
   `VITE_` variables at build time.
